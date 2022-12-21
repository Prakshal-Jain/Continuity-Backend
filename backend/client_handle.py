from flask_socketio import Namespace, emit
from flask import request
import sys
from pymongo import MongoClient
from secrets import token_urlsafe
from bcrypt import hashpw, gensalt, checkpw

client = MongoClient('mongo')
db = client['user-data']
collection = db['records']


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
        tokens_in_use = [device_tab_data.get("device_token") for device_tab_data in tabs_data.values()]
        current_iter = iter(tokens_in_use)
        token = next(current_iter, b'')
        while token != b'':
            if checkpw(device_token, token):
                device_token = token_urlsafe(27).encode()
                current_iter = iter(tokens_in_use)
            token = next(current_iter, b'')
        
        return bytes(device_token)


    def on_login(self, data):
        ClientHandleNamespace.devices_in_use[data.get(
            'user_id')] = ClientHandleNamespace.devices_in_use.get(data.get('user_id'), [])
        ClientHandleNamespace.devices_in_use[data.get(
            'user_id')].append(request.sid)

        user = collection.find_one({'user_id': data.get('user_id')})

        device_token = token_urlsafe(27).encode()

        if user == None:
            user = {'user_id': data.get('user_id'),
                    'devices': {data.get('device_name'): data.get('device_type')},
                    'tabs_data': self.__create_tab(data.get('device_name'), data.get('device_type'), device_token)
                    }
            collection.insert_one(user)
        elif user.get('devices').get(data.get('device_name')) == None:
            device_token = self.__check_for_same_token(device_token, user.get('tabs_data'))
            devices = user.get('devices')
            devices[data.get('device_name')] = data.get('device_type')
            new_device = self.__create_tab(
                data.get('device_name'), data.get('device_type'), device_token)
            user.get('tabs_data').update(new_device)
            collection.update_one({'user_id': data.get('user_id')}, {
                                  "$set": {'devices': devices, 'tabs_data': user.get('tabs_data')}})
            send_update = list(filter(lambda x: x != request.sid,
                               ClientHandleNamespace.devices_in_use[data.get('user_id')]))
            emit('add_device', self.__get_tab_data(
                data.get('device_name'), data.get('device_type')), to=send_update)
        else:
            device_token = self.__check_for_same_token(device_token, user.get('tabs_data'))
            device_tabs_data = user.get('tabs_data').get(user.get('device_name'))
            device_tabs_data['device_token'] = hashpw(device_token, gensalt())
            collection.update_one({'user_id': data.get('user_id')}, {"$set": {'tabs_data': user.get('tabs_data')}})
            

        credentials = {
            "name": data.get('name'),
            "picture": data.get('picture'),
            "user_id": data.get('user_id'),
            "device_name": data.get('device_name'),
            'device_type': data.get('device_type'),
            'device_token': device_token,
            }
        emit('login', {'sucessful': True, "message": credentials})
        emit('all_devices', self.__get_tabs_data(user))
        sys.stderr.flush()
        sys.stdout.flush()

    def on_add_tab(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit("Error: User not found")
            return
        
        device = data.get('device_name')

        new_tabs_data = data.get('tabs_data')
        tabs_data = user.get('tabs_data')
        device_tabs_data = tabs_data.get(device)
        
        if not checkpw(data.get('device_token'), device_tabs_data.get('device_token')):
            emit('Error: device token does not match')
            return
        
        device_tabs = tabs_data.get(device).get('tabs')
        device_tabs.update(new_tabs_data)
        collection.update_one({'user_id': data.get('user_id')}, {"$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid,
                           ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        emit('add_tab', data, to=send_update)
        sys.stderr.flush()
        sys.stdout.flush()

    def on_remove_tab(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit("Error: User not found")
            return
        
        device = data.get('device_name')
        tabs_data = user.get('tabs_data')
        device_tabs_data = tabs_data.get(device)
        
        if not checkpw(data.get('device_token'), device_tabs_data.get('device_token')):
            emit('Error: device token does not match')
            return
        
        device_tabs = tabs_data.get(device).get('tabs')
        if str(data.get('id')) in device_tabs:
            del device_tabs[str(data.get('id'))]
        collection.update_one({'user_id': data.get('user_id')}, {
                                "$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid,
                           ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        emit('remove_tab', data, to=send_update)

    def on_remove_all_tabs(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit("Error: User not found")
            return
    
        device = data.get('device_name')
        tabs_data = user.get('tabs_data')
        device_tabs_data = tabs_data.get(device)
        
        if not checkpw(data.get('device_token'), device_tabs_data.get('device_token')):
        
            emit('Error: device token does not match')
            return
    
        tabs_data.get(device)['tabs'] = {}
        collection.update_one({'user_id': data.get('user_id')}, {"$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid,
                           ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        emit('remove_all_tabs', data, to=send_update)

    def on_update_tab(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit("Error: User not found")
            return

        device = data.get('device_name')
        new_tabs_data = data.get('tabs_data')
        tabs_data = user.get('tabs_data')
        
        device_tabs_data = tabs_data.get(device)
        
        if not checkpw(data.get('device_token'), device_tabs_data.get('device_token')):
            emit('Error: device token does not match')
            return
    
        device_tabs = tabs_data.get(device).get('tabs')
        device_tabs.update(new_tabs_data)
        collection.update_one({'user_id': data.get('user_id')}, {
                                "$set": {'tabs_data': tabs_data}})

        send_update = list(filter(lambda x: x != request.sid,
                           ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        emit('update_tab', data, to=send_update)

    def on_get(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        del user['_id']
        emit('get', user)

    def on_get_my_tabs(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        
        if user == None:
            emit("Error: User not found")
            return

        device = data.get('device_name')
        tabs_data = user.get('tabs_data')
        
        device_tabs_data = tabs_data.get(device)
        
        if not checkpw(data.get('device_token'), device_tabs_data.get('device_token')):
            emit('Error: device token does not match')
            return
        
        return_data = tabs_data.get(data.get('device_name')).get('tabs')
        emit('get_my_tabs', return_data)
    
    def on_logout(self, data):
        # {user_id: _, device_token: _, device_name: _}
        user = collection.find_one({'user_id': data.get('user_id')})
        
        if user == None:
            emit("Error: User not found")
            return

        device = data.get('device_name')
        tabs_data = user.get('tabs_data')

        device_tabs_data = tabs_data.get(device)

        if not checkpw(data.get('device_token'), device_tabs_data.get('device_token')):
            emit('Error: device token does not match')
            return
        
        device_tabs_data = user.get('tabs_data').get(device)
        device_tabs_data['device_token'] = None
        collection.update_one({'user_id': data.get('user_id')}, {"$set": {'tabs_data': user.get('tabs_data')}})

        emit("Success")
        

