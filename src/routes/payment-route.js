const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment-controller");

router.post("/create-checkout-session", paymentController.payment);
router.post("/success-subscription/:sessionId", paymentController.subscription);

module.exports = router;
