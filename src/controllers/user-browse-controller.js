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
      where: {
        AND: [{ NOT: { id: +movieId } }, { enumGenres: enumGenres.enumGenres }],
      },
    });

    res.status(200).json({ movie, moreLikeThis });
  } catch (err) {
    next(err);
  }
};

exports.addToMyList = async (req, res, next) => {
  try {
    const myList = await prisma.myList.create({
      data: {
        movieId: +req.params.movieId,
        userProfileId: +req.userProfile.id,
      },
    });
    res.status(201).json({ myList });
  } catch (error) {
    next(error);
  }
};

exports.getMyList = async (req, res, next) => {
  try {
    const myList = await prisma.myList.findMany({
      where: {
        userProfileId: +req.userProfile.id,
      },
      select: {
        movieId: true,
        movie: true,
      },
    });
    res.status(200).json({ myList });
  } catch (error) {
    next(error);
  }
};

exports.deleteMyList = async (req, res, next) => {
  try {
    console.log(req.body, "here--------");
    const findListId = await prisma.myList.findFirst({
      where: {
        movieId: +req.body.movieId,
        userProfileId: +req.userProfile.id,
      },
    });
    console.log(findListId);
    const deleteMovieinMyList = await prisma.myList.delete({
      where: {
        id: +findListId.id,
      },
    });

    res.status(200).json({ deleteMovieinMyList });
  } catch (error) {
    next(error);
  }
};
