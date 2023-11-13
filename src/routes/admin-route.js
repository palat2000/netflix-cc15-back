const express = require("express");
const adminController = require("../controllers/admin-controller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const authenticateAdminMiddleware = require("../middlewares/authenticateAdmin");
const upload = require("../middlewares/upload");

router.post("/login", adminController.login);
router.post("/reqister", adminController.register);

router.get("/me", authenticateAdminMiddleware, adminController.getMe);

router.post(
  "/",
  // authenticateMiddleware,
  upload.single("file"),
  adminController.addMovie
);

// router.post("/", adminController.quickAdd);
router.get("/user", adminController.readUser);

router.post(
  "/prepare-file", // authenticateMiddleware,
  upload.single("file"),
  adminController.prepareFile
);

module.exports = router;
