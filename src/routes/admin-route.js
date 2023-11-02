const express = require("express");
const userController = require("../controllers/user-controller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

router.post(
  "/movie",
  upload.single("image"),
  authenticateMiddleware,
  userController.editUserProfile
);

module.exports = router;
