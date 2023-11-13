const express = require("express");
const adminController = require("../controllers/admin-controller");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

// router.post(
//   "/",
//   authenticateMiddleware,
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "trailer", maxCount: 1 },
//   ]),
//   adminController.createMovie
// );

// router.post("/", adminController.quickAdd);
router.get("/user", adminController.readUser);
router.get("/read-movieList", adminController.readMovieList);
// router.post("/delete-movieList", adminController.deleteMovieList);
router.patch("/edit-movieList",upload.single("movieListImage"), adminController.editMovieList);
// router.post(
//   "/",
//   authenticateMiddleware,
//   upload.array("file"),
//   adminController.createMovie
// );

router.post("/", authenticateMiddleware);

module.exports = router;
