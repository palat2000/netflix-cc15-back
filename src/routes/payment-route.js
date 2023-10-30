const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment-controller");
const authenticateMiddleware = require("../middlewares/authenticate");

router.post("/create-checkout-session", paymentController.payment);
router.post(
  "/success-subscription/:sessionId",
  authenticateMiddleware,
  paymentController.subscription
);

module.exports = router;
