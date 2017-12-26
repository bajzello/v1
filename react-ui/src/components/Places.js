import React, { Component } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';

import Room from './Room';
import RoomCard from './RoomCard';
import OutsideCard from './OutsideCard';

import living_room_image from './../images/living-room-640.jpg';
import kids_room_image from './../images/kids-room-640.jpg';
import house_image from './../images/house-1280x714.jpg';

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


export default class Places extends Component {
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
        cols={2}>
        <OutsideCard title="Outdoor" i={house_image} url="https://cors-anywhere.herokuapp.com/http://api.looko2.com/?method=GPSGetClosestLooko&lat=49.999731&lon=20.094633&token=1510759476"/>
      </GridTile>
      <GridTile
        cols={1}>
        <RoomCard title="Living Room" i={living_room_image} url="/indoor-living-room"/>
      </GridTile>
      <GridTile
        cols={1}>
        <RoomCard title="Kids Room" i={kids_room_image} url="/indoor-kids-room"/>
      </GridTile>
    </GridList>
    </div>
    );
  }
}
