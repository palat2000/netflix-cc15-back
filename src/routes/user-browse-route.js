const express = require("express");
const router = express.Router();
const userBrowseController = require("../controllers/user-browse-controller");
const authenticateProfileMiddleware = require("../middlewares/authenticateProfile");
const authenticateMiddleware = require("../middlewares/authenticate");

router.get(
  "/movie/:movieId",
  authenticateMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.getMovieById
);
router.get(
  "/",
  authenticateMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.getMovie
);

router.post(
  "/mylist",
  authenticateMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.editMyList
);

router.get(
  "/mylist",
  authenticateMiddleware,
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
  authenticateMiddleware,
  authenticateProfileMiddleware,
  userBrowseController.editLike
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
