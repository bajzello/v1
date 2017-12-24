import React, { Component } from 'react';
import logo from './logo.svg';
import 'whatwg-fetch';
import { connect } from 'react-refetch';
import './App.css';
import FetchViaAPI from './components/FetchViaAPI'
import OutdoorParticulateMatter from './components/OutdoorParticulateMatter'
import IndoorParticulateMatter from './components/IndoorParticulateMatter'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React v.0.0.1</h2>
        </div>
        <FetchViaAPI/>
        <OutdoorParticulateMatter/>
        <IndoorParticulateMatter/>
      </div>
    );
  }

  renderMessage() {
    const { apiFetch } = this.props

    if (apiFetch.pending) {
      return 'Fetching message from API'
    } else if (apiFetch.rejected) {
      return `API call failed: ${apiFetch.reason.message}`
    } else if (apiFetch.fulfilled) {
      return apiFetch.value.message
    }
  }
}

export default connect((props, context) => ({
  apiFetch: '/api'
}))(App);
