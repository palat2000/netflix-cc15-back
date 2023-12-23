const stripe = require("stripe")(process.env.STRIPE_API_TEST_KEY);
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

module.exports = async (req, res, next) => {
  try {
    if (!req.user.subscriptionId) {
      return next(createError("subscription required", 402));
    }
    if (new Date(req.user.expiredDate) < new Date()) {
      let subscription = await stripe.subscriptions.retrieve(
        req.user.subscriptionId
      );
      if (subscription?.status !== "active") {
        await prisma.user.update({
          where: {
            id: req.user.id,
          },
          data: {
            isActive: false,
          },
        });
        return next(createError("subscription required", 402));
      }
      await prisma.user.update({
        data: {
          expiredDate: new Date(subscription.current_period_end * 1000),
        },
        where: {
          id: req.user.id,
        },
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};
