const stripe = require("stripe")(process.env.STRIPE_API_TEST_KEY);

module.exports = async (req, res, next) => {
  try {
    if (!req.user.subscriptionId) {
      return res.status(402).json({ message: "subscription required" });
    }
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
      return res.status(402).json({ message: "subscription required" });
    }
    next();
  } catch (err) {
    next(err);
  }
};
