import React, { Component } from 'react';
import logo from './logo.svg';
import 'whatwg-fetch';
import { connect } from 'react-refetch';
import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import Rooms from './components/Rooms';

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
        <AppBar
          title="Welcome to Strumiany"
          />
        <Rooms/>
        </div>
      </MuiThemeProvider>
    );
  }
}
