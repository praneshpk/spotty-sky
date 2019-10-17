export const authEndpoint = 'https://accounts.spotify.com/authorize';

export const clientId = '878fc98b349842e59c5c057bb5dff9ff';
export const redirectUri = 'http://localhost:3000/redirect';
export const scopes = encodeURIComponent('user-top-read playlist-modify-public playlist-modify-private');

export async function getTopTracks(page = 0, token) {
  const pageSize = 50;
  const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${pageSize}&offset=${page * pageSize}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function getAudioFeatures(ids, token) {
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

export async function createPlaylist(userId, name, description, token) {
  const res = fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      public: false,
    }),
  });
  return res;
}
