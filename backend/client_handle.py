from flask_socketio import Namespace, emit

class ClientHandleNamespace(Namespace):
    def on_login(self, data):
        self.user_id = data.get('user_id')

    def on_add_tab(self, data):
        pass

    def on_remove_tab(self, data):
        pass

    def on_update_tab(self, data):
        emit('my_response', data)