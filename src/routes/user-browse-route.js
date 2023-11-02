const express = require("express");
const router = express.Router();
const profileAuthenticate = require("../middlewares/profile-authenticate");
const userBrowseController = require("../controllers/user-browse-controller");

router.get("/", profileAuthenticate, userBrowseController.getMovie);

module.exports = router;
