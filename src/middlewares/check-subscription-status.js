const stripe = require("stripe")(process.env.STRIPE_API_TEST_KEY);
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

module.exports = async (req, res, next) => {
  try {
    console.log("🚀 ~ file: check-subscription-status.js:5 ~ module.exports= ~ req:", req.profile)

    const subscriptionIdObj = await prisma.user.findFirst({
      where: {
        id: req.profile.userId
      },
      select: {
        subscriptionId: true
      }
    })

    const subscriptionId = subscriptionIdObj.subscriptionId
    console.log("🚀 ~ file: check-subscription-status.js:13 ~ module.exports= ~ subscriptionId:", subscriptionId)

    let subscription;

    if (!subscriptionId) {
      return next(createError("Payment Expired", 402))
    }

    if (subscriptionId) {
      subscription = await stripe.subscriptions.retrieve(
        subscriptionId
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
      return next(createError("Payment Expired", 402))
    }
    next();
  } catch (err) {
    next(err);
  }
};
