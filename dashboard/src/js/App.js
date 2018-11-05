import React from 'react';
import request from 'request-promise-native';

import Home from './Home';
import Detail from './Detail';
import config from '../../config.json';

const API_SERVER = config.API_SERVER;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTrail: null,
      events: []
    }

    this.setSelectedTrail = this.setSelectedTrail.bind(this);
  }

  async componentDidMount() {
    let events = await this.fetchEvents(new Date());
    
    this.setState({events});
  }

  setSelectedTrail(trail) {
    this.setState({
      selectedTrail: trail
    });
  }

  async fetchEvents(startDate, endDate) {
    console.log('Fetching events:', startDate, endDate);
    
    return JSON.parse(await request(API_SERVER + '/events'));
  }

  render() {
    const {
      selectedTrail
    } = this.state;
    
    return <main>
      <h1>Maltrail Dashboard</h1>
      {
        selectedTrail
          ? <Detail selectedTrail={selectedTrail} setSelectedTrail={this.setSelectedTrail} />
          : <Home events={this.state.events} setSelectedTrail={this.setSelectedTrail} />
      }
    </main>;
  }
}