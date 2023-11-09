const express = require("express");
const adminController = require("../controllers/admin-controller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

router.post("/login", authenticateMiddleware);

<<<<<<< HEAD
router.post(
  "/",
  // authenticateMiddleware,
  upload.single("file"),
  adminController.addMovie
);
=======
// router.post("/", adminController.quickAdd);
router.get("/user", adminController.readUser);
>>>>>>> develop

router.post(
  "/prepare-file", // authenticateMiddleware,
  upload.single("file"),
  adminController.prepareFile
);

module.exports = router;
