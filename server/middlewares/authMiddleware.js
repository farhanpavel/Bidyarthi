const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuthentication = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(404).json({ message: "Jwt Required pavel" });
  }
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  req.user = decoded;
  next();
};
module.exports = { jwtAuthentication };
