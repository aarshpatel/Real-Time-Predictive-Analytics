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
		  	if(data != null) {
			  	Object.keys(data).forEach(key => {
			  		var time_step = data[key]["Occurred"];
			  		var prob_of_time_step = data[key]["Prob"];
			  		time_step_probs[time_step] = prob_of_time_step;
				});

			  	let time_steps = Object.keys(time_step_probs)
			  	let probs = Object.values(time_step_probs)
			  	_this.setState({"timeSteps": {"time_steps": time_steps, "probs": probs}, loaded: true})
			  }
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});

	}

  render() {
	if(this.state.timeSteps !== undefined) {
			var chartData = {
				labels: this.state.timeSteps["time_steps"],
				datasets: [
					{
						label: "Probability", 
						borderColor: "#42b9ff",
						data: this.state.timeSteps["probs"]
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

