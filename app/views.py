# -*- coding: utf-8 -*-

import pandas as pandas
import geopandas
from shapely.geometry import Point, shape

from flask import Flask
from flask import render_template, jsonify
from pymongo import MongoClient, GEO2D
from bson import json_util
from bson.json_util import loads, dumps
import json

from app import app 

data_path = './app/static/lib/js/'

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
#    socketio.run(app)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
HP_DBS_NAME = 'dataViz'
HP_COLLECTION_NAME = 'honeyPot'
HP_FIELDS = {"timestamp" : True, 
	"host" : True, 
	"src" : True,
	"proto" : True,
	"latitude" : True,
	"longitude" : True,
        '_id': False}

def get_location(latitude, longitude, json_world):
    point = Point(latitude, longitude)
    for record in json_world['features']:
        polygon = shape(record['geometry'])
        if polygon.contains(point):
            return record['properties']['name']
    return 'other'

with open(data_path + 'world_map.json') as data_file:    
    json_world = json.load(data_file)

@app.route("/data")
def get_data():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    honeypot_collection = connection[HP_DBS_NAME][HP_COLLECTION_NAME]
    honeypot_projects = honeypot_collection.find(projection=HP_FIELDS, limit=500000)
    json_projects = []
    for project in honeypot_projects:
        json_projects.append(project)
#    df = pandas.DataFrame(json_projects)
#    latitude = df['longitude']
#    longitude = df['longitude']
#    my_location = [latitude, longitude]
#    location = geopandas.GeoDataFrame(my_location, Geometry = "geometry")
#    honeypot_collection.honeypot_projects.create_index([("location", GEO2D)]) 
#    json_projects.append(location)
    json_projects = json.dumps(json_projects, default=json_util.default)
    
    connection.close()
    return json_projects
    
if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
