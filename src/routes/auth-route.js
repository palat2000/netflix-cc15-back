const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authenticateMiddleware, authController.getMe);
router.get("/profile", authenticateMiddleware, authController.chooseProfile);
module.exports = router;
