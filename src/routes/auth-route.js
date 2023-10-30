const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");

router.post("/login", authController.user);
router.post("/register", authController.register);
module.exports = router;
