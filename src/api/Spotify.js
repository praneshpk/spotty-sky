export async function getTopTracks(token) {
  const res = await fetch('https://api.spotify.com/v1/me/top/tracks', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
export async function getAudioFeatures(id, token) {
  const res = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
