const express = require("express");
const userController = require("../controllers/user-controller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");
const checkSubscriptionMiddleware = require("../middlewares/check-subscription");
const authenticateProfileMiddleware = require("../middlewares/authenticateProfile");

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

router.post(
  "/choose-profile",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  userController.chooseProfile
);

router.get(
  "/allUserProfile",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  userController.getAllUserProfile
);

router.get(
  "/me",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  authenticateProfileMiddleware,
  userController.getMeProfile
);

module.exports = router;
