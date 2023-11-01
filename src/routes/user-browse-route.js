const express = require("express");
const router = express.Router();
const userBrowseController = require("../controllers/user-browse-controller");

router.get("/", userBrowseController.test);

module.exports = router;
