const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");

router.get("/", authController.test);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authenticateMiddleware, authController.getMe);

module.exports = router;
