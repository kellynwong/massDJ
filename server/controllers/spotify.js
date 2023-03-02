require("dotenv").config();
const Playlist = require("../models/playlist");

const request = require("request");

let userPlaylistSongsJSON;

let access_token = "";

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
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

// Get current user profile, i.e. get user id
const playSong = async (req, res) => {
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
  // console.log(userResultJSON)
  /*
  userResultJSON is like this:
    {
    "country": "SG",
    "display_name": "kel",
    "email": "reallyb@hotmail.com",
    "explicit_content": {
    "filter_enabled": false,
    "filter_locked": false
    },
    "external_urls": {
    "spotify": "https://open.spotify.com/user/hkxfu9gt10by8e28vhjmq7dpj"
    },
    "followers": {
    "href": null,
    "total": 0
    },
    "href": "https://api.spotify.com/v1/users/hkxfu9gt10by8e28vhjmq7dpj",
    "id": "hkxfu9gt10by8e28vhjmq7dpj",
    "images": [],
    "product": "premium",
    "type": "user",
    "uri": "spotify:user:hkxfu9gt10by8e28vhjmq7dpj"
    }
  */
  const userID = userResultJSON.id;

  // GET USER\'S PLAYLISTS --> i.e. USING USER ID
  url = `https://api.spotify.com/v1/users/${userID}/playlists`;
  const userPlaylistsResult = await fetch(url, requestOptions);
  const userPlaylistsResultJSON = await userPlaylistsResult.json();
  // console.log(userPlaylistsResultJSON);
  /*
  userPlaylistsResultJSON is like this:
    {  "href": "https://api.spotify.com/v1/users/user_id/playlists?offset=0&limit=20",
    "items": [
    {
    "collaborative": false,
    "description": "",
    "external_urls": {
    "spotify": "https://open.spotify.com/playlist/1VBuxAMCoWdEnMzxhcRCQK"
    },
    "href": "https://api.spotify.com/v1/playlists/1VBuxAMCoWdEnMzxhcRCQK",
    "id": "1VBuxAMCoWdEnMzxhcRCQK",
    "images": [
    {
    "height": 640,
    "url": "https://i.scdn.co/image/ab67616d0000b2737288fd37e6820ccf87766c47",
    "width": 640
    }
    ],
    "name": "Beats from tha Tube",
    "owner": {
    "display_name": "user_id",
    "external_urls": {
    "spotify": "https://open.spotify.com/user/user_id"
    },
    "href": "https://api.spotify.com/v1/users/user_id",
    "id": "user_id",
    "type": "user",
    "uri": "spotify:user:user_id"
    },
    "primary_color": null,
    "public": true,
    "snapshot_id": "Myw3N2E4ZWE3N2FhYjIzMTQ1NWFjNDg0NmJkMzlmNzFhZTY3ZTk4NzZk",
    "tracks": {
    "href": "https://api.spotify.com/v1/playlists/1VBuxAMCoWdEnMzxhcRCQK/tracks",
    "total": 2
    },
    "type": "playlist",
    "uri": "spotify:playlist:1VBuxAMCoWdEnMzxhcRCQK"
    }],
    "limit": 20,
    "next": null,
    "offset": 0,
    "previous": null,
    "total": 13
  }
  */
  const playlistId = userPlaylistsResultJSON.items[0].id;

  // GET PLAYLIST ITEMS --> i.e. USING PLAYLIST ID
  url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const userPlaylistSongs = await fetch(url, requestOptions);
  userPlaylistSongsJSON = await userPlaylistSongs.json();
  // console.log(userPlaylistSongsJSON);
  /*
    userPlaylistSongsJSON is like this:
      {
    "href": "https://api.spotify.com/v1/playlists/5KLLuVNrbkyYvkglQJaFIb/tracks?offset=0&limit=100&locale=*",
    "items": [
    {
    "added_at": "2021-01-13T05:06:06Z",
    "added_by": {
    "external_urls": {
    "spotify": "https://open.spotify.com/user/hkxfu9gt10by8e28vhjmq7dpj"
    },
    "href": "https://api.spotify.com/v1/users/hkxfu9gt10by8e28vhjmq7dpj",
    "id": "hkxfu9gt10by8e28vhjmq7dpj",
    "type": "user",
    "uri": "spotify:user:hkxfu9gt10by8e28vhjmq7dpj"
    },
    "is_local": false,
    "primary_color": null,
    "track": {
    "album": {
    "album_type": "compilation",
    "artists": [
    {
    "external_urls": {
    "spotify": "https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of"
    },
    "href": "https://api.spotify.com/v1/artists/0LyfQWJT6nXafLPZqxe9Of",
    "id": "0LyfQWJT6nXafLPZqxe9Of",
    "name": "Various Artists",
    "type": "artist",
    "uri": "spotify:artist:0LyfQWJT6nXafLPZqxe9Of"
    }
    ],
    "available_markets": [],
    "external_urls": {
    "spotify": "https://open.spotify.com/album/0PL9k27RIlm6vGiIyRqZei"
    },
    "href": "https://api.spotify.com/v1/albums/0PL9k27RIlm6vGiIyRqZei",
    "id": "0PL9k27RIlm6vGiIyRqZei",
    "images": [
    {
    "height": 640,
    "url": "https://i.scdn.co/image/ab67616d0000b2732fa7269ac3da8b3a6a83fd00",
    "width": 640
    },
    {
    "height": 300,
    "url": "https://i.scdn.co/image/ab67616d00001e022fa7269ac3da8b3a6a83fd00",
    "width": 300
    },
    {
    "height": 64,
    "url": "https://i.scdn.co/image/ab67616d000048512fa7269ac3da8b3a6a83fd00",
    "width": 64
    }
    ],
    "name": "Empress Qi OST",
    "release_date": "2014-08-11",
    "release_date_precision": "day",
    "total_tracks": 10,
    "type": "album",
    "uri": "spotify:album:0PL9k27RIlm6vGiIyRqZei"
    },
    "artists": [
    {
    "external_urls": {
    "spotify": "https://open.spotify.com/artist/4xUJ28gipMxp7blFhQyhH0"
    },
    "href": "https://api.spotify.com/v1/artists/4xUJ28gipMxp7blFhQyhH0",
    "id": "4xUJ28gipMxp7blFhQyhH0",
    "name": "Soyu (Sistar)",
    "type": "artist",
    "uri": "spotify:artist:4xUJ28gipMxp7blFhQyhH0"
    }
    ],
    "available_markets": [],
    "disc_number": 1,
    "duration_ms": 250853,
    "episode": false,
    "explicit": false,
    "external_ids": {
    "isrc": "SEYOK1417022"
    },
    "external_urls": {
    "spotify": "https://open.spotify.com/track/5TR2V4DfMbriJtpqoKXqle"
    },
    "href": "https://api.spotify.com/v1/tracks/5TR2V4DfMbriJtpqoKXqle",
    "id": "5TR2V4DfMbriJtpqoKXqle",
    "is_local": false,
    "name": "Just Once (Part.4)",
    "popularity": 0,
    "preview_url": null,
    "track": true,
    "track_number": 4,
    "type": "track",
    "uri": "spotify:track:5TR2V4DfMbriJtpqoKXqle"
    },
    "video_thumbnail": {
    "url": null
    }
    }, too long to copy cause some have a long list of available markets
  */
  // res.status(200).json(userPlaylistSongsJSON);

  // START/RESUME PLAYBACK--> i.e. USING SPOTIFY ALBUM URI
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

module.exports = {
  spotifyLogin,
  spotifyCallback,
  spotifyToken,
  playSong,
};
