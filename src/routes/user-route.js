const express = require("express");
const userController = require("../controllers/user-controller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");

router.get("/allprofile", authenticateMiddleware, userController.getAllProfile);
router.get("/profile", authenticateMiddleware, userController.getProfile);
router.post(
  "/profile",
  authenticateMiddleware,
  userController.createUserProfile
);

module.exports = router;
