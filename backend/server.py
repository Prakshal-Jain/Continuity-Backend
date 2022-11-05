from flask import Flask, render_template
from flask_socketio import SocketIO
from client_handle import ClientHandleNamespace
import sys

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    print("IN PATH / HERE")
    return 'hello'

if __name__ == '__main__':
    print("HERE 3")
    socketio.on_namespace(ClientHandleNamespace('/test'))
    socketio.run(app, host='0.0.0.0', port='80')
    sys.stdout.flush()
    sys.stderr.flush()
