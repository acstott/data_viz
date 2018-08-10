#-----------------------------------------------------------------------------
# Import Libraries  
#-----------------------------------------------------------------------------

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

#-----------------------------------------------------------------------------
# Define Index Template Route & Map Data Source 
#-----------------------------------------------------------------------------

data_path = './app/static/lib/js/'

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)

#-----------------------------------------------------------------------------
# Bind Mongo Variables  
#-----------------------------------------------------------------------------

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
HP_DBS_NAME = 'dataViz'
HP_COLLECTION_NAME = 'honeyPot'
HP_FIELDS = {"latitude" : True, 
	"longitude" : True,
	"host" : True,
	"src" : True,
        "proto" : True,
	"count" : True,
        '_id': False}

#-----------------------------------------------------------------------------
# Map Latitude & Longitude Values to Polygonal GeoJSON File jsno_world  
#-----------------------------------------------------------------------------

def get_location(latitude, longitude, json_world):
    point = Point(latitude, longitude)
    for record in json_world['features']:
        polygon = shape(record['geometry'])
        if polygon.contains(point):
            return record['properties']['name']
    return 'other'

with open(data_path + 'world_map.json') as data_file:    
    json_world = json.load(data_file)

#-----------------------------------------------------------------------------
# Stream Data from Mongo to Route - 
# Data is Rendered to Views in /static/js/graph.js File by Passing /data Route  
# queue()
#    .defer(d3.json, "/data")
#    .await(makeGraphs); 
#-----------------------------------------------------------------------------

@app.route("/data")
def get_data():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    honeypot_collection = connection[HP_DBS_NAME][HP_COLLECTION_NAME]
    honeypot_projects = honeypot_collection.find(projection=HP_FIELDS, limit=500000)
    json_projects = []
    for project in honeypot_projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    
    connection.close()
    return json_projects
    
if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
