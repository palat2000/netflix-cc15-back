const stripe = require("stripe")(process.env.STRIPE_API_TEST_KEY);
const cron = require("node-cron");
const { URL } = require("../config/constant");
const prisma = require("../model/prisma");

exports.payment = async (req, res, next) => {
  try {
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ["data.product"],
    });
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${URL}/browse?success=true&session_id={CHECKOUT_SESSION_ID}`,
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
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );
    await prisma.user.update({
      data: {
        customerID: subscription.customer,
        subscriptionId: subscription.id,
        isActive: true,
      },
      where: {
        id: req.user.id,
      },
    });
    res.status(200).json({ message: "OK" });
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