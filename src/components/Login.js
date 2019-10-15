import React from 'react';
import { connect } from 'react-redux';

import { generateToken, setToken, deleteToken } from '../actions';

import { authEndpoint, clientId, redirectUri, getCookie} from '../config';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";


const Login = ({ token, dispatch }) => {
  const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&show_dialog=true`;

  const redirect = () => {
    dispatch(generateToken(window.location.hash));
    return <Redirect to="/" />;
  };

  const logout = () => {
    dispatch(deleteToken());
    return <Redirect to="/" />;
  }

  // Restores login session if cookie is still valid
  if(getCookie('token') && !token) {
    dispatch(setToken(getCookie('token')));
  }
  
  return (
    <Router>
      { token ? 
        <a className="btn" href="/logout">Logout</a> :
        <a className="btn" href={loginUrl}>Login to Spotify</a> }
      <Route path="/redirect" component={redirect} />
      <Route path="/logout" component={logout} />
    </Router>
  );
}


const mapStateToProps = state => ({ token: state.auth.token });

export default connect(mapStateToProps)(Login);