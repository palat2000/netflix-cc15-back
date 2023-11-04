const express = require("express");
const adminController = require("../controllers/admin-cotroller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

router.post(
  "/",
  authenticateMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "trailer", maxCount: 1 },
  ]),
  adminController.createMovie
);

module.exports = router;
