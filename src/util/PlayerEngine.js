import {
  createPlaylist, getTopType, getAudioFeatures, getRecommendations, getUserProfile, addToPlaylist,
} from './SpotifyAPI';

export async function loadSongs(token, weatherData) {
  let playlist = [];
  try {
    const topSongs = await getTopType({
      token,
      type: 'tracks',
    });
    const topSongIds = Promise.all(topSongs.items.map((e) => e.id));

    const recs = await getRecommendations({
      token,
      seedTracks: await topSongIds,
    });

    let audioTracks = await getAudioFeatures(token, recs.tracks.map((e) => e.id));
    audioTracks = audioTracks.audio_features.filter((e) => {
      const delta = Math.abs(e.valence - weatherData.clouds.all * 0.01);
      return delta > 0.5;
    });
    playlist = [...playlist, ...audioTracks];
  } catch (e) {
    console.log(e);
  // break;
  }
  // setPlaylist(plist);
  return playlist;
}

export async function savePlaylist({
  token, name, limit, playlist,
}) {
  const userProfile = await getUserProfile(token);

  const date = new Date();
  const playlistId = await createPlaylist({
    token,
    userId: userProfile.id,
    name,
    description: `Created on ${date.getMonth() + 1}/${date.getDate()} via ${window.location}`,
  });
  addToPlaylist({
    token,
    playlistId,
    tracks: playlist.slice(0, limit).map((e) => e.uri),
  });
}
