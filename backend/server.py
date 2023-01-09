from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from client_handle import ClientHandleNamespace
from random import randint
import logging

logging.basicConfig(filename="error.log")

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def index():
    return render_template("test.html", device_name="Dell_" + str(randint(0, 10)))


@socketio.on_error_default
def error_handler(e):
    logging.exception(
        f"\n ============================================================ \n Exception occurred \n Event: {request.event['message']}\n Data: {request.event['args']} \n Error: \n"
    )
    data = open("error.log").read()
    print(data, flush=True)
    emit(
        request.event["message"],
        {
            "successful": False,
            "message": "Some internal error occured, please try again",
            "type": "error",
        },
    )


if __name__ == "__main__":
    socketio.on_namespace(ClientHandleNamespace("/"))
    socketio.run(app, host="0.0.0.0", port="8000")
