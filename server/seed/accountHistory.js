const connectDB = require("../db/db");
const AccountHistory = require("../models/accountHistory");

connectDB();

const main = async () => {
  const seedHistory = [
    {
      email: "sharon@gmail.com",
      title: "santa monica",
      artist: "savage garden",
      restaurant: "supernova",
    },
    {
      email: "peter@gmail.com",
      title: "turn back time",
      artist: "aqua",
      restaurant: "shilifang",
    },
    {
      email: "sharon@gmail.com",
      title: "the reason",
      artist: "hoobastank",
      restaurant: "haidilao",
    },
    {
      email: "dick@gmail.com",
      title: "everybody's changing",
      artist: "keane",
      restaurant: "cafe luna",
    },
  ];

  await AccountHistory.insertMany(seedHistory);
  // console.log("Created some history!");
};
const run = async () => {
  await main();
};
run();
