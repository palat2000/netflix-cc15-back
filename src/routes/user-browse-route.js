const express = require("express");
const router = express.Router();
const profileAuthenticate = require("../middlewares/profile-authenticate");
const userBrowseController = require("../controllers/user-browse-controller");
const checkSubscriptionStatusMiddleware = require("../middlewares/check-subscription-status");

router.get(
  "/movie/:movieId",
  authenticateMiddleware,
  userBrowseController.getMovieById
);
router.get(
  "/",
  checkSubscriptionStatusMiddleware,
  profileAuthenticate,
  userBrowseController.getMovie
);

module.exports = router;
