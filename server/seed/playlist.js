const connectDB = require("../db/db");
const Playlist = require("../models/Playlist");

connectDB();

const main = async () => {
  const seedSongs = [
    {
      imgUrl: "santa monica",
      title: "santa monica",
      artist: "savage garden",
      trackUrl: "santa monica",
      votedBy: ["sharon@gmail.com", "peter@gmail.com", "dick@gmail.com"],
      counter: 5,
    },
    {
      imgUrl: "turn back time",
      title: "turn back time",
      artist: "aqua",
      trackUrl: "turn back time",
      votedBy: ["sharon@gmail.com", "peter@gmail.com", "dick@gmail.com"],
      counter: 10,
    },
    {
      imgUrl: "the reason",
      title: "the reason",
      artist: "hoobastank",
      trackUrl: "the reason",
      votedBy: ["sharon@gmail.com", "peter@gmail.com", "dick@gmail.com"],
      counter: 2,
    },
    {
      imgUrl: "everybody's changing",
      title: "everybody's changing",
      artist: "keane",
      trackUrl: "everyboday's changing",
      votedBy: ["sharon@gmail.com", "peter@gmail.com", "dick@gmail.com"],
      counter: 0,
    },
  ];

  await Playlist.insertMany(seedSongs);
  console.log("Created some songs!");
};
const run = async () => {
  await main();
};
run();
