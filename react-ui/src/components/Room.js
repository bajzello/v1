import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-refetch';

import FetchViaAPI from './FetchViaAPI'

import {GridTile} from 'material-ui/GridList';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const cardTitleStyle = {
  textAlign: 'center',
};

class Room extends FetchViaAPI {
  render() {
    const { apiFetch } = this.props;

    if (apiFetch.pending) {
      return null;
    } else if (apiFetch.fulfilled) {
      return (
        <GridTile
          actionPosition="left"
          titlePosition="top"
          titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
          cols={1}
          rows={1}>
            <Card>
              <CardTitle title={this.props.title} style={cardTitleStyle}/>
              <CardMedia
                overlay={<CardTitle
                  title={apiFetch.value.FineParticulateMatter + "μg / " + apiFetch.value.CoarseParticulateMatter + "μg"}
                  subtitle={apiFetch.value.TemperatureC + "°C / " + apiFetch.value.Humidity + "%"} />}>
                <img src={this.props.i}/>
              </CardMedia>
            </Card>
        </GridTile>
      );
    }
    else { return null; }
  }
}

export default connect((props, context) => ({
  apiFetch: {
    url: props.url,
    refreshInterval: 25000 }
}))(Room);
