import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Login from './Login';
import Code from './Code';
import { updateWeather } from '../actions';

import './Player.scss';
import {
  createPlaylist, getTopTracks, getAudioFeatures, getUserProfile, addToPlaylist, getTopType, getRecommendations,
} from '../util/SpotifyAPI';

// eslint-disable-next-line react/prop-types
export default function Player() {
  let player;

  const token = useSelector((state) => state.auth.token);
  const weather = useSelector((state) => state.weather);
  const dispatch = useDispatch();

  const [desc, setDesc] = useState();
  const [playlist, setPlaylist] = useState([]);
  const playlistLength = 30;
  const [background, setBackground] = useState('rbga(255,255,255,1)');

  const playlistName = useRef(null);


  async function loadSongs(weatherData) {
    let plist = [];
    try {
      const topSongs = await getTopType({
        token,
        type: 'tracks',
      });
      const topSongIds = Promise.all(topSongs.items.map((e) => e.id));

      const recs = await getRecommendations({
        token,
        seedTracks: await topSongIds,
      });

      let audioTracks = await getAudioFeatures(token, recs.tracks.map((e) => e.id));
      audioTracks = audioTracks.audio_features.filter((e) => {
        const delta = Math.abs(e.valence - weatherData.clouds.all * 0.01);
        return delta > 0.5;
      });
      plist = [...plist, ...audioTracks];
    } catch (e) {
      console.log(e);
    // break;
    }
    setPlaylist(plist);
    // return plist;
  }

  async function savePlaylist(name, limit, plist) {
    const userProfile = await getUserProfile(token);

    const date = new Date();
    const playlistId = await createPlaylist({
      token,
      userId: userProfile.id,
      name,
      description: `Created on ${date.getMonth() + 1}/${date.getDate()} via ${window.location}`,
    });
    addToPlaylist({
      token,
      playlistId,
      tracks: plist.slice(0, limit).map((e) => e.uri),
    });
  }

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
        <h1>Player</h1>
        {/* <input onChange={(e) => setLoc(e.target.value)} value={loc} /> */}
        {/* <button type="submit" onClick={getWeather}>Submit</button> */}
        <h1>{ desc }</h1>

        {playlist.length > 0
          && (
            <form className="playlist-save">
              <input type="text" placeholder="My awesome playlist" ref={playlistName} />
              <button type="button" onClick={() => savePlaylist(playlistName.current.value, playlistLength, playlist)}>Save playlist</button>
            </form>
          )}
        <button type="button" onClick={async () => loadSongs(weather)}>Load Songs</button>

        <Code title="Weather (JSON Response)">
          {JSON.stringify(weather)}
        </Code>
        <Code title="Playlist">
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
