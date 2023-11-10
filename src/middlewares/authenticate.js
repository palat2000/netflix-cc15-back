const createError = require("../utils/create-error");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const stripe = require("stripe")(process.env.STRIPE_API_TEST_KEY);

module.exports = async (req, res, next) => {
  try {
    console.log("authennnnn");
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("unauthenticated", 401));
    }

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || "mnbvcxz");
    let user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });
    if (!user) {
      return next(createError("unauthenticated", 401));
    }
    delete user.password;
    req.user = user;
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
    }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
