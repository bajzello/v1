import React, {Component} from 'react';
import 'whatwg-fetch';
import { connect } from 'react-refetch';

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

export default class AOSDevice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: ""
    };
  }

  componentDidMount() {
    setInterval(this.loadDataFromServer.bind(this), 10000);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  modeClick(type){
      axios.post('/device/aos', {
        mode: this.state.mode == "aos_off" ? "aos_on" : "aos_off"
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  loadDataFromServer() {
    axios.get('/device/aos')
    .then((result)=> {
      console.log("device - aos loaded" + result.data)
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
