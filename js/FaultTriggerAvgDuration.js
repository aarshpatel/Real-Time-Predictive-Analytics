import React from 'react';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';

class FaultTriggerAvgDuration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {
		let ref = firebase.database().ref('streaming_data');
		let only_errors = ref.orderByChild("Sucess").equalTo(0);
		let _this = this;

		only_errors.on("value", function(snapshot) {
		  	var data = snapshot.val();
		  	var fault_trigger_counts = {}
		  	var fault_trigger_durations = {}
		  	Object.keys(data).forEach(key => {

		  		if(data[key]["Duration"] != null) {
			  		var fault_trigger = data[key]["Fault Trigger"]
			  		if(fault_trigger in fault_trigger_counts) {
			  			fault_trigger_counts[fault_trigger] += 1
			  		} else {
			  			fault_trigger_counts[fault_trigger] = 0
			  		}

			  		if(fault_trigger in fault_trigger_durations) {
			  			fault_trigger_durations[fault_trigger] += _this.hmsToSecondsOnly(data[key]["Duration"])
			  		} else {
			  			fault_trigger_durations[fault_trigger] = _this.hmsToSecondsOnly(data[key]["Duration"])
			  		}
			  	}

			});

			let fault_trigger_duration_avg = {}
			Object.keys(fault_trigger_counts).forEach(key => { 
				fault_trigger_duration_avg[key] = fault_trigger_durations[key] / fault_trigger_counts[key];
			});

			let fault_trigger = Object.keys(fault_trigger_duration_avg);
		  	let fault_trigger_avg_duration = Object.values(fault_trigger_duration_avg);

			console.log(fault_trigger);
			console.log(fault_trigger_avg_duration);
		  	_this.setState({"faultTriggerAvgDuration": {"fault_trigger": fault_trigger, "fault_trigger_avg_duration": fault_trigger_avg_duration}, loaded: true})
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});	
	}

	hmsToSecondsOnly(str) {
	    var p = str.split(':'),
	        s = 0, m = 1;

	    while (p.length > 0) {
	        s += m * parseInt(p.pop(), 10);
	        m *= 60;
	    }

    	return s;
	}

	render() {

		if(this.state.faultTriggerAvgDuration !== undefined) {
			console.log(this.state);
			var chartData = {
				labels: this.state.faultTriggerAvgDuration["fault_trigger"], 
				datasets: [
					{
						label: "Fault Trigger AVG Duration", 
						backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
						data: this.state.faultTriggerAvgDuration["fault_trigger_avg_duration"]
					}
				]
			};

			var chartOptions =  {
		      legend: { display: false },
		      title: {
		        display: true,
		        text: 'Fault Trigger AVG Duration'
		      }
		    };

			return <Bar data={chartData} options={chartOptions}/>
		}else {
			return <div></div>;
		}
	}

	getData() {
		axios.get("/get_trigger_avg_duration")
			.then((data) => {
				console.log(data);
				this.setState({"faultTriggerAvgDuration": data["data"]})
			});
	}
}

export default FaultTriggerAvgDuration;