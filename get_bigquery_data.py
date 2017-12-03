""" 
Functions to query the Google BigQuery database. Each function queries one thing, and returns 
the result as a dictionary 
"""
import pandas as pd 
from pandas.io import gbq # to communicate with Google BigQuery
from utils import hms_to_seconds

def get_fault_trigger_counts():
	""" Query to get the fault trigger counts """
	project_id = 'yhack-187804'
	query = """SELECT Fault_Trigger, COUNT(FAULT_TRIGGER) FROM [yhack-187804:Entrydata.error_data] GROUP BY FAULT_TRIGGER"""
	df = gbq.read_gbq(query, project_id=project_id)
	fault_triggers = list(df['Fault_Trigger'])
	fault_triggers_cnts = list(df['f0_'])
	return {"fault_trigger": fault_triggers, "fault_trigger_cnts": fault_triggers_cnts}

def get_fault_trigger_avg_duration():
	""" Query to get the avg duration of the fault triggers """
	project_id = 'yhack-187804'
	query = """SELECT FAULT_Trigger, Duration FROM [yhack-187804:Entrydata.error_data]"""
	df = gbq.read_gbq(query, project_id=project_id)
	df["Duration"] = df["Duration"].apply(lambda x: hms_to_seconds(x))
	df = df.groupby("FAULT_Trigger").mean().reset_index()
	fault_triggers = list(df['FAULT_Trigger'])
	fault_trigger_avg_duration = list(df['Duration'])
	print(fault_triggers, fault_trigger_avg_duration)
	return {"fault_trigger": fault_triggers, "fault_trigger_avg_duration": fault_trigger_avg_duration}

def get_descriptions():
	project_id = 'yhack-187804'
	query = """SELECT Description, Count(Description) FROM [yhack-187804:Entrydata.error_data] GROUP BY  Description"""
	df = gbq.read_gbq(query, project_id=project_id)
	description = list(df["Description"])
	description_cnt = list(df["f0_"])
	return {"description": description, "description_cnt": description_cnt}
