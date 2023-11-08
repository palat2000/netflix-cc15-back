const getMovieKids = require("../services/get-movie-kids");
const getMovie = require("../services/get-movie");
const prisma = require("../models/prisma");

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

    let likeAndUnLikeList = null;
    let myList = null;

    if (findMyList) {
      likeAndUnLikeList = await prisma.myList.delete({
        where: {
          id: +findMyList.id,
        },
      });
    } else {
      likeAndUnLikeList = await prisma.myList.create({
        data: {
          movieId: +req.body.movieId,
          userProfileId: +req.userProfile.id,
        },
      });

      myList = await prisma.myList.findMany({
        where: {
          userProfileId: +req.userProfile.id,
        },
        select: {
          movieId: true,
          movie: true,
        },
      });
    }

    res.status(201).json({ likeAndUnLikeList, myList });
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

exports.searchBar = async (req, res, next) => {
  try {
    const searchTerm = req.query.q;
    const genre = req.query.genre;
    const isTVShow = req.query.isTVShow;

    console.log(genre);
    console.log(searchTerm);
    console.log(isTVShow, "isTV na ja");

    if (searchTerm) {
      const searchMovieBytitle = await prisma.movie.findMany({
        where: {
          title: {
            contains: searchTerm,
          },
        },
      });

      const genres = [
        "COMEDIES",
        "ACTION",
        "HORROR",
        "SPORTS",
        "KID",
        "ROMANCE",
      ];

      const filterArrayGenres = genres.filter((element) => {
        return element.toLocaleLowerCase().includes(searchTerm);
      });

      console.log(filterArrayGenres, "here");
      let searchMovieByGenres = null;

      if (filterArrayGenres.length > 0) {
        searchMovieByGenres = await prisma.movie.findMany({
          where: {
            enumGenres: filterArrayGenres[0],
          },
        });
      }

      const searchByActorName = await prisma.actors.findMany({
        where: {
          name: {
            contains: searchTerm,
          },
        },
        select: {
          actorMovie: { select: { movie: true } },
        },
      });
      return res
        .status(200)
        .json({ searchMovieBytitle, searchMovieByGenres, searchByActorName });
    }

    if (isTVShow === "true") {
      console.log("true here");
      // console.log(isTVShow, "isTVshow");
      if (genre) {
        const genres = [
          "COMEDIES",
          "ACTION",
          "HORROR",
          "SPORTS",
          "KID",
          "ROMANCE",
        ];

        const filterArrayGenres = genres.filter((element) => {
          return element.toLocaleLowerCase().includes(genre);
        });

        console.log(filterArrayGenres, "here");
        let searchMovieByGenres = null;

        if (filterArrayGenres.length > 0) {
          searchMovieByGenres = await prisma.movie.findMany({
            where: {
              enumGenres: filterArrayGenres[0],
              isTVShow: true,
            },
          });
        }
        res.status(200).json({ searchMovieByGenres });
      }
    } else {
      console.log("false here");
      if (genre) {
        const genres = [
          "COMEDIES",
          "ACTION",
          "HORROR",
          "SPORTS",
          "KID",
          "ROMANCE",
        ];

        const filterArrayGenres = genres.filter((element) => {
          return element.toLocaleLowerCase().includes(genre);
        });

        console.log(filterArrayGenres, "here");
        let searchMovieByGenres = null;

        if (filterArrayGenres.length > 0) {
          searchMovieByGenres = await prisma.movie.findMany({
            where: {
              enumGenres: filterArrayGenres[0],
              isTVShow: false,
            },
          });
        }
        res.status(200).json({ searchMovieByGenres });
      }
    }
  } catch (err) {
    next(err);
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
