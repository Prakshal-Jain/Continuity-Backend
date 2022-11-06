from flask_socketio import Namespace, emit
from flask import request
import sys
from pymongo import MongoClient

client = MongoClient('mongo')
db = client['user-data']
collection = db['records']


class ClientHandleNamespace(Namespace):
    devices_in_use = {}
    
    def __create_tab(self, device_name, device_type):
        return {device_name: {'tabs': {}, 'device_type': device_type}}
    
    def __get_tabs_data(self, data):
        user_id = data.get('user_id')
        devices = data.get('devices')
        return_tabs_data = []
        tabs_data = data.get('tabs_data')
        for (key, value) in tabs_data.items():
            new_structure = {
                'user_id': user_id,
                'tabs': value.get('tabs'),
                'device_type': devices.get(key),
                'device_name': key
            }
            return_tabs_data.append(new_structure)

        return return_tabs_data

    def on_login(self, data):
        ClientHandleNamespace.devices_in_use[data.get('user_id')] = ClientHandleNamespace.devices_in_use.get(data.get('user_id'),[])
        ClientHandleNamespace.devices_in_use[data.get('user_id')].append(request.sid)
        
        user = collection.find_one({'user_id': data.get('user_id')})
        
        if user == None:
            user = {'user_id': data.get('user_id'),
                    'devices': {data.get('device_name'): data.get('device_type')},
                    'tabs_data': self.__create_tab(data.get('device_name'), data.get('device_type'))}
            collection.insert_one(user)
        elif user.get('devices').get(data.get('device_name')) == None:
            user.get('devices')[data.get('device_name')] = data.get('device_type')
            user.get('tabs_data').update(self.__create_tab(data.get('device_name'), data.get('device_type')))
            collection.update_one({'user_id':data.get('user_id')},
                                {"$set":{'devices':user.get('devices'), 'tabs_data': user.get('tabs_data')}})
        
        emit('login', {'sucessful': True, "message": ""})
        emit('tabs_updated', self.__get_tabs_data(user))
        sys.stderr.flush()
        sys.stdout.flush()

    def on_add_tab(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit('error')
        else:
            device = data.get('device_name')
            new_tabs_data = data.get('tabs_data')
            tabs_data = user.get('tabs_data')
            device_tabs = tabs_data.get(device).get('tabs')
            device_tabs.update(new_tabs_data)
            collection.update_one({'user_id': data.get('user_id')}, {"$set":{'tabs_data': tabs_data}})
        
        send_update = list(filter(lambda x:x != request.sid, ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        emit('add_tab', data, to=send_update)
        sys.stderr.flush()
        sys.stdout.flush()

    def on_remove_tab(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit('error')
        else:
            device = data.get('device_name')
            new_tabs_data = data.get('tabs_data')
            tabs_data = user.get('tabs_data')
            device_tabs = tabs_data.get(device).get('tabs')
            del device_tabs[str(data.get('id'))]
            collection.update_one({'user_id': data.get('user_id')}, {"$set":{'tabs_data': tabs_data}})
        
        send_update = list(filter(lambda x:x != request.sid, ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        emit('remove_tab', data, to=send_update)

    def on_update_tab(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        if user == None:
            emit('error')
        else:
            device = data.get('device_name')
            new_tabs_data = data.get('tabs_data')
            tabs_data = user.get('tabs_data')
            device_tabs = tabs_data.get(device).get('tabs')
            device_tabs.update(new_tabs_data)
            collection.update_one({'user_id': data.get('user_id')}, {"$set":{'tabs_data': tabs_data}})
        
        send_update = list(filter(lambda x:x != request.sid, ClientHandleNamespace.devices_in_use[data.get('user_id')]))
        emit('update_tab', data, to=send_update)

    def on_get(self, data):
        user = collection.find_one({'user_id': data.get('user_id')})
        del user['_id']
        emit('get', user)