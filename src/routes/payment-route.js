const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const checkSubscriptionMiddleware = require("../middlewares/check-subscription-status");

router.post("/create-checkout-session", paymentController.payment);
router.post(
  "/success-subscription/:sessionId",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  paymentController.subscription
);

module.exports = router;
