const stripe = require("stripe")(process.env.STRIPE_API_TEST_KEY);
const { URL } = require("../config/constant");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.payment = async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${URL}/package?canceled=true`,
    });
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

exports.subscription = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const paymentHistory = await prisma.paymentHistory.findFirst({
      where: {
        transaction: sessionId,
      },
    });
    if (paymentHistory) {
      return next(createError("same session", 304));
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );
    const user = await prisma.user.update({
      data: {
        customerId: subscription.customer,
        subscriptionId: subscription.id,
        isActive: true,
        expiredDate: new Date(subscription.current_period_end * 1000),
        activeAt: new Date(subscription.start_date * 1000),
      },
      where: {
        id: req.user.id,
      },
    });
    await prisma.paymentHistory.create({
      data: {
        paymentDate: new Date(),
        transaction: session.id,
        userId: user.id,
      },
    });
    const allUserProfile = await prisma.userProfile.findMany({
      where: {
        userId: user.id,
      },
    });
    delete user.password;
    res.status(200).json({ user, allUserProfile });
  } catch (err) {
    if (err.name === "Error") {
      err.statusCode = 400;
    }
    next(err);
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    await stripe.subscriptions.cancel(req.user.subscriptionId);
    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        isActive: false,
      },
    });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.resumeSubscription = async (req, res, next) => {
  try {
    await stripe.subscriptions.resume(req.user.subscriptionId, {
      billing_cycle_anchor: "now",
    });
    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        isActive: true,
      },
    });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.restartSubscription = async (req, res, next) => {
  try {
    await stripe.subscriptions.update(req.user.subscriptionId, {
      items: [{ id: req.user.subscriptionId }],
      cancel_at: null,
    });
    const user = await prisma.user.update({
      data: {
        isActive: true,
      },
    });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// exports.createPortalSession = async (req, res, next) => {
//   // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
//   // Typically this is stored alongside the authenticated user in your database.
//   const { session_id } = req.body;
//   const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

//   // This is the url to which the customer will be redirected when they are done
//   // managing their billing with the portal.
//   const returnUrl = YOUR_DOMAIN;

//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: checkoutSession.customer,
//     return_url: returnUrl,
//   });

//   res.redirect(303, portalSession.url);
// };
