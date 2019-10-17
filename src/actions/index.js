import { setCookie, deleteCookie } from '../util/cookies';

export const setToken = (token) => ({
  type: 'GEN_TOKEN',
  token,
});
export const generateToken = (hash) => {
  const res = {};
  hash.substring(1).split('&').forEach((item) => {
    res[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
  });
  setCookie('token', res.access_token, res.expires_in);
  return setToken(res.access_token);
};
export const deleteToken = () => {
  deleteCookie('token');
  return ({ type: 'DEL_TOKEN' });
};
export const updateWeather = (json) => {
  const weather = json;
  return ({
    type: 'UPDATE_WEATHER',
    weather,
  });
};
