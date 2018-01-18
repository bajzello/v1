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
      mode: "off"
    };
  }

  componentDidMount() {
    setInterval(this.loadDataFromServer.bind(this), 1000);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  modeClick(type){
      axios.post('/device/sharp', {
        mode: this.state.mode == "OFF" ? "ON" : "OFF"
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
        mode: result.data.mode
      });
    });
  }

  render() {
      return (
        <Card>
          <CardTitle title={this.props.title} style={cardTitleStyle}/>
          <CardMedia>
            <img src={this.props.i}/>
            <RaisedButton label={this.state.mode} onClick={this.modeClick.bind(this)}/>
          </CardMedia>
        </Card>
      );
  }
}
