import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { HashRouter, Route, Redirect } from 'react-router-dom';
import { generateToken, setToken, deleteToken } from '../actions';

import { getCookie } from '../util/cookies';

import {
  authEndpoint, clientId, redirectUri, scopes,
} from '../util/SpotifyAPI';

export default function Login() {
  const loginUrl = `${authEndpoint}?client_id=${clientId}${scopes && `&scope=${scopes}`}&redirect_uri=${redirectUri}&response_type=token&show_dialog=true`;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const redirect = () => {
    dispatch(generateToken(window.location.hash.substring(2)));
    return <Redirect to="/" />;
  };

  const logout = () => {
    dispatch(deleteToken());
    return <Redirect to="/" />;
  };

  useEffect(() => {
    // Restores login session if cookie is still valid
    if (getCookie('token') && !token) {
      dispatch(setToken(getCookie('token')));
    }
  }, [dispatch, token]);


  return (
    <div className="login">
      { token
        ? <a className="btn" href="#/logout">Logout</a>
        : <a className="btn" href={loginUrl}>Login to Spotify</a> }
      <HashRouter basename="/">
        <Route path="/:access_token(access_token=.*)" component={redirect} />
        <Route path="/logout" component={logout} />
      </HashRouter>
    </div>
  );
}
