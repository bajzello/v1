import React from 'react';
import 'whatwg-fetch';
import { connect } from 'react-refetch';

import FetchViaAPI from './FetchViaAPI'

import {GridTile} from 'material-ui/GridList';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const cardTitleStyle = {
  textAlign: 'center',
};

class Outside extends FetchViaAPI {
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
                  title={apiFetch.value.PM1 + "μg/m³   |   " + apiFetch.value.PM25 + "μg/m³   |   " + apiFetch.value.PM10 + "μg/m³"}
                   />}>
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
    refreshInterval: 55000 }
}))(Outside);
