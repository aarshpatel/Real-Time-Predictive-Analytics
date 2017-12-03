import React from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';

class LiveDashboard extends React.Component {
   constructor(props) {
    super(props);
    this.state = {}; 
  }

  componentDidMount() {
		let ref = firebase.database().ref('streaming-data');
		let _this = this;

		ref.on("value", function(snapshot) {
		  	var data = snapshot.val();
		  	var time_step_probs = {}
		  	var status = [];
		  	if(data != null) {
			  	Object.keys(data).forEach(key => {
			  		var time_step = data[key]["Occurred"];
			  		var prob_of_time_step = data[key]["Prob"];
			  		status.push(data[key]["Success"]);
			  		time_step_probs[time_step] = prob_of_time_step;
				});

			  	let time_steps = Object.keys(time_step_probs)
			  	let probs = Object.values(time_step_probs)

				_this.setState({"timeSteps": {"time_steps": time_steps, "probs": probs, "status": status}});
			  }
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});

	}

  render() {

  

	if(this.state.timeSteps !== undefined) {
			var colorValues = [];
			var pointSizes = [];
			var time_steps = this.state.timeSteps["time_steps"].slice(this.state.timeSteps["time_steps"].length-20, this.state.timeSteps["time_steps"].length);
			var probs = this.state.timeSteps["probs"].slice(this.state.timeSteps["probs"].length-20, this.state.timeSteps["probs"].length);
			var status = this.state.timeSteps["status"];

			function convertLabels(currentValue, index, array) {
				if(currentValue == 0) {
					return "Failure";
				}
				else if(currentValue == 1) {
					return "Warning";
				}
				else {
					return "Normal";
				}
			}

			let labels = status.map(convertLabels).slice(status.length-20, status.length);

			console.log("Labels", labels);
			alert = false;

			if(probs.slice(-1)[0] > .85) {
				alert = true;
			}

			if(alert) {
		 		alertify.set({ delay: 10000 });
				alertify.error("Warning. There might be a fault in the system. Please check it out");		
  			}

			for (var i = 0; i < probs.length; i++) {
				if (probs[i] > 0.85) {
					colorValues.push("#034748");
					pointSizes.push(7);
				} else {
					colorValues.push("#42b9ff");
					pointSizes.push(4);
				}
			}

			var chartData = {
				labels: time_steps,
				datasets: [
					{
						label: "Prob", 
						borderColor: "#42b9ff",
						backgroundColor: "rgba(75,192,192,0.4)",
						pointBackgroundColor: colorValues,
						pointRadius: pointSizes,
						data: probs
					}
				]
			};

			var chartOptions =  {
		      legend: { display: false },
		      title: {
		        display: true,
		        text: 'Live Streaming IoT Data',
		        fontSize: 50
		      },
		      xAxes: [{
				    type: 'time',
				    ticks: {
				        autoSkip: true,
				        maxTicksLimit: 5
	    			}
				}]
		    };

			return <Line data={chartData} options={chartOptions}/>
		} else {
			return <div></div>;
		}
  }

}

export default LiveDashboard;

