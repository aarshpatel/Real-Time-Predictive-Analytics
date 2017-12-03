import os
from flask import Flask, render_template, jsonify
from google.cloud import pubsub_v1 as pubsub
from get_bigquery_data import get_fault_trigger_counts, get_fault_trigger_avg_duration, get_descriptions
import json

app = Flask(__name__)

@app.route('/')
def hello_world():
  return render_template('index.html')

@app.route('/get_trigger_counts')
def get_trigger_counts():
	data = get_fault_trigger_counts()
	return jsonify(data)

@app.route('/get_trigger_avg_duration')
def get_trigger_avg_duration():
	data = get_fault_trigger_avg_duration()
	return jsonify(data)

@app.route("/get_descriptions")
def get_descriptions_cnts():
	data = get_descriptions()
	return jsonify(data)

@app.route("/live")
def live_analytics():
	return render_template("index.html")

@app.route('/pubsub')
def create_pub_sub_with_bigquery():
	publisher = pubsub.PublisherClient()

	test_data = {
	    "Device_Name": "Test-Device",
	    "Active": "false",
	    "Occurred_": "2016-12-10 12:39:05 UTC",
	    "Outlet": "1",
	    "Stud_ID": "",
	    "Carbody_ID": "",
	    "Feeder": "--",
	    "Weldtool": "1",
	    "Fault__": "10017",
	    "Fault_Trigger": "SMPS",
	    "Fixed": "2016-12-10 12:39:06 UTC",
	    "Duration": "00:00:01",
	    "Cleared_by": "SMPS",
	    "Reason": "Self resetted",
	    "Description": "Measurement line broken",
	    "Extended_description": "Measurement line circuit disturbed.",
	    "System_weld__counter": "1389",
	    "Operation_Mode": "Automatic mode",
	    "Sub_Index": "0",
	    "Flag_1": "0",
	    "Flag_2": "0",
	    "Flag_3": "0",
	    "Flag_4": "0"
  	};

	publish_to_bigquery(publisher, json.dumps(test_data))

	return jsonify(test_data)

def publish_to_bigquery(publisher, sample):
	topic_name = 'projects/{project_id}/topics/{topic}'.format(
	    project_id='yhack-187804',
	    topic='addnewentry',  # Set this to something appropriate.
	)
	publisher.publish(topic_name, sample.encode('utf-8'))

if __name__ == '__main__':
  app.run(debug=True)

