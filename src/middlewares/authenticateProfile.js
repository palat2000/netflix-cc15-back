const createError = require("../utils/create-error");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorizationProfile;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("unauthenticated", 401));
    }

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || "mnbvcxz");
    console.log(payload)

    const userProfile = await prisma.userProfile.findUnique({
      where: {
        id: +payload.userProfileId,
      },
    });
    if (!userProfile) {
      return next(createError("unauthenticated", 401));
    }
    let subscription;
    if (req.user.subscriptionId) {
      subscription = await stripe.subscriptions.retrieve(
        req.user.subscriptionId
      );
    }
    if (subscription?.status !== "active") {
      await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          isActive: false,
        },
      });
      req.user.isActive = false;
      return res.status(400).json({ user: req.user });
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
