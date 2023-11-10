const express = require("express");
const userController = require("../controllers/user-controller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");
const checkSubscriptionMiddleware = require("../middlewares/check-subscription");

router.post(
  "/profile",
  upload.single("profileImageUrl"),
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  userController.createUserProfile
);
router.delete(
  "/profile/:profileId",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  userController.deleteUserProfile
);

router.patch(
  "/profile",
  upload.single("profileImageUrl"),
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  userController.editUserProfile
);

module.exports = router;
