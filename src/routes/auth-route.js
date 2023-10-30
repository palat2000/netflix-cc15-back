const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");

router.get("/", authController.test);
router.post("/login",authController.user)
router.post("/register",authController.register)
module.exports = router;
