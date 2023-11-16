const express = require("express");
const adminController = require("../controllers/admin-controller");
const router = express.Router();
const authenticateAdminMiddleware = require("../middlewares/authenticateAdmin");
const upload = require("../middlewares/upload");

router.post("/login", adminController.login);
router.post("/register", adminController.register);
router.get("/me", authenticateAdminMiddleware, adminController.getMe);
router.get("/read-movieList", adminController.readMovieList);
router.post("/delete-movieList", adminController.deleteMovieList);
router.patch(
  "/edit-movieList",
  upload.single("movieListImage"),
  adminController.editMovieList
);
router.get(
  "/user",
  // authenticateAdminMiddleware,
  adminController.readUser
);
router.post("/upload",  upload.single("file"),adminController.createMovie);
router.get("/user_movie", adminController.getNewestUserAndTopMovie);
router.post(
  "/prepare-file",
  upload.single("file"),
  adminController.prepareFile
);

module.exports = router;
