import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-refetch';

import FetchViaAPI from './FetchViaAPI'

class OutdoorParticulateMatter extends FetchViaAPI {

  render() {
    const { apiFetch } = this.props;

    if (apiFetch.fulfilled) {
      return (
        <div>
          <h1>Indoor Air Quality</h1>
          <h3>PM2.5: {apiFetch.value.pm25}</h3>
          <h3>PM10.0: {apiFetch.value.pm100}</h3>
        </div>
      );
    }
    else { return null; }
  }
}

export default connect((props, context) => ({
  apiFetch: "/indoor"
}))(OutdoorParticulateMatter);
