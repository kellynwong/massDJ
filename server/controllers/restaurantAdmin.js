require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const RestaurantAdmin = require("../models/restaurantAdmin");

// Create a new Admin (not protected)
const createAdmin = async (req, res) => {
  try {
    const admin = await RestaurantAdmin.findOne({ email: req.body.email });
    if (admin) {
      // remove !admin
      return res
        .status(400)
        .json({ status: "error", message: "duplicate admin" });
    }
    const hash = await bcrypt.hash(req.body.password, 12);
    const createdAdmin = await RestaurantAdmin.create({
      email: req.body.email,
      hash,
    });
    console.log("created admin is: ", createdAdmin);
    res.json({ status: "okay", message: "admin created" });
  } catch (error) {
    console.log("PUT /admin/create", error);
    res.status(400).json({ status: "error", message: "an error has occurred" });
  }
};

// Login (not protected)
const adminLogin = async (req, res) => {
  console.log(req);
  try {
    const admin = await RestaurantAdmin.findOne({ email: req.body.email });
    if (!admin) {
      return res
        .status(400)
        .json({ status: "error", message: "not authorised" });
    }

    const result = await bcrypt.compare(req.body.password, admin.hash);
    console.log(result);
    if (!result) {
      return res.status(401).json({ status: "error", message: "login failed" });
    }

    const payload = {
      id: admin._id,
      email: admin.email,
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
    console.log("POST /admin/login", error);
    res.status(400).json({ status: "error", message: "login failed" });
  }
};

// Refresh token (not protected)
const adminRefresh = (req, res) => {
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
    console.log("POST /admin/refresh", error);
    res.status(401).json({ status: "error", message: "unauthorised" });
  }
};

// Get all admin (auth)
const getAdmin = async (req, res) => {
  console.log("req.decoded: " + req.decoded);
  const admin = await RestaurantAdmin.find().select("email");
  res.json(admin);
};

// Get profile of an admin (auth)
const getAnAdmin = async (req, res) => {
  try {
    const admin = await RestaurantAdmin.findOne({ email: req.decoded.email });

    if (!admin) {
      console.log("admin not found");
      return res.json({ status: "error", message: "admin not found" });
    }
    admin.hash = undefined;
    res.json(admin);
  } catch (error) {
    console.log("POST /admin/admin", error);
    res.status(400).json({ status: "error", message: "an error has occurred" });
  }
};

// Delete an admin (auth)
const deleteAdmin = async (req, res) => {
  if (req.decoded.email === req.body.email) {
    try {
      const adminToBeDeleted = await RestaurantAdmin.deleteOne({
        email: req.body.email,
      });
      if (adminToBeDeleted.deletedCount) {
        res.json({ status: "okay", message: "admin deleted" });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "admin not found in database" });
      }
    } catch (error) {
      console.log("DEL /admin/delete", error);
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
  adminLogin,
  adminRefresh,
  getAdmin,
  getAnAdmin,
  createAdmin,
  deleteAdmin,
};
