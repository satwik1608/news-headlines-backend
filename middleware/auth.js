const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied bitch");

  try {
    const decoded = jwt.verify(token, process.env.headlines_jwtPrivateKey);
    req.user = decoded; // id as in the payload
    next();
  } catch (ex) {
    res.status(400).send("Wrong token bitch");
  }
};
