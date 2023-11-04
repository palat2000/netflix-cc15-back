const express = require("express");
const router = express.Router();
const profileAuthenticate = require("../middlewares/profile-authenticate");
const userBrowseController = require("../controllers/user-browse-controller");
<<<<<<< HEAD
const checkSubscriptionStatusMiddleware = require("../middlewares/check-subscription-status");
=======
const authenticateProfileMiddleware = require("../middlewares/authenticateProfile");
>>>>>>> develop

router.get(
  "/movie/:movieId",
  authenticateMiddleware,
  userBrowseController.getMovieById
);
<<<<<<< HEAD
router.get(
  "/",
  checkSubscriptionStatusMiddleware,
  profileAuthenticate,
  userBrowseController.getMovie
=======

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

router.patch(
  "/Like",
  authenticateProfileMiddleware,
  userBrowseController.addLike
);

router.patch(
  "/unlike",
  authenticateProfileMiddleware,
  userBrowseController.unLike
>>>>>>> develop
);

module.exports = router;
