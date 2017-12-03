import React from 'react';
import axios from 'axios';
import {Doughnut} from 'react-chartjs-2';


class OperationModeCounts extends React.Component {
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
		  	var operation_counts = {}
		  	if(data != null) {
			  	Object.keys(data).forEach(key => {
			  		var operation = data[key]["Operation Mode"]
			  		if(operation != "None") { // only get the non-undefined submodules
				  		if(operation in operation_counts) {
				  			operation_counts[operation] += 1
				  		} else {
				  			operation_counts[operation] = 0
				  		}
			  		}
			  	});
			  	let operation = Object.keys(operation_counts)
			  	let operation_cnts = Object.values(operation_counts)
			  	_this.setState({"operationCounts": {"operation": operation, "operation_counts": operation_cnts}, loaded: true})

			  }
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});

	}

	render() {
		if(this.state.operationCounts !== undefined) {
			var chartData = {
				labels: this.state.operationCounts["operation"], 
				datasets: [
					{
						label: "# of times this operation mode was on when the module failed", 
						backgroundColor: ["#e8c3b9","#c45850"],
						data: this.state.operationCounts["operation_counts"]
					}
				]
			};

			var chartOptions =  {
		      legend: { display: false },
		      title: {
		        display: true,
		       	fontSize: 20,
		        text: 'Operation Mode Counts'
		      }
		    };

			return <Doughnut data={chartData} options={chartOptions}/>
		} else {
			return <div></div>;
		}
	}

}

export default OperationModeCounts;
