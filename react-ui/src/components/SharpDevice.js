import React, {Component} from 'react';
import 'whatwg-fetch';
import { connect } from 'react-refetch';

import FetchViaAPI from './FetchViaAPI'

import {GridTile} from 'material-ui/GridList';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import RaisedButton from 'material-ui/RaisedButton';

const axios = require('axios');

const cardTitleStyle = {
  textAlign: 'center',
};

const style = {
  margin: 12,
};

export default class SharpDevice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: "off",
      speed: ""
    };
  }

  componentDidMount() {
    setInterval(this.loadDataFromServer.bind(this), 10000);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  turnOffClick(type){
      axios.post('/device/sharp', {
        mode: "sharp_off",
        speed: this.state.speed
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  turnCleanClick(type){
      axios.post('/device/sharp', {
        mode: "sharp_clean",
        speed: this.state.speed
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  turnHumidifyClick(type){
      axios.post('/device/sharp', {
        mode: "sharp_clean_and_humidify",
        speed: this.state.speed
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  turnSpeedClick(type){
      axios.post('/device/sharp', {
        mode: this.state.mode,
        speed: this.state.speed == "sharp_speed_low" ? "sharp_speed_high" : "sharp_speed_low"
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  loadDataFromServer() {
    axios.get('/device/sharp')
    .then((result)=> {
      console.log("device - sharp loaded" + result.data)
      this.setState({
        mode: result.data.mode,
        speed: result.data.speed
      });
    });
  }

  render() {
      return (
        <Card>
          <CardTitle title={this.props.title} style={cardTitleStyle}/>
          <CardMedia>
            <img src={this.props.i}/>
            <RaisedButton label={this.state.mode} disabled={true}/>
            <RaisedButton label="TURN OFF" onClick={this.turnOffClick.bind(this)}/>
            <RaisedButton label="CLEAN" onClick={this.turnCleanClick.bind(this)}/>
            <RaisedButton label="HUMIDIFY" onClick={this.turnHumidifyClick.bind(this)}/>
            <RaisedButton label={this.state.speed} onClick={this.turnSpeedClick.bind(this)}/>
          </CardMedia>
        </Card>
      );
  }
}
