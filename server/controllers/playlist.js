require("dotenv").config();
const Playlist = require("../models/playlist");

// When user scans code
const getPlaylist = async (req, res) => {
  const songs = await Playlist.find(); // to see what info to select to display
  res.json(songs);
};

// When user clicks on upvote or downvote
const updatePlaylist = async (req, res) => {
  console.log(req.body);
  try {
    const response = await Playlist.updateOne(
      { _id: req.body.id },
      {
        $set: {
          counter: req.body.counter,
        },
        $push: { votedBy: req.decoded.email },
      }
    );
    console.log(response);

    res.json({ status: "ok", message: "updated" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getPlaylist,
  updatePlaylist,
};
