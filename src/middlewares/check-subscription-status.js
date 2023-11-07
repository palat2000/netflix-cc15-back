const stripe = require("stripe")(process.env.STRIPE_API_TEST_KEY);
const prisma = require("../models/prisma");

module.exports = async (req, res, next) => {
  try {
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
    next(err);
  }
};
