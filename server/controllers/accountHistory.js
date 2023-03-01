require("dotenv").config();
const AccountHistory = require("../models/accountHistory");

// When user clicks on Account History button
const getAccountHistory = async (req, res) => {
  const history = await AccountHistory.find();
  res.json(history);
};

module.exports = {
  getAccountHistory,
};
