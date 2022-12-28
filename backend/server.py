from flask import Flask, render_template
from flask_socketio import SocketIO
from client_handle import ClientHandleNamespace
import sys
from random import randint
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('test.html', device_name='Dell_'+str(randint(0,10)))

if __name__ == '__main__':
    socketio.on_namespace(ClientHandleNamespace('/'))
    socketio.run(app, host='0.0.0.0', port='8000')

