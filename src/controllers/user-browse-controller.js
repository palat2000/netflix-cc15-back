const prisma = require("../models/prisma");
const getMovieKids = require("../services/get-movie-kids");
const getMovie = require("../services/get-movie");

exports.getMovie = async (req, res, next) => {
  try {
    let movies;
    if (req.profile.isKid) {
      movies = await getMovieKids();
    } else {
      movies = await getMovie(req.profile.id, req.profile.enumGenres);
    }
    res.status(200).json({ movies });
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
        actors: {
          select: {
            name: true,
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
