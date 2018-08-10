# data_viz
Flask + D3 + MongoDB AWS Honeypot Geolocation Data 

* Honeypots detect, deflect, and counteract unauthorized system access. 

* Unauthorized attempts are monitored, tracked, blocked based on a set of security rules. 

* Honeypots can be used to detect and deflect:

  - HTTP flood attacks
  - Distributed denial of service (DDoS) attacks
  - Malicious activity in off hours and access attempts by bad IP addresses
  - SQL-injection attacks 
  - Cross-site scripting attacks (XSS) 

Data Courtesy of <a href="http://datadrivensecurity.info/blog/pages/dds-dataset-collection.html">DDS</a>
The dataset for this project is called marx_geo.csv. It is included in /data_viz/input in raw format. 
The cleaned version of the data, honeypot.csv, was generated in R and can be found in data_viz/input. 

To Get Started, Install Dependencies:

PYTHON DEPENDENCIES

  Python-3.7
  pip3
  venv

Create a virtual environment called shell:

  virtualenv shell

Activate the environment within the project directory:

  source shell/bin/activate

Log into the virtual environment:

  pipenv shell

Install remaining dependencies within the shell:

  pip3 install Flask
  pip3 install pandas
  pip3 install shapely
  pip3 install geopandas
  pip3 install pymongo
  pip3 install bson  

SYSTEM DEPENDENCIES

Install mongod, mongo and R. Start up a mongo deamon (mongod instance) in the background:

  mongod &

To populate the data into Mongo I used R. The script to do this is found in /data_viz/scripts/honeypot.R.
Install R and associated dependencies:

  install.packages('mongolite')
  install.packages('forcats')
  install.packages('data.table')

Run the script and populate Mongo with records. Check that the records exist:

mongo

> use dataViz
> show collections

Mongo should return:

> honeyPot

To ensure the collection contains records, type the following command:

> db.honeyPot.find()

To display records in JSON formatted output:

> db.honeyPot.find().pretty()

Once the database has been populated, execute the following command in the root directory of data_viz project:

export FLASK_APP=run.py

then type flask run and assuming everything worked properly the site will be running locally on 127.0.0.1:5000

The page load is shown below:

<img src="https://github.com/acstott/data_viz/blob/master/images/screen.png?raw=true"></img>

Once the page loads, you may need to zoom in or out of the map for further resolution. 
You can crossfilter on host or protocol by simply clicking on one of the items.
An example of crossfilter on 'groucho-singapore' host is shown below:

<img src="https://github.com/acstott/data_viz/blob/master/images/sing_cf.png?raw=true"></img>

Notice the heatmap as well as event count changes 

