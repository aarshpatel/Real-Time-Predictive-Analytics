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
				<div className="col-lg-6">
					<FaultTriggerCount />
			    </div>
				<div className="col-lg-6">
					<FaultTriggerAvgDuration />
			    </div>
				<div className="col-lg-6">
					<DescriptionCounts />
			    </div>
				<div className="col-lg-6">
					<FaultTriggerAvgDuration />
			    </div>
			</div>
		);
  	}
  	
  }

}

export default Dashboard;

