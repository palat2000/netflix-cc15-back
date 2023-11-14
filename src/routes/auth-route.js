const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const authenticateAdminMiddlewear = require("../middlewares/authenticateAdmin");
const checkSubscriptionMiddleware = require("../middlewares/check-subscription");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authenticateAdminMiddlewear, authController.getMe);
router.post(
  "/profile",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  authController.chooseProfile
);
router.post("/checkemail", authController.checkEmail);
module.exports = router;
