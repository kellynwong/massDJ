require("dotenv").config();
const connectDB = require("../db/db");
const Users = require("../models/users");
const bcrypt = require("bcrypt");

connectDB();

const main = async () => {
  const seedUsers = [
    {
      email: "shilifang@hotmail.com",
      password: "hotpotgood",
      isAdmin: true,
    },
    {
      email: "merlin@gmail.com",
      password: "countryroads",
    },
    { email: "lancelot@gmail.com", password: "roxyroxy" },
    {
      email: "eggsy@gmail.com",
      password: "funtimes",
    },
    {
      email: "kellyn@gmail.com",
      password: "takemehome",
    },
  ];

  for (x = 0; x < seedUsers.length; x++) {
    seedUsers[x]["hash"] = await bcrypt.hash(seedUsers[x]["password"], 12);
    delete seedUsers[x]["password"];
  }

  await Users.insertMany(seedUsers);
  // console.log("Created some users!");
};
const run = async () => {
  await main();
};
run();

// const hash = await bcrypt.hash(req.body.password, 12);
