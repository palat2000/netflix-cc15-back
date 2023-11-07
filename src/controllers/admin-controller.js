const XLSX = require("xlsx");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary-service");
const fs = require("fs/promises");

exports.createMovie = async (req, res, next) => {
  console.log("req.body", req.body);
  try {
    const { title, release_year, detail, isTVShow, enumGenres, actorName } =
      req.body;

    const titleMovieDup = await prisma.movie.findFirst({
      where: {
        title: title,
      },
    });

    if (titleMovieDup) {
      return next(createError("Already add this movie name", 400));
    }
    console.log(titleMovieDup);
    console.log("sard");
    console.log(req.files["image"][0].path, "meow");
    console.log(req.files["trailer"][0].path, "meow");

    let imageUrl;
    let trailerUrl;

    let body = {};

    if (req?.files["image"]) {
      imageUrl = await upload(req.files["image"][0].path);
      console.log(imageUrl);
      body.image = imageUrl;
    }
    if (req?.files["trailer"]) {
      trailerUrl = await upload(req.files["trailer"][0].path);
      console.log(trailerUrl);
      body.trailer = trailerUrl;
    }
    body = {
      ...body,
      title: title,
      release_year: release_year,
      detail: detail,
      isTVShow: !!isTVShow,
      enumGenres: enumGenres,
    };

    const createMovie = await prisma.movie.create({
      data: body,
    });

    actorName.forEach(async (el) => {
      const actors = await prisma.actors.createMany({
        data: {
          movieId: createMovie.id,
          name: el,
        },
      });
    });

    const movie = await prisma.movie.findMany({
      where: {
        id: createMovie.id,
      },
      include: {
        actors: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(201).json({ movie });
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    if (req.files["image"][0].path) {
      fs.unlink(req.files["image"][0].path);
    }
    if (req.files["trailer"][0].path) {
      fs.unlink(req.files["trailer"][0].path);
    }
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.body;
  } catch (error) {
    next(error);
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    const file = XLSX.readFile(req.file.path);
    const sheetNames = file.SheetNames;
    const worksheet = file.Sheets[sheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    const moviesMap = new Map();
    const movieObj = {};
    data.forEach((row) => {
      const title = row.title;
      const existingMovie = moviesMap.get(title);
      if (existingMovie) {
        existingMovie.video.push({
          videoEpisodeName: row.videoEpisodeName,
          videoEpisodeNo: row.videoEpisodeNo,
          video: row.video,
        });
      } else {
        const actorName = row.actorName.split(",").map((name) => name.trim());
        const movie = {
          title: title,
          isTVShow: row.isTVShow === "true",
          image: row.image || null,
          release_year: row.release_year || null,
          genres: row.genres || null,
          trailer: row.trailer || null,
          detail: row.detail,
          actorName,
          video: [
            {
              videoEpisodeName: row.videoEpisodeName,
              videoEpisodeNo: row.videoEpisodeNo,
              video: row.video,
            },
          ],
        };
        moviesMap.set(title, movie);
      }
    });
    const formattedData = [...moviesMap.values()];
    res.json({ formattedData });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};
