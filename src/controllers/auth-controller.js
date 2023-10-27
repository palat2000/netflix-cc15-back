const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.test = (req, res, next) => {
  res.json({ message: "OK" });
};
