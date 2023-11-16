const createError = require("../utils/create-error");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorizationprofile;
    console.log(
      "🚀 ~ file: authenticateProfile.js:8 ~ module.exports= ~ authorization:",
      authorization
    );
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
    if (err.name === "JsonWebTokenError") {
      err.statusCode = 401;
    }
    if (err.name === "TokenExpiredError") {
      err.statusCode = 403;
    }
    next(err);
  }
};
