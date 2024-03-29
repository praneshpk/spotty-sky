export function getCookie(name) {
  const v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return v ? v[2] : null;
}
export function setCookie(name, value, seconds) {
  const d = new Date();
  d.setTime(d.getTime() + 1000 * seconds);
  document.cookie = `${name}=${value};path=/;expires=${d.toGMTString()}`;
}
export function deleteCookie(name) { setCookie(name, '', -1); }
