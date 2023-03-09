require("dotenv").config();
const AccountHistory = require("../models/accountHistory");

// When user clicks on Account History button
const getAccountHistory = async (req, res) => {
  const history = await AccountHistory.find(
    { email: req.decoded.email },
    {},
    { sort: { createdAt: -1 } }
  );
  res.json(history);
};

module.exports = {
  getAccountHistory,
};
