"""
Webscraper for IP Event Dashboard 
"""

# Load Core Libraries

import os
import sys
import time
import datetime as dt
from datetime import timedelta
import iso8601
import re

# Load External Libraries

import pandas
from pandas.tseries.offsets import *
import numpy as np
import json
import requests
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import pymongo
from pymongo import MongoClient

# Launch Autobrowser Window 

chromedriver = "/usr/local/bin/chromedriver"
os.environ["webdriver.chrome.driver"] = chromedriver  
options = webdriver.ChromeOptions()  
driver = webdriver.Chrome(chromedriver, chrome_options=options)

# Navigate to the Blueliv Map View 

driver.get("https://community.blueliv.com/map/")

# Navigate to Script Run Browser 

items = print(list(map(lambda i: "//*[@id='cyber-chart-items']/div[i]", range(1000))))

result = [i for i in items if "//*[@id='cyber-chart-items']/div[i]"]

print result

items = []
for i in range(0, len(div)):
    items.append(str.split(driver.find_element_by_xpath("//*[@id='cyber-chart-items']/div[i]").text))

is_modal = driver.find_element_by_link_text("Join Blueliv community to access the Cyber Threat Map")

# Invoke MongoDB Instance 

client = MongoClient('localhost', 27017)

db = client['dataViz']
collection = db['secureIp']

# Output to DB

dut_type = dut_var[2]
dut_name = dut_var[5]
dut_name_df = pandas.DataFrame({'dut_type': [dut_type], 'dut_name': [dut_name]})
dut_name_df.set_index('dut_type', inplace=True)
dut_name_record = json.loads(dut_name_df.to_json())
db.zappingKPI.insert(dut_name_record)


date_as_dt = items[:1][5]
