const express = require("express");
const router = express.Router();
const userBrowseController = require("../controllers/user-browse-controller");
const authenticateProfileMiddleware = require("../middlewares/authenticateProfile");
const authenticateMiddleware = require("../middlewares/authenticate");
const checkSubscriptionMiddleware = require("../middlewares/check-subscription");

router.get(
  "/movie/:movieId",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.getMovieById
);
router.get(
  "/",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.getMovie
);

router.post(
  "/mylist",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.editMyList
);

router.get(
  "/mylist",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.getMyList
);

router.get(
  "/search/",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.searchBar
);
router.patch(
  "/Like",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.editLike
);

router.get(
  "/startWatching/:videoId",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.startWatching
);
router.post(
  "/endWatching",
  authenticateMiddleware,
  checkSubscriptionMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.endWatching
);

module.exports = router;
