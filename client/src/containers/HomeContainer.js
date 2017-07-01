import React, { Component } from 'react';
import { connect } from 'react-redux';
import MainView from '../components/MainView';
import JoinRoom from '../containers/JoinRoomContainer';
import { setSocket, disconnect } from '../action-creators/room-actions';

const Home = ({ socket, joinRoom, leaveRoom }) => socket
  ? <MainView socket={socket} leaveRoom={leaveRoom} /> 
  : <JoinRoom joinRoom={joinRoom} />

const mapStateToProps = (state) => {
  return {
    socket: state.room.socket
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    joinRoom: (ip) => dispatch(setSocket(ip)),
    leaveRoom: () => dispatch(disconnect())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);