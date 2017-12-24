import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-refetch';

import FetchViaAPI from './FetchViaAPI'

class OutdoorParticulateMatter extends FetchViaAPI {

  render() {
    const { apiFetch } = this.props;

    if (apiFetch.pending) {
      return (<h1>Loading...</h1>);
    } else if (apiFetch.fulfilled) {
      return (
        <div>
          <h1>Salon</h1>
          <h3>PM2.5: {apiFetch.value.FineParticulateMatter}</h3>
          <h3>PM10: {apiFetch.value.CoarseParticulateMatter}</h3>
          <h3>Humidity: {apiFetch.value.Humidity}</h3>
          <h3>Temperature: {apiFetch.value.TemperatureC}</h3>
          <h3>IAQ: {apiFetch.value.MeasuredAirQuality}</h3>
          <h3>Timestamp: {apiFetch.value.MeasuredAt}</h3>
        </div>
      );
    }
    else { return null; }
  }
}

export default connect((props, context) => ({
  apiFetch: { url: `/indoor`, refreshInterval: 25000 }
}))(OutdoorParticulateMatter);
