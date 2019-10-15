export const redirect = hash => {
  const result = {};
  hash.substring(1).split('&').forEach(item => {
    result[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
  });
  return ({
    type: 'REDIRECT',
    token: result 
  });
};