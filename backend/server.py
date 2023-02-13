from flask import Flask, render_template, request, send_from_directory, jsonify
from flask_socketio import SocketIO, emit
from client_handle import ClientHandleNamespace, trackers, users, payment
from random import randint
import logging
from bson.objectid import ObjectId
from bcrypt import checkpw
import stripe   
import json
import os

stripe_keys = {
  'secret_key': os.environ['SECRET_KEY'],
  'publishable_key': os.environ['PUBLISHABLE_KEY']
}

stripe.api_key = stripe_keys['secret_key']

logging.basicConfig(filename="error.log")

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/extension_device_details")
def extension_device_details():
    return render_template("extension_device_details.html")


@app.route("/syncing_devices")
def syncing_devices():
    return render_template("syncing_devices.html")


@app.route("/testing")
def index():
    return render_template("test.html", device_name="Dell_" + str(randint(0, 10)), key='pk_test_51MZPKhAuOsRyx3wnNVUjI35JuPSJrDzO6KPhD25fOQ9u79WkIByXGtlbH8CQHWtEYHzMpnl5X4r02Gso4iE7FCSh00aOC1tJuK')


@app.route("/admin")
def admin():
    return render_template("admin.html")

@app.route("/verify-email/<id>")
def verify_email(id):
    user = users.find_one({'_id': ObjectId(id)})
    if not user:
        return render_template("404.html"), 404

    users.update_one({'_id': ObjectId(id)}, {'$set': {'verified': True}})
    user_id = user.get('user_id')
    socketio.emit('sign_in', {'successful': True, 'message': {'verified': True}, 'type': 'message'}, to=ClientHandleNamespace.unverified[user_id])

    return render_template("verify-email.html", email=user.get('user_id'))

@app.route("/assets/<path:path>")
def assets(path):
    return send_from_directory("assets", path)

@app.route('/privacy_prevention')
def privacy_prevention():
    domain_name = request.args.get('domain_name')
    instance = trackers.find_one({'domain-name': domain_name})
    print(instance, flush=True)
    return {'is_unsafe': instance != None}

# @app.route('/feature-payment/<id>', methods=['POST'])
# def feature_payment(id):
#     bundle_dict = {'essentials': {'price': 499, 'product_id': 'price_1MZaXtAuOsRyx3wnAFmKLvj5'}, 'supported':{'price': 999, 'product_id':'price_1MZaZ1AuOsRyx3wnhHcO7wiV'}}
#     if id not in bundle_dict:
#         error = 'Bundle type invalid'
#         return json.dumps({"successful": False, "message": error, "type": "error"}), 404

#     data = request.form
#     data_keys = ['user_id', 'device_name', "device_token", "bundle", "currency"]
#     empty_keys = []
#     for key in data_keys:
#         if data.get(key) == '' or data.get(key) == None:
#             empty_keys.append(key)

#     if empty_keys != []:
#         empty_keys = ', '.join(empty_keys)
#         warning = f'Keys: {empty_keys} are empty'
#         return json.dumps({"successful": False, "message": warning, "type": "warning"}), 404
    
#     user = users.find_one({"user_id": data.get("user_id")})
    
#     if user is None:
#         warning = "The specified user could not be found in the system."
#         return json.dumps({"successful": False, "message": warning, "type": "error"}), 404

#     device_token = data.get("device_token", "")
#     if device_token == "":
#         warning = "The device token is null or not defined"
#         return json.dumps({"successful": False, "message": warning, "type": "error"}), 404

#     device = data.get("device_name")
#     tabs_data = user.get("tabs_data")
#     device_tabs_data = tabs_data.get(device)

#     if device_tabs_data.get("device_token") == None:
#         warning = "Your device is logged out, please login again."
#         return json.dumps({"successful": False, "message": warning, "type": "error"}), 404
        

#     if not checkpw(
#         device_token.encode(), device_tabs_data.get("device_token", b"")
#     ):
#         warning = "The device token does not match the expected value."
#         return json.dumps({"successful": False, "message": warning, "type": "error"}), 404

#     user_id = data.get("user_id")
#     currency = data.get("currency", "usd")
#     product = bundle_dict.get(id, {})

#     try:
#         customer = stripe.Customer.create()
#         ephemeralKey = stripe.EphemeralKey.create(
#             customer=customer['id'],
#             stripe_version='2022-11-15',
#         )
#         print("product.get('price', 0): ", product.get('price', 0), flush=True)
#         payment_intent = stripe.PaymentIntent.create(
#             currency=currency,
#             customer=customer['id'],
#             payment_method_types=["card"],
#             metadata={
#                 'product_id': product.get('product_id'),
#                 'amount': product.get('price')
#             },
#             setup_future_usage="off_session",
#             amount=product.get('price', 0)
#         )

#         payment_intent_id = payment_intent['id']

#         payment.insert_one({'user_id': user_id, 'bundle': id, 'payment_intent_id': payment_intent_id})

#         return jsonify(paymentIntent=payment_intent.client_secret,
#                         ephemeralKey=ephemeralKey.secret,
#                         customer=customer.id,
#                         publishableKey=stripe_keys.get('publishable_key'))
#     except Exception as e:
#         print(e, flush=True)
#         error = 'Payment failed'
#         return json.dumps({"successful": False, "message": error, "type": "error"}), 404

@app.route('/webhook', methods=['POST'])
def webhook():
    event = None
    payload = request.data
    endpoint_secret = os.environ.get('WEBHOOK')
    
    try:
        event = json.loads(payload)
    except:
        print('⚠️  Webhook error while parsing basic request.' + str(e), flush=True)
        return jsonify(success=False)

    if endpoint_secret:
        sig_header = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except stripe.error.SignatureVerificationError as e:
            print('⚠️  Webhook signature verification failed.' + str(e), flush=True)
            return jsonify(success=False)

    if event and event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        new_payment = payment.find_one({'payment_intent': payment_intent})
        payment.update_one({'payment_intent': payment_intent}, {'$set': {"successful": True}})
    elif event and event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        new_payment = payment.find_one({'payment_intent': payment_intent})
        print("Failed !!", new_payment, flush=True)
        payment.update_one({'payment_intent': payment_intent}, {'$set': {"successful": False}})

    return jsonify(success=True)

# ============== Hoting static Website ==============
@app.route("/")
def website():
    return send_from_directory("../website/out", "index.html")

@app.route("/privacy")
def privacy():
    return send_from_directory("../website/out", "privacy.html")

@app.route("/contact")
def contact():
    return send_from_directory("../website/out", "contact.html")

@app.route("/help")
def help():
    return send_from_directory("../website/out", "help.html")

@app.route("/sync_tutorial")
def sync_tutorial():
    return send_from_directory("../website/out", "sync_tutorial.html")

@app.route("/<path:path>")
def website_next(path):
    return send_from_directory("../website/out", path)
# ============================


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
