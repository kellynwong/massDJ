const mongoose = require("mongoose");

const AccountHistorySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    title: { type: String },
    artist: { type: String },
    restaurant: { type: String },
    vote: { type: Number },
    imgUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccountHistory", AccountHistorySchema);
