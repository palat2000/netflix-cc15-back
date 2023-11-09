const express = require("express");
const router = express.Router();
const profileAuthenticate = require("../middlewares/profile-authenticate");
const userBrowseController = require("../controllers/user-browse-controller");
const checkSubscriptionStatusMiddleware = require("../middlewares/check-subscription-status");
const authenticateProfileMiddleware = require("../middlewares/authenticateProfile");
const authenticateMiddleware = require("../middlewares/authenticate");

router.get(
  "/movie/:movieId",
  profileAuthenticate,
  userBrowseController.getMovieById
);
router.get(
  "/",
  checkSubscriptionStatusMiddleware,
  profileAuthenticate,
  userBrowseController.getMovie
);

router.post(
  "/mylist",
  authenticateProfileMiddleware,
  userBrowseController.editMyList
);

router.get(
  "/mylist",
  authenticateProfileMiddleware,
  userBrowseController.getMyList
);

router.get(
  "/search/",
  authenticateMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.searchBar
);
router.patch(
  "/Like",
  authenticateProfileMiddleware,
  userBrowseController.addLike
);

router.patch(
  "/unlike",
  authenticateProfileMiddleware,
  userBrowseController.unLike
);

router.get(
  "/startWatching/:videoId",
  authenticateMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.startWatching
);
router.post(
  "/endWatching",
  authenticateMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.endWatching
);

module.exports = router;
