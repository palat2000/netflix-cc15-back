const express = require("express");
const adminController = require("../controllers/admin-controller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

router.post(
  "/",
  // authenticateMiddleware,
  upload.single("file"),
  adminController.addMovie
);

module.exports = router;
