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

exports.editMyList = async (req, res, next) => {
  try {
    const findMyList = await prisma.myList.findFirst({
      where: {
        movieId: +req.body.movieId,
        userProfileId: +req.userProfile.id,
      },
    });

    let myList = null;

    if (findMyList) {
      myList = await prisma.myList.delete({
        where: {
          id: +findMyList.id,
        },
      });
    } else {
      myList = await prisma.myList.create({
        data: {
          movieId: +req.body.movieId,
          userProfileId: +req.userProfile.id,
        },
      });
    }

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

exports.addLike = async (req, res, next) => {
  try {
    const countLike = await prisma.movie.findFirst({
      where: {
        id: +req.body.movieId,
      },
      select: {
        count_liked: true,
      },
    });
    console.log(countLike);

    const like = await prisma.movie.update({
      where: {
        id: +req.body.movieId,
      },
      data: {
        count_liked: countLike.count_liked + 1,
      },
    });

    res.status(201).json({ like });
  } catch (error) {
    next(error);
  }
};

exports.unLike = async (req, res, next) => {
  try {
    const countLike = await prisma.movie.findFirst({
      where: {
        id: +req.body.movieId,
      },
      select: {
        count_liked: true,
      },
    });
    console.log(countLike);

    const like = await prisma.movie.update({
      where: {
        id: +req.body.movieId,
      },
      data: {
        count_liked: countLike.count_liked - 1,
      },
    });

    res.status(201).json({ like });
  } catch (error) {
    next(error);
  }
};
