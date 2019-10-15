import React from 'react';
import { connect } from 'react-redux';

import { redirect } from '../actions';

import { authEndpoint, clientId, redirectUri, setCookie, getCookie, deleteCookie } from '../config';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";


const Login = ({ token, dispatch }) => {
  const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&show_dialog=true`;

  const setToken = () => {
    if(!getCookie('token'))
      dispatch(redirect(window.location.hash));
    return <Redirect to="/" />;
  };

  const logout = () => {
    deleteCookie('token');
    return <Redirect to="/" />;
  }

  let login = <a className="btn" href={loginUrl}>Login to Spotify</a>;

  if(token) {
    setCookie('token', token['access_token'], token['expires_in']);
    login = <a className="btn" href="/logout">Logout</a>;
  } 
  
  return (
    <Router>
      {login}
      <Route path="/redirect" component={setToken} />
      <Route path="/logout" component={logout} />
    </Router>
  );
}

const mapStateToProps = state => ({
  token: state.auth.token
});

export default connect(mapStateToProps)(Login);