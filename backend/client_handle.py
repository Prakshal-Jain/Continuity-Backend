from flask_socketio import Namespace, emit
from flask import request
import sys

from pymongo import MongoClient, cursor
from bson.objectid import ObjectId
from secrets import token_urlsafe
from bcrypt import hashpw, gensalt, checkpw
from features.ultra_search import ultra_search_query
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import os
import hashlib
import json

client = MongoClient("mongo")
db = client["user_data"]
users = db["users"]
privacy_report = db["privacy_report_data"]
ultra_search = db["ultra_search"]
history = db["history"]
notification = db["notification"]
feedback = db["feedback"]

privacy_report.create_index("expireAt", expireAfterSeconds=0)
history.create_index("expireAt", expireAfterSeconds=0)
notification.create_index("ttl", expireAfterSeconds=0)


class ClientHandleNamespace(Namespace):
    devices_in_use = {}
    admin_socket = {}

    def __create_tab(self, device_name, device_type, device_token):
        return {
            device_name: {
                "tabs": {},
                "device_type": device_type,
                "device_token": hashpw(device_token, gensalt()),
            }
        }

    def __get_tab_data(self, device_name, device_type):
        new_device = {"device_type": device_type, "device_name": device_name}
        return new_device

    def __get_tabs_data(self, data):
        devices = data.get("devices")
        return_tabs_data = []
        tabs_data = data.get("tabs_data")
        for (key, value) in tabs_data.items():
            new_structure = {"device_type": devices.get(key), "device_name": key}
            return_tabs_data.append(new_structure)

        return return_tabs_data

    def __authenticate_device(self, event, user, data):
        if user is None:
            warning = "The specified user could not be found in the system."
            emit(event, {"successful": False, "message": warning, "type": "error"})
            return False

        device_token = data.get("device_token", "")
        if device_token == "":
            warning = "The device token is null or not defined"
            emit(event, {"successful": False, "message": warning, "type": "error"})
            return False

        device = data.get("device_name")
        tabs_data = user.get("tabs_data")
        device_tabs_data = tabs_data.get(device)

        if device_tabs_data.get("device_token") == None:
            warning = "Your device is logged out, please login again."
            emit(event, {"successful": False, "message": warning, "type": "error"})
            return False

        if not checkpw(
            device_token.encode(), device_tabs_data.get("device_token", b"")
        ):
            warning = "The device token does not match the expected value."
            emit(event, {"successful": False, "message": warning, "type": "error"})
            return False

        return True

    def __check_for_same_token(self, device_token, tabs_data):
        tokens_in_use = [
            device_tab_data.get("device_token")
            for device_tab_data in tabs_data.values()
        ]
        current_iter = iter(tokens_in_use)
        token = next(current_iter, b"")
        while token != b"":
            if token != None and checkpw(device_token, token):
                device_token = token_urlsafe(27).encode()
                current_iter = iter(tokens_in_use)
            token = next(current_iter, b"")

        return device_token

    def __sort_arrays(self, websites, trackers, tracker_counts):
        if len(tracker_counts) == 0:
            return websites, trackers, tracker_counts
        sorted_websites = []
        sorted_trackers = []
        sorted_tracker_counts = []
        visited = set()
        len_ = len(websites)

        for i in range(10):
            max_index = -1
            max_count = -1

            for j in range(len_):
                if j in visited:
                    continue

                if max_count < tracker_counts[j]:
                    max_count = tracker_counts[j]
                    max_index = j

            if max_index == -1 or max_count == -1:
                continue

            sorted_websites.append(websites[max_index])
            sorted_trackers.append(trackers[max_index])
            sorted_tracker_counts.append(tracker_counts[max_index])

            visited.add(max_index)

        return sorted_websites, sorted_trackers, sorted_tracker_counts

    def __send_update(self, user_id):
        request_sid_list = []
        user_sids = ClientHandleNamespace.devices_in_use.get(user_id)
        for (device_name, sid) in user_sids.items():
            if sid == request.sid:
                continue

            request_sid_list.append(sid)

        return request_sid_list

    def __send_notification_count(self, user_id, new_user=False):
        notification_count = notification.count_documents(
            {"user_record": True, "user_id": user_id, "ack": False}
        )

        if new_user:
            notification_count = 0
            all_notifications = notification.find({"message_record": True})
            for n in all_notifications:
                notification_count += 1
                message = {"message": n.get("message")}
                notification.insert_one(
                    {
                        "user_record": True,
                        "user_id": user_id,
                        "message": message,
                        "ttl": n.get("ttl"),
                        "ack": False,
                    }
                )

        emit(
            "notification_count",
            {
                "successful": True,
                "message": {"notification_count": notification_count},
                "type": "message",
            },
        )

    def on_login(self, data):
        ClientHandleNamespace.devices_in_use[
            data.get("user_id")
        ] = ClientHandleNamespace.devices_in_use.get(data.get("user_id"), {})
        ClientHandleNamespace.devices_in_use[data.get("user_id")][
            data.get("device_name")
        ] = request.sid

        user = users.find_one({"user_id": data.get("user_id")})

        device_token = token_urlsafe(27).encode()

        new_user = False

        if (
            data.get("device_name", "") == ""
            or data.get("device_type", "") == ""
            or data.get("user_id", "") == ""
        ):
            warning = "One or more required fields (device name, device type, or user ID) are empty or not defined."
            emit("login", {"successful": False, "message": warning, "type": "warning"})
            return

        if user == None:
            new_user = True
            user = {
                "user_id": data.get("user_id"),
                "name": data.get("name"),
                "picture": data.get("picture"),
                "devices": {data.get("device_name"): data.get("device_type")},
                "tabs_data": self.__create_tab(
                    data.get("device_name"), data.get("device_type"), device_token
                ),
                "enrolled_features": {
                    "ultra_search": {"enrolled": False, "switch": False},
                    "privacy_prevention": {"enrolled": False, "switch": False},
                },
            }
            users.insert_one(user)
        elif user.get("devices").get(data.get("device_name")) == None:
            device_token = self.__check_for_same_token(
                device_token, user.get("tabs_data")
            )
            devices = user.get("devices")
            devices[data.get("device_name")] = data.get("device_type")
            new_device = self.__create_tab(
                data.get("device_name"), data.get("device_type"), device_token
            )
            user.get("tabs_data").update(new_device)
            users.update_one(
                {"user_id": data.get("user_id")},
                {"$set": {"devices": devices, "tabs_data": user.get("tabs_data")}},
            )
            emit(
                "add_device",
                {
                    "successful": True,
                    "message": self.__get_tab_data(
                        data.get("device_name"), data.get("device_type")
                    ),
                    "type": "message",
                },
                to=self.__send_update(data.get("user_id")),
                skip_sid=request.sid,
            )
        else:
            if data.get("device_type") != user.get("devices").get(
                data.get("device_name")
            ):
                warning = "Device name already in use. Please choose a different name."
                emit(
                    "login",
                    {"successful": False, "message": warning, "type": "warning"},
                )
                return

            device_tabs_data = user.get("tabs_data").get(data.get("device_name"))

            if device_tabs_data.get("device_token", None) is not None:
                warning = "This device is already logged in to the system"
                emit(
                    "login",
                    {"successful": False, "message": warning, "type": "warning"},
                )
                return

            device_token = self.__check_for_same_token(
                device_token, user.get("tabs_data")
            )
            device_tabs_data["device_token"] = hashpw(device_token, gensalt())
            users.update_one(
                {"user_id": data.get("user_id")},
                {"$set": {"tabs_data": user.get("tabs_data")}},
            )

        credentials = {
            "name": data.get("name"),
            "picture": data.get("picture"),
            "user_id": data.get("user_id"),
            "device_name": data.get("device_name"),
            "device_type": data.get("device_type"),
            "device_token": device_token.decode(),
            "enrolled_features": user.get("enrolled_features"),
        }
        emit("login", {"successful": True, "message": credentials, "type": "message"})
        emit(
            "all_devices",
            {
                "successful": True,
                "message": self.__get_tabs_data(user),
                "type": "message",
            },
        )

        self.__send_notification_count(data.get("user_id"), new_user)

        sys.stderr.flush()
        sys.stdout.flush()

    def on_add_tab(self, data):
        user = users.find_one({"user_id": data.get("user_id")})
        if not self.__authenticate_device("add_tab", user, data):
            return

        target_device = data.get("target_device")
        new_tabs_data = data.get("tabs_data")
        tabs_data = user.get("tabs_data")
        device_tabs = tabs_data.get(target_device).get("tabs", {})
        device_tabs.update(new_tabs_data)
        users.update_one(
            {"user_id": data.get("user_id")}, {"$set": {"tabs_data": tabs_data}}
        )

        del data["device_token"]
        emit(
            "add_tab",
            {"successful": True, "message": data, "type": "message"},
            to=self.__send_update(data.get("user_id")),
            skip_sid=request.sid,
        )

    def on_remove_tab(self, data):
        user = users.find_one({"user_id": data.get("user_id")})
        if not self.__authenticate_device("remove_tab", user, data):
            return

        target_device = data.get("target_device")
        tabs_data = user.get("tabs_data")
        device_tabs = tabs_data.get(target_device).get("tabs")
        tab_id = str(data.get("id", -1))
        if tab_id in device_tabs:
            del device_tabs[tab_id]
        users.update_one(
            {"user_id": data.get("user_id")}, {"$set": {"tabs_data": tabs_data}}
        )

        del data["device_token"]

        emit(
            "remove_tab",
            {"successful": True, "message": data, "type": "message"},
            to=self.__send_update(data.get("user_id")),
            skip_sid=request.sid,
        )

    def on_remove_all_tabs(self, data):
        user = users.find_one({"user_id": data.get("user_id")})
        if not self.__authenticate_device("remove_all_tabs", user, data):
            return

        target_device = data.get("target_device")
        is_incognito = data.get("is_incognito")
        delete_all = is_incognito == None
        tabs_data = user.get("tabs_data")
        device_tabs_data = tabs_data.get(target_device)
        tabs = device_tabs_data.get("tabs", {})

        for (key, value) in list(tabs.items()):

            if (is_incognito or delete_all) and value.get("is_incognito"):
                del tabs[key]
            elif ((not is_incognito) or delete_all) and not value.get("is_incognito"):
                del tabs[key]

        users.update_one(
            {"user_id": data.get("user_id")}, {"$set": {"tabs_data": tabs_data}}
        )

        del data["device_token"]

        emit(
            "remove_all_tabs",
            {"successful": True, "message": data, "type": "message"},
            to=self.__send_update(data.get("user_id")),
            skip_sid=request.sid,
        )

    def on_update_tab(self, data):
        user = users.find_one({"user_id": data.get("user_id")})
        if not self.__authenticate_device("update_tab", user, data):
            return

        target_device = data.get("target_device")
        new_tabs_data = data.get("tabs_data")
        tabs_data = user.get("tabs_data")
        device_tabs = tabs_data.get(target_device, {}).get("tabs")
        device_tabs.update(new_tabs_data)
        users.update_one(
            {"user_id": data.get("user_id")}, {"$set": {"tabs_data": tabs_data}}
        )

        del data["device_token"]

        emit(
            "update_tab",
            {"successful": True, "message": data, "type": "message"},
            to=self.__send_update(data.get("user_id")),
            skip_sid=request.sid,
        )

    def on_get_my_tabs(self, data):
        user = users.find_one({"user_id": data.get("user_id")})
        if not self.__authenticate_device("get_my_tabs", user, data):
            return

        target_device = data.get("target_device")
        tabs_data = user.get("tabs_data")
        return_data = tabs_data.get(target_device).get("tabs", {})
        emit(
            "get_my_tabs",
            {"successful": True, "message": return_data, "type": "message"},
        )

    def on_all_devices(self, data):
        user = users.find_one({"user_id": data.get("user_id")})
        if not self.__authenticate_device("all_devices", user, data):
            return

        emit(
            "all_devices",
            {
                "successful": True,
                "message": self.__get_tabs_data(user),
                "type": "message",
            },
        )

    def on_enroll_feature(self, data):
        user_id = data.get("user_id")

        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("enroll_feature", user, data):
            return

        feature_name = data.get("feature_name")
        is_enrolled = bool(data.get("is_enrolled"))

        if feature_name not in ["ultra_search", "privacy_prevention"]:
            warning = "The specified feature name is not valid."
            emit(
                "enroll_feature",
                {"successful": False, "message": warning, "type": "error"},
            )
            return

        if (not is_enrolled) and user.get("enrolled_features", {}).get(
            feature_name, {}
        ).get("enrolled", False):
            warning = f"Feature opt-in failed. The user's account is already enrolled in {feature_name}."
            emit(
                "enroll_feature",
                {"successful": False, "message": warning, "type": "warning"},
            )
            return

        users.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    f"enrolled_features.{feature_name}": {
                        "enrolled": not is_enrolled,
                        "switch": not is_enrolled,
                    }
                }
            },
        )
        credentials = {
            "name": user.get("name"),
            "picture": user.get("picture"),
            "user_id": user.get("user_id"),
            "device_name": data.get("device_name"),
            "device_type": user.get("devices").get(data.get("device_name")),
            "device_token": data.get("device_token"),
            "enrolled_features": (users.find_one({"user_id": user_id})).get(
                "enrolled_features"
            ),
        }
        emit(
            "enroll_feature",
            {"successful": True, "message": credentials, "type": "message"},
        )

    def on_switch_feature(self, data):
        user_id = data.get("user_id")

        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("switch_feature", user, data):
            return

        feature_name = data.get("feature_name")

        if feature_name not in ["ultra_search", "privacy_prevention"]:
            warning = "The specified feature name is not valid."
            emit(
                "enroll_feature",
                {"successful": False, "message": warning, "type": "error"},
            )
            return

        if (
            not user.get("enrolled_features", {})
            .get(feature_name, {})
            .get("enrolled", False)
        ):
            warning = f"You have not opted in for {feature_name}"
            emit(
                "ultra_search_query",
                {"successful": False, "message": warning, "type": "error"},
            )
            return

        switch = bool(data.get("switch"))

        users.update_one(
            {"user_id": user_id},
            {"$set": {f"enrolled_features.{feature_name}.switch": switch}},
        )
        credentials = {
            "name": user.get("name"),
            "picture": user.get("picture"),
            "user_id": user.get("user_id"),
            "device_name": data.get("device_name"),
            "device_type": user.get("devices").get(data.get("device_name")),
            "device_token": data.get("device_token"),
            "enrolled_features": (users.find_one({"user_id": user_id})).get(
                "enrolled_features"
            ),
        }
        emit(
            "switch_feature",
            {"successful": True, "message": credentials, "type": "message"},
        )

    def on_ultra_search_query(self, data):
        user_id = data.get("user_id")
        prompt = data.get("prompt", "")

        if prompt == "" or prompt == None:
            warning = "The specified query is empty or invalid."

            emit(
                "ultra_search_query",
                {"successful": False, "message": warning, "type": "warning"},
            )
            return

        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("ultra_search_query", user, data):
            return

        if not user.get("enrolled_features", {}).get("ultra_search").get("enrolled"):
            warning = "You have not opted in for Ultra Search"
            emit(
                "ultra_search_query",
                {"successful": False, "message": warning, "type": "error"},
            )
            return

        if not user.get("enrolled_features", {}).get("ultra_search").get("switch"):
            warning = "Ultra search is currently disabled on your account. To use Ultra search, please enable it in your account settings."
            emit(
                "ultra_search_query",
                {"successful": False, "message": warning, "type": "warning"},
            )
            return

        response = ultra_search_query({"prompt": data.get("prompt")})
        if response == None:
            warning = "Oops, something went wrong. Don't worry, we're on it! Trying to fix the issue in a jiffy."
            emit(
                "ultra_search_query",
                {"successful": False, "message": warning, "type": "warning"},
            )
        else:
            emit(
                "ultra_search_query",
                {"successful": True, "message": response, "type": "message"},
            )

    def on_report_privacy_trackers(self, data):
        user_id = data.get("user_id")

        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("report_privacy_trackers", user, data):
            return

        target_device = data.get("target_device")
        website_host = data.get("website_host")
        tracker = data.get("tracker")

        privacy_report.insert_one(
            {
                "user_id": user_id,
                "device": target_device,
                "website_host": website_host,
                "tracker": tracker,
                "expireAt": datetime.utcnow() + timedelta(days=30),
            }
        )

        emit("report_privacy_trackers", {"successful": True, "type": "message"})

    def on_privacy_report(self, data):
        user_id = data.get("user_id")

        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("privacy_report", user, data):
            return

        target_device = data.get("target_device")

        data = privacy_report.aggregate(
            [
                {"$match": {"user_id": user_id, "device": target_device}},
                {
                    "$group": {
                        "_id": {"website_host": "$website_host", "tracker": "$tracker"}
                    }
                },
            ]
        )

        restructured_data = {}

        for record in data:
            record_wh = record.get("_id").get("website_host")
            record_t = record.get("_id").get("tracker")

            restructured_data[record_wh] = restructured_data.get(record_wh, [])
            restructured_data[record_wh].append(record_t)

        tracker_counts = []
        websites = []
        trackers = []

        for (key, value) in restructured_data.items():
            tracker_counts.append(len(value))
            websites.append(key)
            trackers.append(value)

        websites, trackers, tracker_counts = self.__sort_arrays(
            websites, trackers, tracker_counts
        )
        emit(
            "privacy_report",
            {
                "successful": True,
                "message": {
                    "tracker_counts": tracker_counts,
                    "websites": websites,
                    "trackers": trackers,
                },
                "type": "message",
            },
        )

    def on_set_history(self, data):
        user_id = data.get("user_id")

        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("set_history", user, data):
            return

        target_device = data.get("target_device")
        url = data.get("url")
        title = data.get("title")

        history.insert_one(
            {
                "user_id": user_id,
                "device": target_device,
                "url": url,
                "title": title,
                "expireAt": datetime.utcnow() + timedelta(days=30),
            }
        )

        emit("set_history", {"successful": True, "type": "message"})

    def on_get_history(self, data):
        user_id = data.get("user_id")

        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("get_history", user, data):
            return

        target_device = data.get("target_device")
        page = int(data.get("page"))
        timezone = ZoneInfo(data.get("timezone", "UTC"))
        page_count = (page - 1) * 50
        data = (
            history.find({"user_id": user_id, "device": target_device})
            .sort("_id", -1)
            .skip(page_count)
            .limit(51)
        )

        user_history = []

        count = 0
        running_date = ""

        for p in data:
            count += 1
            if count == 51:
                break
            date = p.get("_id").generation_time.astimezone(timezone)
            str_date = date.strftime("%b %-d, %Y")
            if running_date != str_date:
                user_history.append({"date": str_date, "date_history": []})
                running_date = str_date
            user_history[-1]["date_history"].append(
                {"url": p.get("url"), "id": str(p.get("_id")), "title": p.get("title")}
            )

        if count == 0:
            warning = f"The history for page {page} is empty or does not exist."
            emit(
                "get_history",
                {"successful": False, "message": warning, "type": "warning"},
            )
            return

        emit(
            "get_history",
            {
                "successful": True,
                "message": {"next": count == 51, "history": user_history},
                "type": "message",
            },
        )

    def on_delete_history(self, data):
        user_id = data.get("user_id")

        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("get_history", user, data):
            return

        target_device = data.get("target_device")
        id = data.get("id")
        is_delete_all = data.get("is_delete_all", False)

        if id == None and is_delete_all:
            history.delete_many({"user_id": user_id, "device": target_device})
        elif id != None:
            history.delete_one({"_id": ObjectId(id)})
        else:
            warning = "The specified delete query is incorrect or invalid."
            emit(
                "delete_history",
                {"successful": False, "message": warning, "type": "error"},
            )
            return

        emit(
            "delete_history",
            {
                "successful": True,
                "message": {"is_delete_all": is_delete_all, "id": id},
                "type": "message",
            },
        )

    def on_ack_notification(self, data):
        user_id = data.get("user_id")
        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("ack_notification", user, data):
            return

        notification_id = data.get("id")
        notification.update_one(
            {"_id": ObjectId(notification_id)}, {"$set": {"ack": True}}
        )
        emit("ack_notification", {"successful": True, "type": "message"})

    def on_get_notification(self, data):
        user_id = data.get("user_id")
        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("get_notification", user, data):
            return

        all_notifications = notification.find(
            {"user_record": True, "user_id": user_id, "ack": False}
        )
        notifications_to_send = []

        for n in all_notifications:
            message = n.get("message")
            id = n.get("_id")
            message.update({"id": str(id)})
            notifications_to_send.append(message)

        emit(
            "get_notification",
            {"successful": True, "message": notifications_to_send, "type": "message"},
        )

    def on_report_feedback(self, data):
        user_id = data.get("user_id")
        user = users.find_one({"user_id": user_id})

        if not self.__authenticate_device("report_feedback", user, data):
            return

        user_feedback = data.get("feedback")
        feedback.insert_one({"user_id": user_id, "feedback": user_feedback})
        emit("report_feedback", {"successful": True, "type": "message"})

    def on_auto_authenticate(self, data):
        device_name = data.get("device_name")
        device_token = data.get("device_token")

        data = users.find({f"tabs_data.{device_name}": {"$exists": True}})

        for d in data:
            user_id_from_data = d.get("user_id")
            tabs_data_from_data = d.get("tabs_data")
            device_data_from_data = tabs_data_from_data.get(device_name)
            device_token_from_data = device_data_from_data.get("device_token")

            if device_token_from_data != None and checkpw(
                device_token.encode(), device_token_from_data
            ):
                credentials = {
                    "name": d.get("name"),
                    "picture": d.get("picture"),
                    "user_id": user_id_from_data,
                    "device_name": device_name,
                    "device_type": device_data_from_data.get("device_type"),
                    "device_token": device_token,
                }
                user = users.find_one({"user_id": user_id_from_data})
                credentials["enrolled_features"] = user.get("enrolled_features")
                emit(
                    "auto_authenticate",
                    {"successful": True, "message": credentials, "type": "message"},
                )
                emit(
                    "all_devices",
                    {
                        "successful": True,
                        "message": self.__get_tabs_data(user),
                        "type": "message",
                    },
                )
                ClientHandleNamespace.devices_in_use[user_id_from_data][
                    device_name
                ] = request.sid
                self.__send_notification_count(d.get("user_id"))
                return

        warning = "The specified user could not be found in the system."
        emit(
            "auto_authenticate",
            {"successful": False, "message": warning, "type": "error"},
        )

    def on_logout(self, data):
        user_id = data.get("user_id")
        user = users.find_one({"user_id": user_id})
        if not self.__authenticate_device("logout", user, data):
            return

        device = data.get("device_name")
        tabs_data = user.get("tabs_data")
        device_tabs_data = tabs_data.get(device)

        device_tabs_data["device_token"] = None
        users.update_one(
            {"user_id": user_id}, {"$set": {"tabs_data": user.get("tabs_data")}}
        )

        del ClientHandleNamespace.devices_in_use.get(user_id)[device]

        emit("logout", {"successful": True, "type": "message"})
        print("Logged Out Successfully")

    def __authenticate_admin(self, key):
        hashed_key = os.getenv("ADMIN_PASSWORD")
        key_hash = hashlib.sha256()
        key_hash.update(key.encode())
        key_hash = key_hash.hexdigest().upper()

        return hashed_key == key_hash

    def __check_admin_socket(self):
        admin = os.getenv("ADMIN_USERNAME")
        sid = ClientHandleNamespace.admin_socket.get(admin)

        if sid == None:
            emit(
                "error_occured",
                {
                    "successful": False,
                    "type": "error",
                    "message": "Admin Socket not set",
                },
            )
            return None

        return sid

    def on_admin_socket(self, data):
        key = data.get("key")
        admin = os.getenv("ADMIN_USERNAME")
        if not self.__authenticate_admin(key):
            emit(
                "error_occured",
                {"successful": False, "type": "error", "message": "Incorrect key"},
            )
            return
        action = data.get("action")

        if action == "insert":
            ClientHandleNamespace.admin_socket[admin] = request.sid
        else:
            del ClientHandleNamespace.admin_socket[admin]

        emit(
            "admin_socket",
            {"successful": True, "type": "message"},
        )

    def on_admin_get_feedback(self, data):
        key = data.get("key")
        if not self.__authenticate_admin(key):
            emit(
                "error_occured",
                {"successful": False, "type": "error", "message": "Incorrect key"},
            )
            return

        if not (sid := self.__check_admin_socket()):
            return

        user_feedback = list(feedback.find({}, {"_id": 0}))
        emit(
            "admin_get_feedback",
            {"successful": True, "message": user_feedback, "type": "message"},
            to=sid,
        )

    def on_admin_get(self, data):
        key = data.get("key")
        if not self.__authenticate_admin(key):
            emit(
                "error_occured",
                {"successful": False, "type": "error", "message": "Incorrect key"},
            )
            return

        if not (sid := self.__check_admin_socket()):
            return

        user_info = users.find_one({"user_id": data.get("user_id")}, {"_id": 0})
        privacy_info = list(
            privacy_report.find(
                {"user_id": data.get("user_id")}, {"_id": 0, "expireAt": 0}
            )
        )
        history_info = list(
            history.find({"user_id": data.get("user_id")}, {"_id": 0, "expireAt": 0})
        )
        notification_info = list(
            notification.find({"user_id": data.get("user_id")}, {"_id": 0, "ttl": 0})
        )
        feedback_info = list(
            feedback.find({"user_id": data.get("user_id")}, {"_id": 0})
        )

        emit(
            "admin_get",
            {
                "successful": True,
                "message": {
                    "user_info": user_info,
                    "privacy_info": privacy_info,
                    "history_info": history_info,
                    "notification_info": notification_info,
                    "feedback_info": feedback_info,
                },
                "type": "message",
            },
            to=sid,
        )

    def on_admin_run_query(self, data):
        key = data.get("key")
        if not self.__authenticate_admin(key):
            emit(
                "error_occured",
                {"successful": False, "type": "error", "message": "Incorrect key"},
            )
            return

        if not (sid := self.__check_admin_socket()):
            return

        collection_dict = {
            "users": users,
            "privacy_report": privacy_report,
            "history": history,
            "notification": notification,
            "feedback": feedback,
        }

        collection = data.get("collection")
        action = data.get("action")
        query = data.get("query")
        return_ = bool(data.get("return"))
        collection = collection_dict.get(collection)
        func = getattr(collection, action)
        result = func(*json.loads(query))

        if return_:
            if isinstance(result, cursor.Cursor):
                result = list(result)

            emit(
                "admin_run_query",
                {"successful": True, "message": result, "type": "message"},
                to=sid,
            )
        else:
            emit(
                "admin_run_query",
                {"successful": True, "type": "message"},
                to=sid,
            )

    def on_admin_get_registered(self, data):
        key = data.get("key")
        if not self.__authenticate_admin(key):
            emit(
                "error_occured",
                {"successful": False, "type": "error", "message": "Incorrect key"},
            )
            return

        if not (sid := self.__check_admin_socket()):
            return

        total_count = users.count_documents({})

        emit(
            "admin_get_registered",
            {
                "successful": True,
                "message": {"registered_users": total_count},
                "type": "message",
            },
            to=sid,
        )

    def on_admin_get_active(self, data):
        key = data.get("key")
        if not self.__authenticate_admin(key):
            emit(
                "error_occured",
                {"successful": False, "type": "error", "message": "Incorrect key"},
            )
            return

        if not (sid := self.__check_admin_socket()):
            return

        active_users = len(ClientHandleNamespace.devices_in_use)

        active_devices = 0

        for (_, value) in list(ClientHandleNamespace.devices_in_use.items()):
            active_devices += len(value)

        emit(
            "admin_get_active",
            {
                "successful": True,
                "message": {
                    "active_users": active_users,
                    "active_devices": active_devices,
                },
                "type": "message",
            },
            to=sid,
        )

    def on_set_notification(self, data):
        key = data.get("key")
        if not self.__authenticate_admin(key):
            emit(
                "error_occured",
                {"successful": False, "type": "error", "message": "Incorrect key"},
            )
            return

        if not (sid := self.__check_admin_socket()):
            return

        send_to = data.get("send_to", set())
        ttl = datetime.utcnow() + timedelta(days=int(data.get("ttl")))
        message = {"message": json.loads(data.get("message"))}

        if send_to == set():
            notification.insert_one(
                {"message_record": True, "message": message, "ttl": ttl}
            )
            send_to = [u.get("user_id") for u in users.find({}, {"user_id": 1})]

        for user in send_to:
            new = notification.insert_one(
                {
                    "user_record": True,
                    "user_id": user,
                    "message": message,
                    "ttl": ttl,
                    "ack": False,
                }
            )

            emit(
                "get_notification",
                {"successful": True, "message": [{"message": message, "id": str(new.get('_id'))}], "type": "message"},
            )


        emit("set_notification", {"successful": True, "type": "message"}, to=sid)

    def on_admin_get_error_log(self, data):
        key = data.get("key")
        if not self.__authenticate_admin(key):
            emit(
                "error_occured",
                {"successful": False, "type": "error", "message": "Incorrect key"},
            )
            return

        if not (sid := self.__check_admin_socket()):
            return

        errors = open("error.log").read()

        emit(
            "admin_get_error_log",
            {"successful": True, "type": "message", "message": errors},
            to=sid,
        )
