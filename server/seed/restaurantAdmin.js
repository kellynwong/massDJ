require("dotenv").config();
const connectDB = require("../db/db");
const RestaurantAdmin = require("../models/restaurantAdmin");
const bcrypt = require("bcrypt");

connectDB();

const main = async () => {
  const seedRestaurantAdmin = [
    {
      email: "cafeluna@gmail.com",
      password: "countryroads",
    },
    { email: "supernova@gmail.com", password: "roxy" },
    {
      email: "pscafe@gmail.com",
      password: "galahadjr",
    },
    {
      email: "shilifang@gmail.com",
      password: "takemehome",
    },
  ];

  for (x = 0; x < seedRestaurantAdmin.length; x++) {
    seedRestaurantAdmin[x]["hash"] = await bcrypt.hash(
      seedRestaurantAdmin[x]["password"],
      12
    );
    delete seedRestaurantAdmin[x]["password"];
  }
  console.log(seedRestaurantAdmin);

  await RestaurantAdmin.insertMany(seedRestaurantAdmin);
  console.log("Created some restaurant admin!");
};
const run = async () => {
  await main();
};
run();

// const hash = await bcrypt.hash(req.body.password, 12);
