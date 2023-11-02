const express = require("express");
const adminController = require("../controllers/admin-cotroller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

router.post(
  "/",
  upload.single("image"),
  authenticateMiddleware,
  adminController.createMovie
);

module.exports = router;
