import React from 'react';
import 'whatwg-fetch';
import { connect, PromiseState } from 'react-refetch';

import FetchViaAPI from './FetchViaAPI'

import {GridTile} from 'material-ui/GridList';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const cardTitleStyle = {
  textAlign: 'center',
};

class OutsideCard extends FetchViaAPI {
  render() {
    const { airQualityFetch, weatherFetch } = this.props;

    // compose multiple PromiseStates together to wait on them as a whole
    const allFetches = PromiseState.all([airQualityFetch, weatherFetch]);

    if (allFetches.pending) {
      return null;
    }
    else if (allFetches.rejected) {
      return <Error error={allFetches.reason}/>
    }
    else if (allFetches.fulfilled) {
      //decompose the PromiseState back into individual
      const [air, weather] = allFetches.value;

      return (
            <Card>
              <CardTitle title={this.props.title} style={cardTitleStyle}/>
              <CardMedia
                overlay={<CardTitle
                  title={air.PM1 + "μg/m³   |   " + air.PM25 + "μg/m³   |   " + air.PM10 + "μg/m³"}
                  subtitle={weather.currently.temperature + "°C   |   " + weather.currently.humidity*100 + "%"}
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
  airQualityFetch: {
      url: props.airQualityUrl,
      refreshInterval: 55000
     },
  weatherFetch: {
      url: props.weatherUrl,
      refreshInterval: 55000
     },
}))(OutsideCard);
