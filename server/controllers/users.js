require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Users = require("../models/users");

// Create a new user (not protected)
const createUser = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (user) {
      // remove !user
      return res
        .status(400)
        .json({ status: "error", message: "duplicate username" });
    }
    const hash = await bcrypt.hash(req.body.password, 12);
    const createdUser = await Users.create({
      email: req.body.email,
      hash,
    });
    // console.log("created user is: ", createdUser);
    res.json({ status: "okay", message: "user created" });
  } catch (error) {
    // console.log("PUT /users/create", error);
    res.status(400).json({ status: "error", message: "an error has occurred" });
  }
};

// Login (not protected)
const login = async (req, res) => {
  // console.log(req);
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "not authorised" });
    }

    const result = await bcrypt.compare(req.body.password, user.hash);
    // console.log(result);
    if (!result) {
      return res.status(401).json({ status: "error", message: "login failed" });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30D",
      jwtid: uuidv4(),
    });
    const response = { access, refresh };
    res.json(response);
  } catch (error) {
    // console.log("POST /users/login", error);
    res.status(400).json({ status: "error", message: "login failed" });
  }
};

// Refresh token (not protected)
const refresh = (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);
    const payload = {
      id: decoded._id,
      email: decoded.email,
    };
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    const response = { access };
    res.json(response);
  } catch (error) {
    // console.log("POST /users/refresh", error);
    res.status(401).json({ status: "error", message: "unauthorised" });
  }
};

// Get all users (auth)
const getUsers = async (req, res) => {
  // console.log("req.decoded: " + req.decoded);
  const users = await Users.find().select("email");
  res.json(users);
};

// Get profile of a user (auth)
const getUser = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.decoded.email });

    if (!user) {
      // console.log("user not found");
      return res.json({ status: "error", message: "user not found" });
    }
    user.hash = undefined;
    res.json(user);
  } catch (error) {
    // console.log("POST /users/user", error);
    res.status(400).json({ status: "error", message: "an error has occurred" });
  }
};

// Delete a user (auth)
const deleteUser = async (req, res) => {
  if (req.decoded.email === req.body.email) {
    try {
      const userToBeDeleted = await Users.deleteOne({
        email: req.body.email,
      });
      if (userToBeDeleted.deletedCount) {
        res.json({ status: "okay", message: "user deleted" });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "user not found in database" });
      }
    } catch (error) {
      // console.log("DEL /users/delete", error);
      res
        .status(400)
        .json({ status: "error", message: "an error has occurred" });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "you're not authorised to delete" });
  }
};

module.exports = {
  login,
  refresh,
  getUsers,
  getUser,
  createUser,
  deleteUser,
};
