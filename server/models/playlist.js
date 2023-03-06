const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  imgUrl: { type: String },
  title: { type: String },
  artist: { type: String },
  trackUrl: { type: String },
  votedBy: [{ type: String }],
  count: { type: Number },
  // lastPlayed: { type: },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
