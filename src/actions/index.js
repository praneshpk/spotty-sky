import { setCookie, deleteCookie } from '../util';

export const setToken = (token) => {
  setCookie('token', token.access_token, token.expires_in);
  return ({
    type: 'GEN_TOKEN',
    token,
  });
};
export const generateToken = (hash) => {
  const res = {};
  hash.substring(1).split('&').forEach((item) => {
    res[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
  });
  return setToken(res);
};
export const deleteToken = () => {
  deleteCookie('token');
  return ({ type: 'DEL_TOKEN' });
};
export const updateWeather = (json) => {
  const weather = json;
  console.log(json);
  return ({
    type: 'UPDATE_WEATHER',
    weather,
  });
};

