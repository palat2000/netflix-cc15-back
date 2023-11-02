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
