import React from 'react';
import axios from 'axios';
import {Doughnut} from 'react-chartjs-2';


class DescriptionCounts extends React.Component {
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
		  	var description_counts = {}
		  	Object.keys(data).forEach(key => {
		  		var description = data[key]["Description"]
		  		if(description in description_counts) {
		  			description_counts[description] += 1
		  		} else {
		  			description_counts[description] = 0
		  		}
			});
		  	let descriptions = Object.keys(description_counts)
		  	let description_cnts = Object.values(description_counts)
		  	_this.setState({"descriptionCounts": {"description": descriptions, "description_cnt": description_cnts}, loaded: true})
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
	}

	render() {

		if(this.state.descriptionCounts !== undefined) {
			console.log(this.state);
			var chartData = {
				labels: this.state.descriptionCounts["description"], 
				datasets: [
					{
						label: "Fault Description Counts", 
						data: this.state.descriptionCounts["description_cnt"]
					}
				]
			};

			var chartOptions =  {
		      legend: { display: false },
		      title: {
		        display: true,
		        text: 'Fault Description Counts'
		      }
		    };

			return <Doughnut data={chartData} options={chartOptions}/>
		}else {
			return <div></div>;
		}
	}

	getData() {
		axios.get("/get_descriptions")
			.then((data) => {
				console.log(data);
				this.setState({"descriptionCounts": data["data"]})
			});
	}
}

export default DescriptionCounts;
