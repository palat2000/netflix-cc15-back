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

exports.quickAdd = async (req, res, next) => {
  try {
    const {
      title,
      release_year,
      detail,
      isTVShow,
      enumGenres,
      actorName,
      image,
      trailer,
    } = req.body;
    const body = {
      title,
      release_year,
      detail,
      isTVShow: !!isTVShow,
      enumGenres,
      image,
      trailer,
    };
    const createMovie = await prisma.movie.create({
      data: body,
    });
    actorName.forEach(async (el) => {
      await prisma.actors.createMany({
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
    res.status(200).json({ movie });
  } catch (err) {
    next(err);
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
exports.readMovieList = async (req, res, next) => {
  try {

    console.log("first")
    
    const movie = await prisma.movie.findMany()
    res.status(200).json( movie)
  } catch (error) {
    console.log(error)
  }
}
exports.deleteMovieList = async (req, res, next) => {
  try {
console.log("delllllllllllllllllllllllllllllllllll",req.body.id)

    const deleteMovieList = await prisma.movie.delete({
        where: {
            id: req.body.id
        }
    })
    res.status(200).json( deleteMovieList)
  } catch (error) {
    console.log(error)
  }
}


exports.editMovieList = async (req, res, next) => {
  try {

    console.log("req.body naja ",req.body)
    console.log("filllllleeeee",req.file)

let imageUrl
    if (req?.file?.path) {
         imageUrl = await upload(req.file.path);
      }
    const editMovie = await prisma.movie.update({

        where: {
            id:+req.body.editTargetId
        },
        data: {
            title: req.body.title,
         release_year: req.body.year   ,
         count_watching: +req.body.countWatch,
         count_liked: +req.body.countLike,
         detail: req.body.detail,
         isTVShow: !!req.body.tvShow,
         enumGenres: req.body.enumGen,
         image:imageUrl
        }
    })

    res.status(200).json( editMovie )
    console.log("resultttttttttttttttttttttttttttttt" ,editMovie )
  } catch (error) {
    console.log(error)
  }finally {
    // console.log("req", req);
    if (req?.file?.path) {
      fs.unlink(req?.file?.path);
    }
  }
}