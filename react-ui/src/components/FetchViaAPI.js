import React, { Component } from 'react';
import 'whatwg-fetch';


import { connect } from 'react-refetch';

class FetchViaAPI extends Component {
  static url = '/api';

  render() {
    const { apiFetch } = this.props;

    if (apiFetch.pending) {
      //return 'Fetching message from API'
      return null;
    } else if (apiFetch.rejected) {
      //return `API call failed: ${apiFetch.reason.message}`
      return null;
    } else if (apiFetch.fulfilled) {
      return <h3>{apiFetch.value.message}</h3>;
    }
  }
}


export default connect((props, context) => ({
  apiFetch: FetchViaAPI.url
}))(FetchViaAPI);
