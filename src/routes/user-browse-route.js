const express = require("express");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const userBrowseController = require("../controllers/user-browse-controller");

router.get("/", authenticateMiddleware, userBrowseController.getMovie);

module.exports = router;
