import React from 'react';
import axios from 'axios';
import {HorizontalBar} from 'react-chartjs-2';


class StudIDCounts extends React.Component {
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
		  	var studid_counts = {}
		  	if(data != null) {
			  	Object.keys(data).forEach(key => {
			  		var studid = data[key]["StudID"]
			  		console.log(studid);
			  		if(studid != undefined) { // only get the non-undefined submodules
				  		if(studid in studid_counts) {
				  			studid_counts[studid] += 1
				  		} else {
				  			studid_counts[studid] = 0
				  		}
			  		}
			  	});
			  	let studid = Object.keys(studid_counts)
			  	let studid_cnts = Object.values(studid_counts)
			  	_this.setState({"studIDCounts": {"studid": studid, "studid_counts": studid_cnts}, loaded: true})
			  }
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});

	}

	render() {
		if(this.state.studIDCounts !== undefined) {
			console.log(this.state);
			var chartData = {
				labels: this.state.studIDCounts["studid"], 
				datasets: [
					{
						label: "# of times module has failed", 
						data: this.state.studIDCounts["studid_counts"]
					}
				]
			};

			var chartOptions =  {
		      legend: { display: false },
		      title: {
		        display: true,
		 		fontSize: 20,
		        text: 'Stud-ID Error Counts'
		      }
		    };

			return <HorizontalBar data={chartData} options={chartOptions}/>
		} else {
			return <div></div>;
		}
	}

}

export default StudIDCounts;
