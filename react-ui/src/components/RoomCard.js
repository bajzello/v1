import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-refetch';

import FetchViaAPI from './FetchViaAPI'

import {GridTile} from 'material-ui/GridList';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const cardTitleStyle = {
  textAlign: 'center',
};

class RoomCard extends FetchViaAPI {
  render() {
    const { apiFetch } = this.props;

    if (apiFetch.pending) {
      return null;
    } else if (apiFetch.fulfilled) {
      return (
            <Card>
              <CardTitle title={this.props.title} style={cardTitleStyle}/>
              <CardMedia
                overlay={<CardTitle
                  title={"IAQ: " + apiFetch.value.MeasuredAirQuality + "     |     " + apiFetch.value.FineParticulateMatter + "μg/m³   |   " + apiFetch.value.CoarseParticulateMatter + "μg/m³"}
                  subtitle={apiFetch.value.TemperatureC + "°C   |   " + apiFetch.value.Humidity + "%"} />}>
                <img src={this.props.i}/>
              </CardMedia>
            </Card>
      );
    }
    else { return null; }
  }
}

export default connect((props, context) => ({
  apiFetch: {
    url: props.url,
    refreshInterval: 25000 }
}))(RoomCard);
