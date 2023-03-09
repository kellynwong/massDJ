require("dotenv").config();
const Playlist = require("../models/playlist");
const AccountHistory = require("../models/accountHistory");
const uuid = require("uuid");

// to load songs at homepage, and when loads, assign a cookie if cookie does not exist
const getPlaylist = async (req, res) => {
  // lean will give me back the entire JSON, will then allow me to change it like an object, i.e. add new property
  const songs = await Playlist.find(
    {},
    {},
    { sort: { count: -1, lastPlayed: 1 } }
  ).lean();
  if (!req.cookies.machineId) {
    let cookieName = "machineId";
    let cookieValue = uuid.v4();
    res.cookie(cookieName, cookieValue, { maxAge: 60 * 1000 * 60 * 24 });
    console.log(req.cookies.machineId);
  }

  let identifier;
  if (req.userEmail) {
    identifier = req.userEmail;
  } else {
    identifier = req.cookies.machineId;
  }
  // console.log("Getting playlist for: " + identifier);

  for (let x = 0; x < songs.length; x++) {
    if (songs[x].votedBy.find((y) => y === identifier)) {
      songs[x].votedBefore = "Yes";
    }
  }
  res.json(songs);
};

// When user clicks on vote
const voteSong = async (req, res) => {
  // Identify the user by their email (if present) or else machine Id
  let identifier;
  if (req.userEmail) {
    identifier = req.userEmail;
  } else {
    identifier = req.cookies.machineId;
  }

  // Check if they voted on this song before
  const voteBefore = await Playlist.findOne({
    _id: req.body.id,
    votedBy: identifier,
  });
  if (voteBefore) {
    // Not allowed to vote twice
    res.status(400).json({ status: "error", message: "voted before" });
    return;
  }

  try {
    // Update the count to add the vote
    await Playlist.updateOne(
      { _id: req.body.id },
      {
        $inc: {
          count: req.body.vote,
        },
        $push: {
          votedBy: identifier,
        },
      }
    );

    if (req.userEmail) {
      // If the user is logged in then add a record to their account history
      const song = await Playlist.findOne({
        _id: req.body.id,
      });
      await AccountHistory.create({
        restaurant: "Table 41",
        email: req.userEmail,
        imgUrl: song.imgUrl,
        title: song.title,
        artist: song.artist,
        vote: req.body.vote,
      });
    }

    res.json({ status: "ok", message: "updated" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getPlaylist,
  voteSong,
};
