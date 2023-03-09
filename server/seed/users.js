require("dotenv").config();
const connectDB = require("../db/db");
const Users = require("../models/users");
const bcrypt = require("bcrypt");

connectDB();

const main = async () => {
  const seedUsers = [
    {
      email: "shilifang@gmail.com",
      password: "hotpotgood",
      isAdmin: true,
    },
    {
      email: "table41@gmail.com",
      password: "takemehome",
      isAdmin: true,
    },
    { email: "xiaohong@gmail.com", password: "takemehome" },
    {
      email: "xiaobai@gmail.com",
      password: "takemehome",
    },
    {
      email: "xiaohei@gmail.com",
      password: "takemehome",
    },
    {
      email: "xiangjiao@gmail.com",
      password: "takemehome",
    },
    {
      email: "pingguo@gmail.com",
      password: "takemehome",
    },
    {
      email: "liulian@gmail.com",
      password: "takemehome",
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
