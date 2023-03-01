const mongoose = require("mongoose");

const RestaurantAdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
});

module.exports = mongoose.model("RestaurantAdmin", RestaurantAdminSchema);
