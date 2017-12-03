import os
from flask import Flask, render_template, jsonify
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


if __name__ == '__main__':
  app.run(debug=True)

