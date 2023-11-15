const createError = require("../utils/create-error");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

module.exports = async (req, res, next) => {
  try {
    console.log("authenAdmin Back");
    console.log(req.headers);
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("unauthenticated", 401));
    }

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || "mnbvcxz");
    let admin = await prisma.admin.findFirst({
      where: {
        id: payload.adminId,
      },
    });
    if (!admin) {
      return next(createError("unauthenticated", 401));
    }
    delete admin.password;
    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
