export const authEndpoint = 'https://accounts.spotify.com/authorize';

export const clientId = '878fc98b349842e59c5c057bb5dff9ff';
export const redirectUri = 'http://localhost:3000/redirect';

export function getCookie(name) {
  const v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return v ? v[2] : null;
}
export function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = `${name}=${value};path=/;expires=${d.toGMTString()}`;
}
export function deleteCookie(name) { setCookie(name, '', -1); }