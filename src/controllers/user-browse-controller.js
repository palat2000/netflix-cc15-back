const getMovieKids = require("../services/get-movie-kids");
const getMovie = require("../services/get-movie");
const prisma = require("../models/prisma");

exports.getMovie = async (req, res, next) => {
  try {
    console.log('asasaas', req.userProfile.id)
    const isTVShow = req.query.isTVShow;
    console.log(
      "🚀 ~ file: user-browse-controller.js:8 ~ exports.getMovie= ~ isTVShow:",
      isTVShow
    );
    let movies;
    if (req.userProfile.isKid) {
      movies = await getMovieKids(req.userProfile.id);
    } else {
      if (isTVShow === undefined) {
        movies = await getMovie(req.userProfile.id);
      } else {
        const isTVShowBoolean = Boolean(+isTVShow);
        movies = await getMovie(req.userProfile.id, isTVShowBoolean);
      }
    }
    res.status(200).json({ movies });
  } catch (err) {
    next(err);
  }
};

exports.getMovieById = async (req, res, next) => {
  const movieId = +req.params.movieId;
  console.log("req.userProfile.id", req.userProfile.id)
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
        video: true,
      },
    });

    const likeHistory = await prisma.likeMovie.findFirst({
      where: {
        userProfileId: +req.userProfile.id,
        movieId: movieId,
      },
    });

    const inMyListHistory = await prisma.myList.findFirst({
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
      include: {
        myList: {
          where: {
            userProfileId: +req.userProfile.id,
          },
        },
      },
    });

    const moreLikeThisData = moreLikeThis.map((el) => {
      if (el.myList.length === 0) el.myList = null;
      return el;
    });

    const recentWatchingHistory = await prisma.history.findMany({
      where: {
        userProfileId: req.userProfile.id
      },
      include: {
        video: {
          select: {
            movieId: true,
            videoEpisodeNo: true
          }
        }
      },
      orderBy: [
        {
          video: {
            videoEpisodeNo: "desc"
          },
        },
        { latestWatchingAt: "desc" }
      ]
    })

    const historyWatchingEpisode = recentWatchingHistory.filter(el => el.video.movieId === movieId)

    const firstEpisode = movie[0]?.video?.filter(el => el.videoEpisodeNo === 1)[0]
    const recentWatchingEpisode = { videoId: historyWatchingEpisode[0]?.videoId || firstEpisode?.id }

    const resData = {
      movie: { ...movie, likeHistory, inMyListHistory, recentWatchingEpisode },
      moreLikeThisData,
    }

    res.status(200).json(resData);
  } catch (err) {
    next(err);
  }
};

exports.editMyList = async (req, res, next) => {
  try {
    console.log(req.body);

    const findMyList = await prisma.myList.findFirst({
      where: {
        movieId: +req.body.movieId,
        userProfileId: +req.userProfile.id,
      },
    });
    console.log(
      "🚀 ~ file: user-browse-controller.js:76 ~ exports.editMyList= ~ findMyList:",
      findMyList
    );

    let likeAndUnLikeList = null;
    let myList = null;
    let status = null;

    if (findMyList) {
      likeAndUnLikeList = await prisma.myList.delete({
        where: {
          id: +findMyList.id,
        },
      });
      console.log(
        "🚀 ~ file: user-browse-controller.js:87 ~ exports.editMyList= ~ likeAndUnLikeList:",
        likeAndUnLikeList
      );
      status = `remove movieId:${+req.body.movieId} from MyList`;
    } else {
      likeAndUnLikeList = await prisma.myList.create({
        data: {
          movieId: +req.body.movieId,
          userProfileId: +req.userProfile.id,
        },
      });
      status = `add movieId:${+req.body.movieId} to MyList`;
    }

    movieAddtoList = await prisma.myList.findFirst({
      where: {
        id: likeAndUnLikeList.id,
      },
    });
    console.log("movieAddtoList", movieAddtoList);
    res.status(201).json({ movieAddtoList, status });
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

exports.getMyListById = async (req, res, next) => {
  try {
    console.log(req.params.movieId);
    const isInMyList = await prisma.myList.findFirst({
      where: {
        userProfileId: +req.userProfile.id,
        movieId: +req.params.movieId,
      },
      select: {
        movieId: true,
        movie: true,
      },
    });
    res.status(200).json({ isInMyList });
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
    let status;
    let likeData;

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

      likeData = likeMovieHistory;
      status = `MovieId:${+req.body.movieId} is liked by userId:${+req
        .userProfile.id}`;
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
      likeData = null;
      status = `MovieId:${+req.body.movieId} is remove like by userId:${+req
        .userProfile.id}`;
    }
    console.log(likeData, status);
    res.status(201).json({ likeMovieHistory, editLike, likeData, status });
  } catch (error) {
    next(error);
  }
};

exports.getLike = async (req, res, next) => {
  try {
    console.log("first")
    console.log('qqqqqqq', req.userProfile.id)
    const movieId = +req.params.movieId;
    const likeHistory = await prisma.likeMovie.findFirst({
      where: {
        userProfileId: +req.userProfile.id,
        movieId: movieId,
      },
    });
    res.status(200).json({ likeHistory });
  } catch (err) {
    next(err);
  }
}


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
        recentWatching: String(recentWatching),
        latestWatchingAt: new Date(),
      },
    });

    res.status(200).json({ editRecentWatching });
  } catch (error) {
    next(error);
  }
};

exports.getVideoById = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const videoData = await prisma.video.findFirst({
      where: {
        id: +videoId,
      },
      include: {
        history: {
          where: {
            userProfileId: +req.userProfile.id,
          },
        },
        movie: true
      },
    });
    console.log("🚀 ~ file: user-browse-controller.js:586 ~ exports.getVideoById= ~ videoData:", videoData)

    const otherVideoOfMovie = await prisma.video.findMany({
      where: {
        // movieId: videoData.movieId
        AND: [{ movieId: videoData.movieId }, { NOT: { id: +videoId } }],
      },
      include: {
        history: {
          where: {
            userProfileId: +req.userProfile.id,
          },
        },
      },
    });

    res.status(200).json({ videoData, otherVideoOfMovie });
  } catch (error) {
    next(error);
  }
};

exports.getNontification = async (req, res, next) => {
  try {
    const currentDatetime = new Date();
    console.log(
      "🚀 ~ file: user-browse-controller.js:547 ~ exports.getNontification= ~ currentDatetime:",
      currentDatetime
    );
    console.log(
      "🚀 ~ file: user-browse-controller.js:547 ~ exports.getNontification= ~ currentDatetime:",
      currentDatetime.toLocaleDateString()
    );
    const expireDateTime = req.user.expiredDate;
    const timeDifference = expireDateTime - currentDatetime;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    let expireAlert = { subscriptExpireIn7Days: null };
    if (daysDifference < 7) {
      expireAlert.subscriptExpireIn7Days = expireDateTime.toLocaleString();
    }

    const newMovieIn7days = prisma.movie.findMany({
      where: {
        releaseDateForNetflix: {
          lte: new Date(),
          gte: currentDatetime,
        },
      },
    });

    res.status(200).json({ ...expireAlert });
  } catch (err) {
    next(err);
  }
};


