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
  var scope = "streaming user-read-email user-read-private";

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:3000/auth/callback",
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
      redirect_uri: "http://localhost:3000/auth/callback",
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
  res.json({
    access_token: access_token,
  });
};

// populate and play random song
const playSong = async (req, res) => {
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
    };
    seedSongs.push(song);
  }
  await Playlist.insertMany(seedSongs);
  console.log("Seeded db with spotify playlist!");

  // Start and resume playback of random song using spotify uri from above
  let randomizedSongs = userPlaylistSongsJSON.items.sort(
    () => 0.5 - Math.random()
  );

  for (const item of randomizedSongs) {
    if (item.track) {
      if (item.track.available_markets.includes("SG")) {
        songURI = item.track.uri;
        console.log(songURI + ": " + item.track.name);
      }
    }
  }

  url = "https://api.spotify.com/v1/me/player/play";
  playRequestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      uris: [songURI],
    }),
  };
  const song = await fetch(url, playRequestOptions);
  // const songJSON = await song.json();
  res.status(200).json({ userPlaylistSongsJSON });
};

// play song when user clicks on song at homepage
const playSelectedSong = async (req, res) => {
  console.log(req.body.id);
  // prints 63ff9a581b6a4f463d8c5f82
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
  // const songJSON = await song.json();
  res.status(200).json({ track });
};

const spotifyQueue = async (req, res) => {
  url = "https://api.spotify.com/v1/me/player/queue";
  playRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      uris: [songURI],
    }),
  };
  const queue = await fetch(url, playRequestOptions);
  // const songJSON = await song.json();
  res.status(200).json({ queue });
};

module.exports = {
  spotifyLogin,
  spotifyCallback,
  spotifyToken,
  playSong,
  playSelectedSong,
  spotifyQueue,
};
