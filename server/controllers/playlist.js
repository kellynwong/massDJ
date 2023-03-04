require("dotenv").config();
const Playlist = require("../models/playlist");

// to load songs at homepage
const getPlaylist = async (req, res) => {
  const songs = await Playlist.find();
  res.json(songs);
};

// When user clicks on vote
const updatePlaylist = async (req, res) => {
  try {
    const response = await Playlist.updateOne(
      { _id: req.body.id },
      {
        $inc: {
          count: req.body.vote,
        },
        $push: {
          votedBy: req.userEmail,
        },
      }
    );

    // console.log(response);

    res.json({ status: "ok", message: "updated" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getPlaylist,
  updatePlaylist,
};
