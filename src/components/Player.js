import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Login from './Login';
import Code from './Code';
import { updateWeather } from '../actions';

import './Player.scss';
import { loadSongs, savePlaylist } from '../util/PlayerEngine';

// eslint-disable-next-line react/prop-types
export default function Player() {
  let player;

  const token = useSelector((state) => state.auth.token);
  const weather = useSelector((state) => state.weather);
  const dispatch = useDispatch();

  const [desc, setDesc] = useState();
  const [playlist, setPlaylist] = useState([]);
  const limit = 30;
  const [background, setBackground] = useState('rbga(255,255,255,1)');

  const playlistName = useRef(null);

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
      const data = await response.json();
      setBackground(`rgba(255,167,22,${1 - data.clouds.all * 0.01})`);
      dispatch(updateWeather(data));
      setDesc(`Music based on ${data.name} weather...`);
    }
    if (token) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          loc = `lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
          getWeather();
        }, () => getWeather());
      } else {
        getWeather();
      }
    }
  }, [dispatch, token]);

  if (token) {
    player = (
      <div className="player__container">
        <h1>Spotty Sky</h1>
        <h2>{ desc }</h2>
        <div className="flex controls">
          <button type="button" onClick={async () => setPlaylist(await loadSongs(token, weather))}>Load Songs</button>

          {playlist.length > 0
          && (
            <div>
              <input type="text" placeholder="My Awesome Playlist" ref={playlistName} />
              <button
                type="button"
                onClick={() => savePlaylist({
                  token, name: playlistName.current.value, limit, playlist,
                })}
              >
              Save playlist
              </button>
            </div>
          )}
        </div>
        <Code title="Weather (JSON Response)">
          {JSON.stringify(weather)}
        </Code>
        <Code title="Playlist (JSON Response)">
          {JSON.stringify(playlist)}
        </Code>
      </div>
    );
  }

  return (
    <div className="player" style={{ background }}>
      <Login />
      { player }
    </div>
  );
}
