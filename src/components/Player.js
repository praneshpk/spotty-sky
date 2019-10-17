import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Login from './Login';
import { updateWeather } from '../actions';
// import { createPlayer } from '../util';

import './Player.scss';
import { getTopTracks, getAudioFeatures } from '../api/Spotify';

// eslint-disable-next-line react/prop-types
const Player = ({ token, dispatch }) => {
  let player;

  const [desc, setDesc] = useState();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    let loc = 'q=New York, NY, US';

    // Fetch weather data based on location
    async function getWeather() {
      const url = `https://community-open-weather-map.p.rapidapi.com/weather?${loc}&units=imperial`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
          'x-rapidapi-key': '15fe13f990msha0b23062c32707cp148f84jsn17e58c929a3f',
        },
      });
      const json = await response.json();
      dispatch(updateWeather(json));
      setDesc(`Music based on ${json.name} weather...`);

      // Gets audio features for user's top tracks
      if (token) {
        const topTracks = await Promise.all(
          (await getTopTracks(token)).items.map(
            async (e) => getAudioFeatures(e.id, token),
          ),
        );
        console.log(topTracks);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        loc = `lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
        getWeather();
      }, () => getWeather());
    } else {
      getWeather();
    }
  }, [dispatch, token]);

  if (token) {
    player = (
      <div className="player__container">
        {token}
        <h1>Player</h1>
        {/* <input onChange={(e) => setLoc(e.target.value)} value={loc} /> */}
        {/* <button type="submit" onClick={getWeather}>Submit</button> */}
        <h1>{ desc }</h1>
        <ul>{ tracks }</ul>
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

const mapStateToProps = (state) => ({
  token: state.auth.token,
  weather: state.weather,
});

export default connect(mapStateToProps)(Player);
