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

router.post(
  "/prepare-file", // authenticateMiddleware,
  upload.single("file"),
  adminController.prepareFile
);

// router.post("/", adminController.quickAdd);
router.get("/user", adminController.readUser);

// router.post(
//   "/get-movie",
//   adminController.get_movie
// )

module.exports = router;
