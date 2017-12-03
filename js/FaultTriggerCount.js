import React from 'react';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';


class FaultTriggerCount extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {
		
		let ref = firebase.database().ref('streaming-data');
		let only_errors = ref.orderByChild("Success").equalTo(0);
		let _this = this;

		only_errors.on("value", function(snapshot) {
		  	var data = snapshot.val();
		  	var fault_trigger_counts = {}
		  	if(data != null) {
			  	Object.keys(data).forEach(key => {
			  		var fault_trigger = data[key]["Fault Trigger"]
			  		if(fault_trigger in fault_trigger_counts) {
			  			fault_trigger_counts[fault_trigger] += 1
			  		} else {
			  			fault_trigger_counts[fault_trigger] = 0
			  		}
				});
			  	let fault_trigger = Object.keys(fault_trigger_counts)
			  	let fault_trigger_cnts = Object.values(fault_trigger_counts)
			  	_this.setState({"faultTriggerCount": {"fault_trigger": fault_trigger, "fault_trigger_cnts": fault_trigger_cnts}, loaded: true})
			  }
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});

	}

	render() {
		if(this.state.faultTriggerCount !== undefined) {
			console.log(this.state);
			var chartData = {
				labels: this.state.faultTriggerCount["fault_trigger"], 
				datasets: [
					{
						label: "Fault Trigger Counts",
						backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
						data: this.state.faultTriggerCount["fault_trigger_cnts"]
					}
				]
			};
			var chartOptions =  {
		      legend: { display: false },
		      title: {
		        display: true,
		 		fontSize: 20,
		        text: 'Fault Trigger Counts'
		      }
		    };

			return <Bar height={250} data={chartData} options={chartOptions}/>
		} else {
			return <div></div>;
		}
	}

	getData() {
		axios.get("/get_trigger_counts")
			.then((data) => {
			console.log(data);
				this.setState({"faultTriggerCount": data["data"], loaded: true})
			});
	}

}

export default FaultTriggerCount;
