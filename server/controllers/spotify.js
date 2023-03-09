require("dotenv").config();
const Playlist = require("../models/playlist");
const request = require("request");

let userPlaylistSongsJSON;
let access_token = "";
var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

let generateRandomString = function (length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Login
const spotifyLogin = async (req, res) => {
  // allowable features from the requested token - what this access token can do
  var scope =
    "streaming user-read-email user-read-private app-remote-control user-read-playback-state user-modify-playback-state user-read-currently-playing";

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: process.env.EXTERNAL_URL_HOST + "api/auth/callback",
    state: state,
  });
  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
};

// Callback
const spotifyCallback = async (req, res) => {
  var code = req.query.code;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: process.env.EXTERNAL_URL_HOST + "api/auth/callback",
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      console.log(access_token);

      res.redirect("/");
    }
  });
};

// Token
const spotifyToken = async (req, res) => {
  if (!access_token) {
  }
  res.json({
    access_token: access_token,
  });
};

// populatePlaylist
const populatePlaylist = async (req, res) => {
  // Get current user profile, i.e. get user id here
  let url = "https://api.spotify.com/v1/me";
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  const userResult = await fetch(url, requestOptions);
  const userResultJSON = await userResult.json();
  const userID = userResultJSON.id;

  // Get user's playlist id here using user id from above
  url = `https://api.spotify.com/v1/users/${userID}/playlists`;
  const userPlaylistsResult = await fetch(url, requestOptions);
  const userPlaylistsResultJSON = await userPlaylistsResult.json();
  const playlistId = userPlaylistsResultJSON.items[0].id;

  // Get playlist items here using playlist id from above
  url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const userPlaylistSongs = await fetch(url, requestOptions);
  userPlaylistSongsJSON = await userPlaylistSongs.json();

  // Seed database with songs from playlist
  let songURI = "";
  let songs = userPlaylistSongsJSON.items;

  let seedSongs = [];
  for (const item of songs) {
    const song = {
      imgUrl: item.track.album.images[0].url,
      title: item.track.name,
      artist: item.track.artists[0].name,
      trackUrl: item.track.uri,
      count: 0,
    };
    seedSongs.push(song);
  }
  await Playlist.insertMany(seedSongs);
  console.log("Seeded db with spotify playlist!");

  // const songJSON = await song.json();
  res.status(200).json({ userPlaylistSongsJSON });
};

// Plays a song selected by user
const playSelectedSong = async (req, res) => {
  // console.log(req.body.id); // prints 63ff9a581b6a4f463d8c5f82
  const track = await Playlist.findOne(
    { _id: req.body.id },
    { trackUrl: 1, artist: 1, title: 1 }
  );
  url = "https://api.spotify.com/v1/me/player/play";
  playRequestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      uris: [track.trackUrl],
    }),
  };
  const song = await fetch(url, playRequestOptions);

  await Playlist.updateOne(
    { trackUrl: track.trackUrl },
    {
      $set: {
        lastPlayed: new Date(),
        count: 0,
        votedBy: [],
      },
    }
  );
  res.status(200).json({ track });
};

let currentlyPlayingJSON;
// Evaluate when current song is ending
const playNextSongAtEndOfCurrentSong = async (req, res) => {
  url = "https://api.spotify.com/v1/me/player/currently-playing";
  playRequestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  const currentlyPlayingResponse = await fetch(url, playRequestOptions);

  if (currentlyPlayingResponse.status != 200) {
    res
      .status(400)
      .json({ status: "notok", message: currentlyPlayingResponse.statusText });
    return;
  }

  currentlyPlayingJSON = await currentlyPlayingResponse.json();

  const progress_ms = currentlyPlayingJSON.progress_ms;
  const duration_ms = currentlyPlayingJSON.item?.duration_ms;
  const is_playing = currentlyPlayingJSON.is_playing;
  const name = currentlyPlayingJSON.item?.name;

  console.log(
    `Song: ${name} - ${progress_ms}/${duration_ms} is_playing: ${is_playing}`
  );

  if (duration_ms - progress_ms < 2000 || is_playing === false) {
    // if the last played song was within 10s ago, don't play another song
    const lastSongPlayed = await Playlist.findOne(
      {},
      {},
      { sort: { lastPlayed: -1 } }
    );
    const timeSinceLastSongMs = new Date() - lastSongPlayed.lastPlayed;
    if (timeSinceLastSongMs > 10000) {
      await findNextVotedSong();
      res.status(200).json({ status: "ok", message: "played successfully" });
      return;
    } else {
      // console.log("Next song still loading");
    }
  }

  res.status(200).json({ progress_ms, duration_ms, is_playing, name });
};

// Find next voted song
const findNextVotedSong = async () => {
  const songs = await Playlist.find(
    {},
    {},
    { sort: { count: -1, lastPlayed: 1 } }
  );
  let mostVotes = 0;
  let mostVotedSongTrackUrl = songs[0].trackUrl;
  for (let x = 0; x < songs.length; x++) {
    if (songs[x]?.count > mostVotes) {
      mostVotes = songs[x].count;
      mostVotedSongTrackUrl = songs[x].trackUrl;
    }
  }
  await playNextMostVotedSong(mostVotedSongTrackUrl);
  await Playlist.updateOne(
    { trackUrl: mostVotedSongTrackUrl },
    {
      $set: {
        lastPlayed: new Date(),
        count: 0,
        votedBy: [],
      },
    }
  );
};

// Play next voted song
const playNextMostVotedSong = async (trackUrl) => {
  url = "https://api.spotify.com/v1/me/player/play";
  playRequestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      uris: [trackUrl],
    }),
  };
  await fetch(url, playRequestOptions);
};

module.exports = {
  spotifyLogin,
  spotifyCallback,
  spotifyToken,
  populatePlaylist,
  playSelectedSong,
  playNextSongAtEndOfCurrentSong,
};
