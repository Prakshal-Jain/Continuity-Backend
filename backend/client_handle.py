from flask_socketio import Namespace, emit
from flask import request
import sys
from pymongo import MongoClient
from secrets import token_urlsafe
from bcrypt import hashpw, gensalt, checkpw
from features.ultra_search import ultra_search_query

client = MongoClient('mongo')
db = client['user-data']
collection = db['records']

'''
TODO:
1.  Create a new field in user for "enrolled_features"
    Sample: {"ultraBrowsing": True, ...}
2. Fix the current authentication functionality and bugs
3. Introduce "Intelligent Tracking" --> Free
4. Introduce "Tracking Prevention" --> Paid (Later V2.0)
'''


class ClientHandleNamespace(Namespace):
    devices_in_use = {}

    # def __init__(self) -> None:
    #     super().__init__()

    #     users = collection.find({})

    #     for user in users:
    #         ClientHandleNamespace.devices_in_use[user.get('user_id')] = user.get('user_id', [])

    def __create_tab(self, device_name, device_type, device_token):
        return {device_name: {'tabs': {}, 'device_type': device_type, "device_token": hashpw(device_token, gensalt())}}

    def __get_tab_data(self, device_name, device_type):
        new_device = {
            'device_type': device_type,
            'device_name': device_name
        }
        return new_device

    def __get_tabs_data(self, data):
        user_id = data.get('user_id')
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

    def on_login(self, data):
        ClientHandleNamespace.devices_in_use[data.get(
            'user_id')] = ClientHandleNamespace.devices_in_use.get(data.get('user_id'), set())
        print(ClientHandleNamespace.devices_in_use.get(data.get(
            'user_id')))
        ClientHandleNamespace.devices_in_use[data.get(
            'user_id')].add(request.sid)
        print(ClientHandleNamespace.devices_in_use.get(data.get(
            'user_id')))

        user = collection.find_one({'user_id': data.get('user_id')})

        device_token = token_urlsafe(27).encode()

        if user == None:
            user = {
                    'user_id': data.get('user_id'),
                    'name': data.get('name'),
                    'picture': data.get('picture'),
                    'devices': {data.get('device_name'): data.get('device_type')},
                    'tabs_data': self.__create_tab(data.get('device_name'), data.get('device_type'), device_token),
                    'enrolled_features': {'ultra_search_query': False, 'privacy_prevention': False}
                    }
            collection.insert_one(user)
        elif user.get('devices').get(data.get('device_name')) == None:
            device_token = self.__check_for_same_token(
                device_token, user.get('tabs_data'))
            devices = user.get('devices')
            devices[data.get('device_name')] = data.get('device_type')
            new_device = self.__create_tab(
                data.get('device_name'), data.get('device_type'), device_token)
            user.get('tabs_data').update(new_device)
            collection.update_one({'user_id': data.get('user_id')}, {
                                  "$set": {'devices': devices, 'tabs_data': user.get('tabs_data')}})
            send_update = list(filter(lambda x: x != request.sid,
                               ClientHandleNamespace.devices_in_use[data.get('user_id')]))
            print("In new device if of login", flush=True)
            print("SENDING to: ", send_update, flush=True)
            print("Data:", self.__get_tab_data(data.get('device_name'), data.get('device_type')), flush=True)
            # emit('add_device', self.__get_tab_data(data.get('device_name'), data.get('device_type')), to=send_update)
        else:
            device_token = self.__check_for_same_token(device_token, user.get('tabs_data'))
            device_tabs_data = user.get('tabs_data').get(data.get('device_name'))
            device_tabs_data['device_token'] = hashpw(device_token, gensalt())
            collection.update_one({'user_id': data.get('user_id')}, {
                                  "$set": {'tabs_data': user.get('tabs_data')}})

        # Need another field here for enrolled features (see below)
        # enrolled_features: {"ultraBrowsing": True, ...}       # So that we can scale this with other features in the future
        
        credentials = {
            "name": data.get('name'),
            "picture": data.get('picture'),
            "user_id": data.get('user_id'),
            "device_name": data.get('device_name'),
            'device_type': data.get('device_type'),
            'device_token': device_token.decode(),
        }
        emit('login', {'successful': True, "message": credentials})
        emit('all_devices', self.__get_tabs_data(user), to=list(ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        sys.stderr.flush()
        sys.stdout.flush()

    def on_add_tab(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit("add_tab", {'successful': False,
                 "message": "Error: User not found"})
            return

        device = data.get('device_name')

        new_tabs_data = data.get('tabs_data')
        tabs_data = user.get('tabs_data')
        device_tabs_data = tabs_data.get(device)

        if data.get('device_token') == None:
            emit("add_tab", {'successful': False,
                 "message": 'Error: device_token is null'})
            return

        if not checkpw(data.get('device_token').encode(), device_tabs_data.get('device_token')):
            emit("add_tab", {'successful': False,
                 "message": 'Error: device token does not match'})
            return

        device_tabs = tabs_data.get(device).get('tabs')
        device_tabs.update(new_tabs_data)
        collection.update_one({'user_id': data.get('user_id')}, {
                              "$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid,
                           ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        del data['device_token']
        emit('add_tab', data, to=send_update)
        sys.stderr.flush()
        sys.stdout.flush()

    def on_remove_tab(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit('remove_tab', {'successful': False,
                 "message": "Error: User not found"})
            return

        device = data.get('device_name')
        tabs_data = user.get('tabs_data')
        device_tabs_data = tabs_data.get(device)

        if data.get('device_token') == None:
            emit("remove_tab", {'successful': False,
                 "message": 'Error: device_token is null'})
            return

        if not checkpw(data.get('device_token').encode(), device_tabs_data.get('device_token')):
            emit('remove_tab', {'successful': False,
                 "message": 'Error: device token does not match'})
            return

        device_tabs = tabs_data.get(device).get('tabs')
        if str(data.get('id')) in device_tabs:
            del device_tabs[str(data.get('id'))]
        collection.update_one({'user_id': data.get('user_id')}, {
            "$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid,
                           ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        del data['device_token']
        emit('remove_tab', data, to=send_update)

    def on_remove_all_tabs(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit('remove_all_tabs', {'successful': False,
                 "message": "Error: User not found"})
            return

        device = data.get('device_name')
        tabs_data = user.get('tabs_data')
        device_tabs_data = tabs_data.get(device)

        if data.get('device_token') == None:
            emit("remove_all_tabs", {'successful': False,
                 "message": 'Error: device_token is null'})
            return

        if not checkpw(data.get('device_token').encode(), device_tabs_data.get('device_token')):

            emit('remove_all_tabs', {
                 'successful': False, "message": 'Error: device token does not match'})
            return

        tabs_data.get(device)['tabs'] = {}
        collection.update_one({'user_id': data.get('user_id')}, {
                              "$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid,
                           ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        del data['device_token']
        emit('remove_all_tabs', data, to=send_update)

    def on_update_tab(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit('update_tab', {'successful': False,
                 "message": "Error: User not found"})
            return

        device = data.get('device_name')
        new_tabs_data = data.get('tabs_data')
        tabs_data = user.get('tabs_data')

        device_tabs_data = tabs_data.get(device)

        if data.get('device_token') == None:
            emit("update_tab", {'successful': False,
                 "message": 'Error: device_token is null'})
            return

        if not checkpw(data.get('device_token').encode(), device_tabs_data.get('device_token')):
            emit('update_tab', {'successful': False,
                 "message": 'Error: device token does not match'})
            return

        device_tabs = tabs_data.get(device).get('tabs')
        device_tabs.update(new_tabs_data)
        collection.update_one({'user_id': data.get('user_id')}, {
            "$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid,
                           ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        del data['device_token']
        emit('update_tab', data, to=send_update)

    def on_get(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        del user['_id']
        emit('get', user)

    def on_get_my_tabs(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})

        if user == None:
            emit("get_my_tabs", {'successful': False,
                 "message": "Error: User not found"})
            return

        device = data.get('device_name')
        tabs_data = user.get('tabs_data')

        device_tabs_data = tabs_data.get(device)

        if data.get('device_token') == None:
            emit("get_my_tabs", {'successful': False,
                 "message": 'Error: device_token is null'})
            return

        if not checkpw(data.get('device_token').encode(), device_tabs_data.get('device_token')):
            emit("get_my_tabs", {'successful': False,
                 "message": 'Error: device token does not match'})
            return

        return_data = tabs_data.get(data.get('device_name')).get('tabs')
        emit('get_my_tabs', return_data)
    
    def on_all_devices(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})

        if user == None:
            emit('all_devices', {'sucessful': False,
                 "message": "Error: User not found"})
            return

        device = data.get('device_name')
        tabs_data = user.get('tabs_data')

        device_tabs_data = tabs_data.get(device)

        if data.get('device_token') == None:
            emit("all_devices", {'sucessful': False,
                 "message": 'Error: device_token is null'})
            return

        if not checkpw(data.get('device_token').encode(), device_tabs_data.get('device_token')):
            emit('all_devices', {'sucessful': False,
                 "message": 'Error: device token does not match'})
            return

        emit('all_devices', self.__get_tabs_data(user))
    
    def on_enroll_feature(self, data):
        user_id = data.get('user_id')
        device_name = data.get('device_name')
        device_token = data.get('device_token')
        feature_name = data.get('feature_name')

        user = collection.find_one({'user_id': user_id})

        if user == None:
            emit("enroll_feature", {'successful': False,
                 "message": "Error: User not found"})
            return
        
        if device_token == None:
            emit("enroll_feature", {'sucessful': False,
                 "message": 'Error: device_token is null'})
            return
        
        if feature_name not in ['ultra_search_query', 'privacy_prevention']:
            emit("enroll_feature", {'sucessful': False,
                 "message": 'Error: feature_name not valid'})
            return

        tabs_data = user.get('tabs_data')
        device_tabs_data = tabs_data.get(device_name)

        if not checkpw(data.get('device_token').encode(), device_tabs_data.get('device_token')):
            emit('enroll_feature', {'sucessful': False,
                 "message": 'Error: device token does not match'})
            return
        
        collection.update_one({'user_id': user_id}, {"$set": {f'enrolled_features.{feature_name}': True}})

        emit('enroll_feature', {'sucessful': True})


    def on_ultra_search_query(self, data):
        user_id = data.get('user_id')
        device_name = data.get('device_name')
        device_token = data.get('device_token')
        prompt = data.get('prompt', '')
        
        if prompt == '':
            emit('ultra_search_query', {'successful': False, 'message': 'Error: Query is empty'})
            return

        user = collection.find_one({'user_id': user_id})

        if user == None:
            emit("ultra_search_query", {'successful': False,
                 "message": "Error: User not found"})
            return
        
        if not user.get('enrolled_features', {}).get('ultra_search_query'):
            emit("ultra_search_query", {'sucessful': False,
                 "message": 'Error: User not enrolled in ultra search'})
            return

        if device_token == None:
            emit("ultra_search_query", {'sucessful': False,
                 "message": 'Error: device_token is null'})
            return
        
        tabs_data = user.get('tabs_data')
        device_tabs_data = tabs_data.get(device_name)

        if not checkpw(data.get('device_token').encode(), device_tabs_data.get('device_token')):
            emit('ultra_search_query', {'sucessful': False,
                 "message": 'Error: device token does not match'})
            return

        response = ultra_search_query({'prompt': data.get('prompt')})

        emit("ultra_search_query", response)

    def on_auto_authenticate(self, data):
        user_id = data.get('user_id')
        device_name = data.get('device_name')
        device_token = data.get('device_token')

        data = collection.find({f'tabs_data.{device_name}':  {'$exists': True}})

        for d in data:
            print(d, flush=True)
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
                user = collection.find_one({'user_id': user_id_from_data})
                emit('auto_authenticate', {'successful': True, 'message': credentials})
                emit('all_devices', self.__get_tabs_data(user))
                print(ClientHandleNamespace.devices_in_use.get(user_id))
                ClientHandleNamespace.devices_in_use[user_id_from_data].add(request.sid)
                print(ClientHandleNamespace.devices_in_use.get(user_id))
                return
        emit('auto_authenticate', {'successful': False, 'message': 'Error: User not found'})
    
    def on_logout(self, data):
        # {user_id: _, device_token: _, device_name: _}
        user_id = data.get('user_id')
        user = collection.find_one({'user_id': user_id})

        if user == None:
            emit('logout', {'successful': False,
                 "message": "Error: User not found"})
            return

        device = data.get('device_name')
        tabs_data = user.get('tabs_data')

        device_tabs_data = tabs_data.get(device)

        if data.get('device_token') == None:
            emit("logout", {'successful': False,
                 "message": 'Error: device_token is null'})
            return

        if not checkpw(data.get('device_token').encode(), device_tabs_data.get('device_token')):
            emit('logout', {'successful': False,
                 "message": 'Error: device token does not match'})
            return

        device_tabs_data = user.get('tabs_data').get(device)
        device_tabs_data['device_token'] = None
        collection.update_one({'user_id': user_id}, {"$set": {'tabs_data': user.get('tabs_data')}})
        print(ClientHandleNamespace.devices_in_use.get(user_id))
        ClientHandleNamespace.devices_in_use.get(user_id).remove(request.sid)
        print(ClientHandleNamespace.devices_in_use.get(user_id))

        emit('logout', "Success")
        print("Logged Out Successfully")







        



