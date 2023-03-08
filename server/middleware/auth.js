require("dotenv").config();

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.access;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.userEmail = decoded.email;
      req.decoded = decoded;
      next();
    } catch (error) {
      return res.status(401).send({
        status: "error",
        message: "unauthorised",
      });
    }
  } else {
    return res.status(403).json({
      status: "error",
      message: "missing token",
    });
  }
};

const authAdmin = (req, res, next) => {
  const token = req.cookies.access;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.userEmail = decoded.email;
      req.decoded = decoded;

      if (!req.decoded.isAdmin) {
        return res.status(401).send({
          status: "error",
          message: "not admin",
        });
      }
      // console.log("decoded: " + decoded);
      next();
    } catch (error) {
      return res.status(401).send({
        status: "error",
        message: "unauthorised",
      });
    }
  } else {
    return res.status(403).json({
      status: "error",
      message: "missing token",
    });
  }
};

const authOptional = (req, res, next) => {
  // put ? as guard, otherwise for users without authorization headers, will throw error: TypeError: Cannot read properties of undefined (reading 'replace')
  const token = req.cookies.access;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.userEmail = decoded.email;
      req.decoded = decoded;
      // console.log("decoded: " + decoded);
      next();
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};

module.exports = { auth, authAdmin, authOptional };
