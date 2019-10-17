import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Login from './Login';
import { updateWeather } from '../actions';
// import { createPlayer } from '../util';

import './Player.scss';
import {
  createPlaylist, getTopTracks, getAudioFeatures, getUserProfile,
} from '../util/SpotifyAPI';

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
      const data = await response.json();
      console.log(data);
      dispatch(updateWeather(data));
      setDesc(`Music based on ${data.name} weather...`);

      // Gets audio features for user's top tracks
      const userProfile = await getUserProfile(token);
      console.log(userProfile);
      // // Creates the playlist
      // const res = await createPlaylist(userProfile.id, `s`, 'description blah blah', token);
      // console.log(res.json());

      const playlistLength = 31;
      let playlist = [];
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      const i = 0;
      while (playlist.length < playlistLength) {
        if (i > 0) { sleep(1000); }
        try {
          const topTrackIds = Promise.all((await getTopTracks(i, token)).items.map((e) => e.id));
          const audioTrackIds = await getAudioFeatures(await topTrackIds, token);
          // const audioTracks = (await topTracks).filter((e) => {
          //   const delta = e.valence - data.clouds.all * 0.01;
          //   return delta > 0.5;
          // // return e.valence >= 1 - data.clouds.all * 0.01;
          // });
          playlist = [...playlist, ...audioTrackIds.audio_features];
          console.log(playlist);
        } catch (e) {
          console.log(e);
          break;
        }
      }
      // setTracks(playlist.map((e) => (
      //   <tr key={e.id}>
      //     <td>{e.valence}</td>
      //     <td><a href={e.uri}>{e.uri}</a></td>
      //   </tr>
      // )));
    }
    // }, 10000);
    // }
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
        <table>
          <thead>
            <tr>
              <th>Valence</th>
              <th>URI</th>
            </tr>
          </thead>
          <tbody>
            { tracks }
          </tbody>

        </table>
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
