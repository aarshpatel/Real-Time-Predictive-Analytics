import React from 'react';
import axios from 'axios';
import FaultTriggerCount from './FaultTriggerCount.js'
import FaultTriggerAvgDuration from './FaultTriggerAvgDuration.js'
import DescriptionCounts from './DescriptionCounts.js';
import LiveDashboard from './LiveDashboard.js';
import config from './firebase-config';

class Dashboard extends React.Component {
   constructor(props) {
    super(props);
    this.state = {}; 
    firebase.initializeApp(config);
  }

  render() {
  	var url = window.location.href;
  	if(url.includes("/live")){
  		// render live page	
  		return <LiveDashboard />
  	}
  	else {
		return (<div className="row">
				<div className="col-md-4">
					<FaultTriggerCount />
			    </div>
				<div className="col-md-4">
					<FaultTriggerAvgDuration />
			    </div>
				<div className="col-md-4">
					<DescriptionCounts />
			    </div>
				<div className="col-md-4">
					<FaultTriggerAvgDuration />
			    </div>
			    <div className="col-md-4">
					<FaultTriggerAvgDuration />
			    </div>
			    <div className="col-md-4">
					<FaultTriggerAvgDuration />
			    </div>
			</div>
		);
  	}
  	
  }

}

export default Dashboard;

