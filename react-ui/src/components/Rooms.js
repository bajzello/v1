import React, { Component } from 'react';

import {GridList} from 'material-ui/GridList';

import Room from './Room';

import living_room_image from './../images/living-room-640.jpg';
import kids_room_image from './../images/kids-room-640.jpg';

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


export default class Rooms extends Component {
  render() {
    return (
      <div style={styles.root}>
    <GridList
      cols={2}
      cellHeight="auto"
      padding={1}
      style={styles.gridList}
    >
      <Room title="Living Room" i={living_room_image} url="/indoor-living-room"/>
      <Room title="Kids Room" i={kids_room_image} url="/indoor-kids-room"/>
    </GridList>
    </div>
    );
  }
}
