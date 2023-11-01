const express = require("express");
const userController = require("../controllers/user-controller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

router.post(
  "/allprofile",
  authenticateMiddleware,
  userController.getAllProfile
);
// router.get("/profile", authentiscateMiddleware, userController.getProfile);
router.post(
  "/profile",
  upload.single("profileImageUrl"),
  authenticateMiddleware,
  userController.createUserProfile
);
router.delete(
  "/profile",
  authenticateMiddleware,
  userController.deleteUserProfile
);

router.patch(
  "/profile",
  authenticateMiddleware,
  userController.editUserProfile
);

module.exports = router;
