const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment-controller");
const authenticateMiddleware = require("../middlewares/authenticate");

router.post(
  "/create-checkout-session",
  authenticateMiddleware,
  paymentController.payment
);
router.post(
  "/success-subscription/:sessionId",
  authenticateMiddleware,
  paymentController.subscription
);
router.patch(
  "/cancel-subscription",
  authenticateMiddleware,
  paymentController.cancelSubscription
);
router.patch(
  "/resume-subscription",
  authenticateMiddleware,
  paymentController.resumeSubscription
);
router.post(
  "/create-subscription",
  authenticateMiddleware,
  paymentController.restartSubscription
);

module.exports = router;
