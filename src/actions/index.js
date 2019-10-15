import {setCookie, deleteCookie} from '../config';

export const setToken = token => {
  setCookie('token', token['access_token'], token['expires_in']);
  return ({
    type: 'GEN_TOKEN',
    token: token
  });
}
export const generateToken = hash => {
  const res = {};
  hash.substring(1).split('&').forEach(item => {
    res[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
  });
  return setToken(res);
};
export const deleteToken = () => {
  deleteCookie('token');
  return ({ type: 'DEL_TOKEN' });
}