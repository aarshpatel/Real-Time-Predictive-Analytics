"""" Simulate the streaming of the IOT data into the BigQuery database """

import time
import csv

def open_dataset(loc):
	""" Opens the dataset as a CSV file and returns all of the samples """
	with open(loc, "r") as f:
	    reader = csv.reader(f, delimiter=",")
	    reader.next()
	    for row in reader:
	    	yield row

def main():
	print("Simulate the IoT stream...")
	for sample in open_dataset("./data/data.csv"):
		time.sleep(3) # every 3 samples, get a new sample
		print sample
	

if __name__ == "__main__":
	main()