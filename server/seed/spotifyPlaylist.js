// const connectDB = require("../db/db");
// const Playlist = require("../models/playlist");
// const { randomizedSongs } = require("../controllers/spotify");

// connectDB();

// const main = async () => {
//   for (const item of randomizedSongs) {
//     const seedPlaylist = new Playlist({
//       imgUrl: item.track.album.images[0].url,
//       title: item.track.name,
//       artist: item.track.artists[0].name,
//       trackUrl: item.track.uri,
//     });

//     await Playlist.insertMany(seedPlaylist);
//     console.log("Seeded db with spotify playlist!");
//   }
// };
// const run = async () => {
//   await main();
// };
// run();
