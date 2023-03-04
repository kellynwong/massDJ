require("dotenv").config();

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers["authorization"].replace("Bearer ", "");
  // console.log("token replacing bearer: " + token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.userEmail = decoded.email;
      req.decoded = decoded;
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

module.exports = auth;
