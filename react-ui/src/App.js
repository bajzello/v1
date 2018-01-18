import React, { Component } from 'react';
import logo from './logo.svg';
import 'whatwg-fetch';
import { connect } from 'react-refetch';
import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import Places from './components/Places';
import Devices from './components/Devices';
import SharpDevice from './components/SharpDevice';

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
        <AppBar
          title="Welcome to Strumiany"
          />
        <Places/>
        <Devices/>
        </div>
      </MuiThemeProvider>
    );
  }
}
