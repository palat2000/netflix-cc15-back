const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const checkSubscriptionMiddleware = require("../middlewares/check-subscription");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authenticateMiddleware, authController.getMe);
router.post("/checkemail", authController.checkEmail);
module.exports = router;
