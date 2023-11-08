const express = require("express");
const userController = require("../controllers/user-controller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const authenticateProfileMiddleware = require("../middlewares/authenticateProfile");
const upload = require("../middlewares/upload");

router.post(
  "/profile",
  upload.single("profileImageUrl"),
  authenticateMiddleware,
  userController.createUserProfile
);
router.delete(
  "/profile/:profileId",
  authenticateMiddleware,
  userController.deleteUserProfile
);

router.patch(
  "/profile",
  upload.single("profileImageUrl"),
  authenticateMiddleware,
  userController.editUserProfile
);

module.exports = router;
