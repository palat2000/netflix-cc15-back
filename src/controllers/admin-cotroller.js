const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary-service");
const fs = require("fs/promises");

exports.createMovie = async (req, res, next) => {
  console.log("req.body", req.body);
  try {
    const {
      title,
      release_year,
      count_watching,
      count_liked,
      detail,
      isTVShow,
      enumGenres,
      trailer,
    } = req.body;

    const titleMovieDup = await prisma.movie.findFirst({
      where: {
        title: title,
      },
    });

    if (titleMovieDup) {
      return next(createError("Already add this movie name", 400));
    }
    console.log(titleMovieDup);

    if (req?.file?.path) {
      const imageUrl = await upload(req.file.path);
      console.log(imageUrl);
      body.profileImageUrl = imageUrl;
    }

    const body = {
      title: title,
      release_year: release_year,
      detail: detail,
      isTVShow: isTVShow,
      image: imageUrl,
      enumGenres: enumGenres,
      trailer: trailer,
    };
  } catch (error) {
    next(error);
  } finally {
    console.log("req", req);
    if (req?.file?.path) {
      fs.unlink(req?.file?.path);
    }
  }
};
