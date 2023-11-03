const express = require("express");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const userBrowseController = require("../controllers/user-browse-controller");
const authenticateProfileMiddleware = require("../middlewares/authenticateProfile");

router.get("/", authenticateMiddleware, userBrowseController.getMovie);
router.get(
  "/movie/:movieId",
  authenticateMiddleware,
  userBrowseController.getMovieById
);

router.post(
  "/mylist",
  authenticateProfileMiddleware,
  userBrowseController.addToMyList
);

router.get(
  "/mylist",
  authenticateProfileMiddleware,
  userBrowseController.getMyList
);

router.delete(
  "/mylist",
  authenticateProfileMiddleware,
  userBrowseController.deleteMyList
);
module.exports = router;
