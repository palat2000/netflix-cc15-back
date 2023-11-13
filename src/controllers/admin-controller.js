const XLSX = require("xlsx");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary-service");
const fs = require("fs/promises");
// const {
//   registerSchema,
//   loginSchema,
// } = require("../validators/admin-validator");

exports.login = async (req, res, next) => {
  // try {
  //   const { value, error } = loginSchema.validate;
  // } catch (error) {
  //   next(error);
  // }
};

exports.createMovie = async (req, res, next) => {
  try {
    const actorNameArray = req.body.actorName.split(',')
    const titleMovieDup = await prisma.movie.findFirst({
      where: {
        title: req.body.title,
      },
    });

    if (titleMovieDup) {
      return next(createError("Already add this movie name", 400));
    }

    const Genres = req.body.genres.toUpperCase()
    
    const movie = await prisma.movie.create({
      data: {
        title: req.body.title.toLowerCase(),
        release_year: req.body.release_year,
        detail: req.body.detail.toLowerCase(),
        isTVShow: !!req.body.isTVShow,
        image: req.body.image,
        enumGenres: Genres,
        trailer: req.body.trailer

      }
    })



    actorNameArray.forEach(async (e) => {
      const checkActors = await prisma.actors.findFirst({
        where: {
          name: e.toLowerCase()
        }
      })

      if (!checkActors) {
        const actorIdcheck = await prisma.actors.create({
          data: { name: e.toLowerCase() }
        })
        if (actorIdcheck) {
          await prisma.actorMovie.create({
            data: {
              actorsId: actorIdcheck.id,
              movieId: movie.id
            }
          })
        }

      }
      if (checkActors) {
        await prisma.actorMovie.create({
          data: {
            actorsId: checkActors.id,
            movieId: movie.id
          }
        })
      }
    })


    const episodeDup = await prisma.video.findFirst({
      where: {
        videoEpisodeName: req.body.videoEpisodeName.toLowerCase(),
        videoUrl: req.body.video,
        videoEpisodeNo: +req.body.videoEpisodeNo
      },
    });

    if (episodeDup) {
      return next(createError("Already add this Episode", 400));
    }

    await prisma.video.create({
      data: {
        videoEpisodeName: req.body.videoEpisodeName.toLowerCase(),
        videoUrl: req.body.video,
        videoEpisodeNo: +req.body.videoEpisodeNo,
        movieId: movie.id
      }
    })






    res.status(201).json({mressage:"Success"});
  } catch (error) {
    console.log(error);
    next(error);
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
    const formattedData = readXLSXFile(data);
    const movies = await insertMovie(formattedData);
    res.json({ movies });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.prepareFile = async (req, res, next) => {
  try {
    const file = XLSX.readFile(req.file.path);
    const sheetNames = file.SheetNames;
    const worksheet = file.Sheets[sheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    const formattedData = readXLSXFile(data);
    res.status(200).json({ formattedData });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};


exports.readUser = async (req, res, next) => {
  try {
    
    const users = await prisma.user.findMany()
    res.status(200).json( users)
  } catch (error) {
    console.log(error)
  }
}
