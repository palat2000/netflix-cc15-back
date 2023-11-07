const prisma = require("../models/prisma");

exports.getMovie = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.getMovieById = async (req, res, next) => {
  const movieId = +req.params.movieId;
  try {
    const movie = await prisma.movie.findMany({
      where: {
        id: movieId,
      },
      select: {
        title: true,
        release_year: true,
        detail: true,
        isTVShow: true,
        image: true,
        enumGenres: true,
        trailer: true,
        actorMovie: {
          select: {
            actors: {
              select: {
                name: true,
              },
            },
          },
        },
        video: {},
      },
    });

    const enumGenres = await prisma.movie.findFirst({
      where: {
        id: movieId,
      },
      select: {
        enumGenres: true,
      },
    });
    console.log(enumGenres);
    const moreLikeThis = await prisma.movie.findMany({
      where: enumGenres,
    });

    res.status(200).json({ movie, moreLikeThis });
  } catch (err) {
    next(err);
  }
};
