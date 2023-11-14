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
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

exports.getTopMovie = async (req, res, next) => {
  try {
    const comedies = await prisma.movie.findFirst({
      where: {
        enumGenres: "COMEDIES",
      },
      select: {
        title: true,
        release_year: true,
        count_watching: true,
        count_liked: true,
        isTVShow: true,
        enumGenres: true,
      },
      orderBy: {
        count_watching: "desc",
      },
      take: 1,
    });
    console.log(comedies);

    const action = await prisma.movie.findFirst({
      where: {
        enumGenres: "ACTION",
      },
      select: {
        title: true,
        release_year: true,
        count_watching: true,
        count_liked: true,
        isTVShow: true,
        enumGenres: true,
      },
      orderBy: {
        count_watching: "desc",
      },
      take: 1,
    });
    console.log(action);

    const horror = await prisma.movie.findFirst({
      where: {
        enumGenres: "HORROR",
      },
      select: {
        title: true,
        release_year: true,
        count_watching: true,
        count_liked: true,
        isTVShow: true,
        enumGenres: true,
      },
      orderBy: {
        count_watching: "desc",
      },
      take: 1,
    });

    const sports = await prisma.movie.findFirst({
      where: {
        enumGenres: "SPORTS",
      },
      select: {
        title: true,
        release_year: true,
        count_watching: true,
        count_liked: true,
        isTVShow: true,
        enumGenres: true,
      },
      orderBy: {
        count_watching: "desc",
      },
      take: 1,
    });

    const kid = await prisma.movie.findFirst({
      where: {
        enumGenres: "KID",
      },
      select: {
        title: true,
        release_year: true,
        count_watching: true,
        count_liked: true,
        isTVShow: true,
        enumGenres: true,
      },
      orderBy: {
        count_watching: "desc",
      },
      take: 1,
    });

    const romance = await prisma.movie.findFirst({
      where: {
        enumGenres: "ROMANCE",
      },
      select: {
        title: true,
        release_year: true,
        count_watching: true,
        count_liked: true,
        isTVShow: true,
        enumGenres: true,
      },
      orderBy: {
        count_watching: "desc",
      },
      take: 1,
    });

    let genres = [comedies, action, horror, sports, kid, romance];

    res.status(200).json(genres);
  } catch (error) {
    console.log(error);
  }
};
