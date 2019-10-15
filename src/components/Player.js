import React from 'react';
import { connect } from 'react-redux';

import Login from './Login.js';

const Player = ({ token, dispatch }) => {
  let player;
  
  if(token) {
    player = <h1>Player</h1>;
  }

  return (
    <div className="player">
      <Login />
      { player }
    </div>
  );
};


export default connect()(Player);