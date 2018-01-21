import React, { Component } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';

import { RaisedButton } from 'material-ui/RaisedButton';

import RoomCard from './RoomCard';
import SharpDevice from './SharpDevice';
import sharp_image from './../images/sharp.jpg';

import AOSDevice from './AOSDevice';
import aos_image from './../images/aos.jpg';



const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '600',
    height: 'auto',
    overflowY: 'auto',
  },
};

export default class Devices extends Component {
  render() {
    return (
      <div style={styles.root}>
    <GridList
      cols={2}
      cellHeight="auto"
      padding={1}
      style={styles.gridList}
    >
      <GridTile
        cols={1}>
        <SharpDevice title="Sharp" i={sharp_image}/>
      </GridTile>
      <GridTile
        cols={1}>
        <AOSDevice title="Air-O-Swiss" i={aos_image}/>
      </GridTile>
    </GridList>
    </div>
    );
  }
}
