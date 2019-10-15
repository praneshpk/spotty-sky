import React, {useState} from 'react';
import { connect } from 'react-redux';

import Login from './Login.js';
import './Player.scss';

const Player = ({ token, dispatch }) => {
  let player;
  let [loc, setLoc] = useState("Raleigh, NC, US");
  let response;

  const getWeather = () => {
    let url = `https://community-open-weather-map.p.rapidapi.com/weather?q=${encodeURIComponent(loc)}`
    try {
      const data = fetch(url, {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
          "x-rapidapi-key": "15fe13f990msha0b23062c32707cp148f84jsn17e58c929a3f"
        }
      }).then(response => {
        console.log(response)
      });

    } catch(e) {
      console.error(e);
    }
  }

  if(token) {


    player = (
      <div className="player__container">
        <h1>Player</h1>
        <input onChange={e => setLoc(e.target.value)} value={loc} />
        <button onClick={getWeather}>Submit</button>
        { response }
      </div>
    );
  }

  return (
    <div className="player">
      <Login />
      { player }
    </div>
  );
};

const mapStateToProps = state => ({ token: state.auth.token });

export default connect(mapStateToProps)(Player);