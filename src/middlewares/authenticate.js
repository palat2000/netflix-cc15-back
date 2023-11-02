const createError = require("../utils/create-error");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const stripe = require("stripe")(process.env.STRIPE_API_TEST_KEY);

module.exports = async (req, res, next) => {
  try {
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
    const subscription = await stripe.subscriptions.retrieve(
      user.subscriptionId
    );
    if (subscription.status !== "active") {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isActive: false,
        },
      });
      user.isActive = false;
    }
    delete user.password;
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
