export const authEndpoint = 'https://accounts.spotify.com/authorize';

export const clientId = '878fc98b349842e59c5c057bb5dff9ff';
export const redirectUri = 'http://localhost:3000/redirect';
export const scopes = encodeURIComponent('user-top-read playlist-modify-public playlist-modify-private');

export async function getTopType({
  token, type, page = 0, limit = 5,
}) {
  const res = await fetch(`https://api.spotify.com/v1/me/top/${type}?limit=${limit}&offset=${page * limit}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function getRecommendations({
  token, limit = 100, seedArtists, seedTracks,
}) {
  let seeds = seedArtists ? `&seed_artists=${seedArtists.join(',')}` : '';
  seeds = seedTracks ? `${seeds}&seed_tracks=${seedTracks.join(',')}` : seeds;
  const res = await fetch(`https://api.spotify.com/v1/recommendations?limit=${limit}${seeds}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function getAudioFeatures(token, ids) {
  const res = await fetch(`https://api.spotify.com/v1/audio-features/?ids=${ids.join(',')}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function getUserProfile(token) {
  const res = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function createPlaylist({
  token, userId, name, description,
}) {
  const title = name || `spotty sky playlist - ${(new Date()).toLocaleDateString()}`;
  const res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: title,
      description,
      public: false,
    }),
  });
  return (await res.json()).id;
}

export async function addToPlaylist({ token, playlistId, tracks }) {
  const res = fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${tracks.join(',')}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
}
