from flask_socketio import Namespace, emit
from flask import request
import sys
from pymongo import MongoClient
from bson.objectid import ObjectId
from secrets import token_urlsafe
from bcrypt import hashpw, gensalt, checkpw
from features.ultra_search import ultra_search_query
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

client = MongoClient('mongo')
db = client['user_data']
users = db['users']
privacy_report = db['privacy_report_data']
ultra_search = db['ultra_search']
history = db['history']

privacy_report.create_index('expireAt', expireAfterSeconds=0)
history.create_index('expireAt', expireAfterSeconds=0)

class ClientHandleNamespace(Namespace):
    devices_in_use = {}

    def __create_tab(self, device_name, device_type, device_token):
        return {device_name: {'tabs': {}, 'device_type': device_type, "device_token": hashpw(device_token, gensalt())}}

    def __get_tab_data(self, device_name, device_type):
        new_device = {
            'device_type': device_type,
            'device_name': device_name
        }
        return new_device

    def __get_tabs_data(self, data):
        devices = data.get('devices')
        return_tabs_data = []
        tabs_data = data.get('tabs_data')
        for (key, value) in tabs_data.items():
            new_structure = {
                'device_type': devices.get(key),
                'device_name': key
            }
            return_tabs_data.append(new_structure)

        return return_tabs_data
    
    def __authenticate_device(self, event, user, data):
        if user is None:
            emit(event, {'successful': False,
                 "message": "Error: User not found"})
            return False

        device_token = data.get('device_token', '')
        if device_token == '':
            emit(event, {'successful': False, "message": 'Error: device_token is null'})
            return False
        
        device = data.get('device_name')
        tabs_data = user.get('tabs_data')
        device_tabs_data = tabs_data.get(device)

        if not checkpw(device_token.encode(), device_tabs_data.get('device_token', b'')):
            emit(event, {'successful': False, "message": 'Error: device token does not match'})
            return False
        
        return True

    def __check_for_same_token(self, device_token, tabs_data):
        tokens_in_use = [device_tab_data.get(
            "device_token") for device_tab_data in tabs_data.values()]
        current_iter = iter(tokens_in_use)
        token = next(current_iter, b'')
        while token != b'':
            if token != None and checkpw(device_token, token):
                device_token = token_urlsafe(27).encode()
                current_iter = iter(tokens_in_use)
            token = next(current_iter, b'')

        return device_token
    
    def __sort_arrays(self, arr1, arr2, arr3):
        if(len(arr3) == 0):
            return arr1, arr2, arr3
        paired = list(zip(arr1, arr2, arr3))
        paired.sort(key=lambda x: x[2], reverse=True)
        arr1, arr2, arr3 = zip(*paired)
        return list(arr1), list(arr2), list(arr3)

    def on_login(self, data):
        ClientHandleNamespace.devices_in_use[data.get(
            'user_id')] = ClientHandleNamespace.devices_in_use.get(data.get('user_id'), set())
        ClientHandleNamespace.devices_in_use[data.get(
            'user_id')].add(request.sid)

        user = users.find_one({'user_id': data.get('user_id')})

        device_token = token_urlsafe(27).encode()

        if user == None:
            user = {
                'user_id': data.get('user_id'),
                'name': data.get('name'),
                'picture': data.get('picture'),
                'devices': {data.get('device_name'): data.get('device_type')},
                'tabs_data': self.__create_tab(data.get('device_name'), data.get('device_type'), device_token),
                'enrolled_features': {'ultra_search': 
                                        {'enrolled': False, 'switch': False},
                                    'privacy_prevention':
                                        {'enrolled': False, 'switch': False}
                                    }
                    }
            users.insert_one(user)

        elif user.get('devices').get(data.get('device_name')) == None:
            device_token = self.__check_for_same_token(device_token, user.get('tabs_data'))
            devices = user.get('devices')
            devices[data.get('device_name')] = data.get('device_type')
            new_device = self.__create_tab(data.get('device_name'), data.get('device_type'), device_token)
            user.get('tabs_data').update(new_device)
            users.update_one({'user_id': data.get('user_id')}, {
                                  "$set": {'devices': devices, 'tabs_data': user.get('tabs_data')}})
            send_update = list(filter(lambda x: x != request.sid,
                               ClientHandleNamespace.devices_in_use[data.get('user_id')]))
            emit('add_device',
                 {
                     'successful': True,
                     'message': self.__get_tab_data(
                         data.get('device_name'), data.get('device_type'))
                 },
                 to=send_update)
        else:
            device_tabs_data = user.get('tabs_data').get(data.get('device_name'))
            
            if device_tabs_data.get('device_token', None) is not None:
                emit('login', {'successful': False, 'message': 'Error: Device already logged in'})
                return
            
            device_token = self.__check_for_same_token(device_token, user.get('tabs_data'))
            device_tabs_data['device_token'] = hashpw(device_token, gensalt())
            users.update_one({'user_id': data.get('user_id')}, {"$set": {'tabs_data': user.get('tabs_data')}})
            
        credentials = {
            "name": data.get('name'),
            "picture": data.get('picture'),
            "user_id": data.get('user_id'),
            "device_name": data.get('device_name'),
            'device_type': data.get('device_type'),
            'device_token': device_token.decode(),
            'enrolled_features': user.get('enrolled_features')
        }
        emit('login', {'successful': True, "message": credentials})
        emit('all_devices', {'successful': True, 'message': self.__get_tabs_data(user)})
        sys.stderr.flush()
        sys.stdout.flush()

    def on_add_tab(self, data):
        user = users.find_one({'user_id': data.get('user_id')})
        if not self.__authenticate_device('add_tab', user, data):
            return

        target_device = data.get('target_device')
        new_tabs_data = data.get('tabs_data')
        tabs_data = user.get('tabs_data')
        device_tabs = tabs_data.get(target_device).get('tabs', {})
        device_tabs.update(new_tabs_data)
        users.update_one({'user_id': data.get('user_id')}, {"$set": {'tabs_data': tabs_data}})

        del data['device_token']
        send_update = list(filter(lambda x: x != request.sid, ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        emit('add_tab', {'successful': True, "message": data}, to=send_update)
        sys.stderr.flush()
        sys.stdout.flush()

    def on_remove_tab(self, data):
        user = users.find_one({'user_id': data.get('user_id')})
        if not self.__authenticate_device('remove_tab', user, data):
            return

        target_device = data.get('target_device')
        tabs_data = user.get('tabs_data')
        device_tabs = tabs_data.get(target_device).get('tabs')
        tab_id = str(data.get('id', -1))
        if tab_id in device_tabs:
            del device_tabs[tab_id]
        users.update_one({'user_id': data.get('user_id')}, {"$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid, ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        
        del data['device_token']
        
        emit('remove_tab', {'successful': True, "message": data}, to=send_update)

    def on_remove_all_tabs(self, data):
        user = users.find_one({'user_id': data.get('user_id')})
        if not self.__authenticate_device('remove_all_tabs', user, data):
            return

        target_device = data.get('target_device')
        tabs_data = user.get('tabs_data')
        tabs_data.get(target_device)['tabs'] = {}
        users.update_one({'user_id': data.get('user_id')}, {"$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid,
                           ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        
        del data['device_token']
        
        emit('remove_all_tabs', {'successful': True, "message": data}, to=send_update)

    def on_update_tab(self, data):
        user = users.find_one({'user_id': data.get('user_id')})
        if not self.__authenticate_device('update_tab', user, data):
            return

        target_device = data.get('target_device')
        new_tabs_data = data.get('tabs_data')
        tabs_data = user.get('tabs_data')
        device_tabs = tabs_data.get(target_device, {}).get('tabs')
        device_tabs.update(new_tabs_data)
        users.update_one({'user_id': data.get('user_id')}, {
            "$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid, ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        
        del data['device_token']
        
        emit('update_tab', {'successful': True, "message": data}, to=send_update)

    def on_get(self, data):
        user = users.find_one({'user_id': data.get('user_id')})
        privacy = list(privacy_report.find({'user_id': data.get('user_id')}))
        for p in privacy:
            print('privacy_record: ', p, flush=True)
            del p['_id']
            del p['expireAt']
        del user['_id']
        emit('get', {'successful': True, "message": [user, privacy]})

    def on_get_my_tabs(self, data):
        user = users.find_one({'user_id': data.get('user_id')})
        if not self.__authenticate_device('get_my_tabs', user, data):
            return

        target_device = data.get('target_device')
        tabs_data = user.get('tabs_data')
        return_data = tabs_data.get(target_device).get('tabs', {})
        emit('get_my_tabs', {'successful': True, "message": return_data})

    def on_all_devices(self, data):
        user = users.find_one({'user_id': data.get('user_id')})
        if not self.__authenticate_device('all_devices', user, data):
            return

        emit('all_devices', {'successful': True, "message": self.__get_tabs_data(user)})

    def on_enroll_feature(self, data):
        user_id = data.get('user_id')

        user = users.find_one({'user_id': user_id})

        if not self.__authenticate_device('enroll_feature', user, data):
            return

        feature_name = data.get('feature_name')
        is_enrolled = bool(data.get('is_enrolled'))

        if feature_name not in ['ultra_search', 'privacy_prevention']:
            emit("enroll_feature", {'successful': False,
                 "message": 'Error: feature_name not valid'})
            return
        
        if (not is_enrolled) and user.get('enrolled_features', {}).get(feature_name, {}).get('enrolled', False):
            emit('enroll_feature', {'successful': False,
                 "message": 'Error: User is already enrolled'})
            return

        users.update_one({'user_id': user_id}, {"$set": {f'enrolled_features.{feature_name}': {'enrolled': not is_enrolled, 'switch': not is_enrolled}}})
        credentials = {
            "name": user.get('name'),
            "picture": user.get('picture'),
            "user_id": user.get('user_id'),
            "device_name": data.get('device_name'),
            'device_type': user.get('devices').get(data.get('device_name')),
            'device_token': data.get('device_token'),
            'enrolled_features': (users.find_one({'user_id': user_id})).get('enrolled_features')
        }
        emit('enroll_feature', {'successful': True, 'message': credentials})
    
    
    def on_switch_feature(self, data):
        user_id = data.get('user_id')

        user = users.find_one({'user_id': user_id})

        if not self.__authenticate_device('switch_feature', user, data):
            return

        feature_name = data.get('feature_name')

        if feature_name not in ['ultra_search', 'privacy_prevention']:
            emit("switch_feature", {'successful': False,
                 "message": 'Error: feature_name not valid'})
            return
        
        if not user.get('enrolled_features', {}).get(feature_name, {}).get('enrolled', False):
            emit("ultra_search_query", {'successful': False,
                 "message": f'Error: User not enrolled in {feature_name}'})
            return
        
        switch = bool(data.get('switch'))

        users.update_one({'user_id': user_id}, {"$set": {f'enrolled_features.{feature_name}.switch': switch}})
        credentials = {
            "name": user.get('name'),
            "picture": user.get('picture'),
            "user_id": user.get('user_id'),
            "device_name": data.get('device_name'),
            'device_type': user.get('devices').get(data.get('device_name')),
            'device_token': data.get('device_token'),
            'enrolled_features': (users.find_one({'user_id': user_id})).get('enrolled_features')
        }
        emit('switch_feature', {'successful': True, "message": credentials})

    def on_ultra_search_query(self, data):
        user_id = data.get('user_id')
        prompt = data.get('prompt', '')

        if prompt == '':
            emit('ultra_search_query', {
                 'successful': False, 'message': 'Error: Query is empty'})
            return

        user = users.find_one({'user_id': user_id})

        if not self.__authenticate_device('ultra_search_query', user, data):
            return

        if not user.get('enrolled_features', {}).get('ultra_search').get('enrolled'):
            emit("ultra_search_query", {'successful': False,
                 "message": 'Error: User not enrolled in ultra search'})
            return

        if not user.get('enrolled_features', {}).get('ultra_search').get('switch'):
            emit("ultra_search_query", {'successful': False,
                 "message": 'Error: Ultra search is currently disabled by the user.'})
            return

        response = ultra_search_query({'prompt': data.get('prompt')})
        emit("ultra_search_query", {'successful': True, "message": response})

    def on_report_privacy_trackers(self, data):
        user_id = data.get('user_id')

        user = users.find_one({'user_id': user_id})

        if not self.__authenticate_device('report_privacy_trackers', user, data):
            return
    
        target_device = data.get('target_device')
        website_host = data.get('website_host')
        tracker = data.get('tracker')
        
        privacy_report.insert_one({
            'user_id': user_id,
            'device': target_device,
            'website_host': website_host,
            'tracker': tracker,
            'expireAt': datetime.utcnow() + timedelta(days=30)

        })

        emit('report_privacy_trackers', {'successful': True})

    def on_privacy_report(self, data):
        user_id = data.get('user_id')

        user = users.find_one({'user_id': user_id})

        if not self.__authenticate_device('privacy_report', user, data):
            return
        
        target_device = data.get('target_device')
        
        data = privacy_report.aggregate( 
            [
                {'$match': {'user_id': user_id, 'device': target_device}},
                {'$group': {"_id": {'website_host': "$website_host", 'tracker': "$tracker"}}}
            ]
        )

        restructured_data = {}

        for record in data:
            record_wh = record.get('_id').get('website_host')
            record_t = record.get('_id').get('tracker')

            restructured_data[record_wh] = restructured_data.get(record_wh, []) 
            restructured_data[record_wh].append(record_t)
        
        tracker_counts = []
        websites = []
        trackers = []

        for (key, value) in restructured_data.items():
            tracker_counts.append(len(value))
            websites.append(key)
            trackers.append(value)
        
        websites, trackers, tracker_counts = self.__sort_arrays(websites, trackers, tracker_counts)
        emit('privacy_report', {'successful': True, "message": {"tracker_counts": tracker_counts, "websites": websites, "trackers": trackers}})
        
    def on_set_history(self, data):
        user_id = data.get('user_id')

        user = users.find_one({'user_id': user_id})

        if not self.__authenticate_device('set_history', user, data):
            return
        
        target_device = data.get('target_device')
        url = data.get('url')
        title = data.get('title')
        
        history.insert_one({
            'user_id': user_id,
            'device': target_device,
            'url': url,
            'title': title,
            'expireAt': datetime.utcnow() + timedelta(days=30)
        })

        emit('set_history', {'successful': True})


    def on_get_history(self, data):
        user_id = data.get('user_id')

        user = users.find_one({'user_id': user_id})

        if not self.__authenticate_device('get_history', user, data):
            return

        target_device = data.get('target_device')
        page = int(data.get('page'))
        timezone = ZoneInfo(data.get('timezone', 'UTC'))
        page_count = (page - 1)*50
        data = history.find({'user_id': user_id, 'device': target_device}).sort("_id", -1).skip(page_count).limit(51)

        user_history = []

        count = 0
        running_date = ''
        
        for p in data:
            count+=1
            if count == 51:
                break
            date = p.get('_id').generation_time.astimezone(timezone)
            str_date = date.strftime('%b %-d, %Y')
            if running_date != str_date:
                user_history.append({'date': str_date, 'date_history': []})
                running_date = str_date
            user_history[-1]['date_history'].append({'url': p.get('url'), 'id': str(p.get('_id')), 'title': p.get('title')})

        if count == 0:
            emit('get_history', {'successful': False, "message": f'Error: History at page {page} is empty'})
            return
        
        emit('get_history', {'successful': True, "message": {'next': count == 51, 'history': user_history}})

    def on_delete_history(self, data):
        user_id = data.get('user_id')

        user = users.find_one({'user_id': user_id})

        if not self.__authenticate_device('get_history', user, data):
            return
        
        target_device = data.get('target_device')
        id = data.get('id')
        is_delete_all = data.get('is_delete_all', False)

        if id == None and is_delete_all:
            history.delete_many({'user_id': user_id, 'device': target_device})
        elif id != None:
            history.delete_one({'_id': ObjectId(id)})
        else:
            emit('delete_history', {'successful': False, 'message': 'Error: Incorrect query'})
            return
        
        emit('delete_history', {'successful': True, 'message': {'is_delete_all': is_delete_all, 'id': id}})

    def on_auto_authenticate(self, data):
        device_name = data.get('device_name')
        device_token = data.get('device_token')

        data = users.find({f'tabs_data.{device_name}':  {'$exists': True}})

        for d in data:
            user_id_from_data = d.get('user_id')
            tabs_data_from_data = d.get('tabs_data')
            device_data_from_data = tabs_data_from_data.get(device_name)
            device_token_from_data = device_data_from_data.get('device_token')

            if device_token_from_data != None and checkpw(device_token.encode(), device_token_from_data):
                credentials = {
                    "name": d.get('name'),
                    "picture": d.get('picture'),
                    "user_id": user_id_from_data,
                    "device_name": device_name,
                    'device_type': device_data_from_data.get('device_type'),
                    'device_token': device_token,
                }
                user = users.find_one({'user_id': user_id_from_data})
                credentials['enrolled_features'] = user.get(
                    'enrolled_features')
                emit('auto_authenticate', {
                     'successful': True, 'message': credentials})
                emit('all_devices', {'successful': True,
                     'message': self.__get_tabs_data(user)})
                ClientHandleNamespace.devices_in_use[user_id_from_data].add(
                    request.sid)
                return
        emit('auto_authenticate', {'successful': False, 'message': 'Error: User not found'})

    def on_logout(self, data):
        user_id = data.get('user_id')
        user = users.find_one({'user_id': user_id})
        if not self.__authenticate_device('logout', user, data):
            return

        device = data.get('device_name')
        tabs_data = user.get('tabs_data')
        device_tabs_data = tabs_data.get(device)

        device_tabs_data['device_token'] = None
        users.update_one({'user_id': user_id}, {"$set": {'tabs_data': user.get('tabs_data')}})
        
        ClientHandleNamespace.devices_in_use.get(user_id).remove(request.sid)
        
        emit('logout', {"successful": True})
        print("Logged Out Successfully")
    