const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  imgUrl: { type: String },
  title: { type: String },
  artist: { type: String },
  trackUrl: { type: String },
  votedBy: [String],
  counter: { type: Number },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
