const createError = require("../utils/create-error");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

module.exports = async (req, res, next) => {
  try {
    if (!req.user.isActive) {
      return res.status(402).json({ message: "subscription required" });
    }
    const authorization = req.headers.authorizationprofile;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("unauthenticated", 401));
    }

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || "mnbvcxz");
    console.log(payload);

    const userProfile = await prisma.userProfile.findUnique({
      where: {
        id: +payload.userProfileId,
      },
    });

    if (!userProfile) {
      return next(createError("unauthenticated", 401));
    }
    req.userProfile = userProfile;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
