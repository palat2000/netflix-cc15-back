const getMovieKids = require("../services/get-movie-kids");
const getMovie = require("../services/get-movie");
const prisma = require("../models/prisma");

exports.getMovie = async (req, res, next) => {
  try {
    const isTVShow = req.query.isTVShow;
    let movies;
    // if (req.profile.isKid) {
    // movies = await getMovieKids(6);
    // } else {
    //   if (isTVShow === undefined) {
    // movies = await getMovie(20);
    //   } else {
    const isTVShowBoolean = Boolean(+isTVShow);
    movies = await getMovie(14, isTVShowBoolean);
    //   }
    // }
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

    const likeHistory = await prisma.likeMovie.findFirst({
      where: {
        userProfileId: +req.userProfile.id,
        movieId: movieId,
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

    res.status(200).json({ movie: { ...movie, likeHistory }, moreLikeThis });
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
exports.editLike = async (req, res, next) => {
  try {
    const checkUserProfileLike = await prisma.likeMovie.findFirst({
      where: {
        userProfileId: +req.userProfile.id,
        movieId: +req.body.movieId,
      },
    });
    console.log(checkUserProfileLike, "checkUserProfileLike ");

    const countLike = await prisma.movie.findFirst({
      where: {
        id: +req.body.movieId,
      },
      select: {
        count_liked: true,
      },
    });
    console.log(countLike);

    let likeMovieHistory;
    let editLike;

    if (!checkUserProfileLike) {
      likeMovieHistory = await prisma.likeMovie.create({
        data: {
          userProfileId: +req.userProfile.id,
          movieId: +req.body.movieId,
        },
      });

      editLike = await prisma.movie.update({
        where: {
          id: +req.body.movieId,
        },
        data: {
          count_liked: countLike.count_liked + 1,
        },
      });
    } else {
      likeMovieHistory = await prisma.likeMovie.delete({
        where: {
          id: +checkUserProfileLike.id,
        },
      });
      editLike = await prisma.movie.update({
        where: {
          id: +req.body.movieId,
        },
        data: {
          count_liked: countLike.count_liked - 1,
        },
      });
      console.log("kaow ja");
    }

    res.status(201).json({ likeMovieHistory, editLike });
  } catch (error) {
    next(error);
  }
};

exports.startWatching = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    console.log(videoId, "videoId here");

    const findHistory = await prisma.history.findFirst({
      where: {
        videoId: +videoId,
        userProfileId: +req.userProfile.id,
      },
    });

    if (!findHistory) {
      const createHistory = await prisma.history.create({
        data: {
          userProfileId: +req.userProfile.id,
          videoId: +videoId,
        },
      });
      console.log("create jaa", createHistory.videoId, "eiei", videoId);
      await prisma.video.update({
        where: {
          id: +videoId,
        },
        data: {
          movie: {
            update: {
              count_watching: {
                increment: +1,
              },
            },
          },
        },
      });

      const sqlQuery = `
      SELECT mv.enumGenres, COUNT(*) AS genreCount
      FROM History hs
      JOIN Video vd ON hs.videoId = vd.id
      JOIN Movie mv ON vd.movieId = mv.id
      WHERE hs.userProfileId = ${+req.userProfile.id}
      GROUP BY mv.enumGenres
      ORDER BY genreCount DESC
      LIMIT 1;
    `;

      const result = await prisma.$queryRaw`
      SELECT mv.enumGenres, COUNT(*) AS genreCount
      FROM History hs
      JOIN Video vd ON hs.videoId = vd.id
      JOIN Movie mv ON vd.movieId = mv.id
      WHERE hs.userProfileId = ${+req.userProfile.id}
      GROUP BY mv.enumGenres
      ORDER BY genreCount DESC
      LIMIT 1;
    `;
      console.log("RESULT", result[0].genreCount);
      console.log("Category", result[0]);

      const editFavoriteGenres = await prisma.userProfile.update({
        where: {
          id: +req.userProfile.id,
        },
        data: {
          favoriteGenres: result[0].enumGenres,
        },
      });
      // const mostFavoriteGenres = await prisma.history.groupBy({
      //   where: {
      //     userProfileId: +req.userProfile.id,
      //   },
      //   select: {
      //     video: {
      //       select: {
      //         movie: true,
      //       },
      //     },
      //   },
      // });
      // console.log(mostFavoriteGenres);

      return res.status(200).json({ createHistory, editFavoriteGenres });
    }

    const recentWatching = await prisma.history.findFirst({
      where: {
        videoId: +videoId,
        userProfileId: +req.userProfile.id,
      },
      select: {
        recentWatching: true,
      },
    });
    console.log(recentWatching, " FOUND HISTORY");

    res.status(200).json({ recentWatching });
  } catch (error) {
    next(error);
  }
};

exports.endWatching = async (req, res, next) => {
  try {
    const { videoId, recentWatching } = req.body;
    console.log(videoId, "videoId here", recentWatching, "recent watching");

    const findHistory = await prisma.history.findFirst({
      where: {
        userProfileId: +req.userProfile.id,
        videoId: +videoId,
      },
      select: {
        id: true,
      },
    });

    const editRecentWatching = await prisma.history.update({
      where: {
        id: +findHistory.id,
      },
      data: {
        recentWatching: recentWatching,
        latestWatchingAt: new Date(),
      },
    });

    res.status(200).json({ editRecentWatching });
  } catch (error) {
    next(error);
  }
};
