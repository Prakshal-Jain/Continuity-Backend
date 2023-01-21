from glob import glob
import json
from client_handle import trackers

with open("./backend/tracker-domains.json", "r") as json_file:
    trackers_list = json.loads(json_file.read())
    trackers.insert_many(trackers_list)
