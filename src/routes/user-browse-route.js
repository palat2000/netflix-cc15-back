const express = require("express");
const router = express.Router();
const profileAuthenticate = require("../middlewares/profile-authenticate");
const userBrowseController = require("../controllers/user-browse-controller");

router.get("/", authenticateMiddleware, userBrowseController.getMovie);
router.get(
  "/movie/:movieId",
  authenticateMiddleware,
  userBrowseController.getMovieById
);
module.exports = router;
