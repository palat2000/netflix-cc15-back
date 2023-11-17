const prisma = require("../models/prisma");
const shuffleArray = require("./shuffle-array");
const {
  COMEDIES,
  ACTION,
  HORROR,
  SPORTS,
  KID,
  ROMANCE,
} = require("../config/constant");

async function getMovieByGenre(genre, profileId, isTVShow) {
  const genreArr = [];
  if (isTVShow === undefined) {
    const genreMovie = await prisma.movie.findMany({
      where: {
        enumGenres: genre,
      },
      include: {
        likeMovie: {
          where: {
            userProfileId: profileId,
          },
        },
      },
    });
    shuffleArray(genreMovie);
    genreMovie.forEach((movie) => {
      if (genreArr.length < 10) {
        genreArr.push({ ...movie, likeMovie: movie.likeMovie[0] });
      }
    });
  } else {
    const genreMovie = await prisma.movie.findMany({
      where: {
        enumGenres: genre,
        isTVShow,
      },
      include: {
        likeMovie: {
          where: {
            userProfileId: profileId,
          },
        },
      },
    });
    shuffleArray(genreMovie);
    genreMovie.forEach((movie) => {
      if (genreArr.length < 10) {
        genreArr.push({ ...movie, likeMovie: movie.likeMovie[0] });
      }
    });
  }
  return genreArr;
}

async function getMovie(profileId, isTVShow) {
  const data = {};
  if (isTVShow === undefined) {
    const continueWatchingMovie = await prisma.history.findMany({
      where: {
        userProfileId: profileId,
      },
      include: {
        video: {
          include: {
            movie: {
              include: {
                likeMovie: {
                  where: {
                    userProfileId: profileId,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        latestWatchingAt: "desc",
      },
      take: 10,
      skip: 0,
    });
    const continueWatching = continueWatchingMovie.reduce((acc, movie) => {
      if (acc.length < 10) {
        acc.push({
          ...movie.video.movie,
          likeMovie: movie.video.movie.likeMovie[0],
        });
      }
      return acc;
    }, []);
    const top10Movie = await prisma.movie.findMany({
      orderBy: {
        count_watching: "desc",
      },
      include: {
        likeMovie: {
          where: {
            userProfileId: profileId,
          },
        },
      },
      take: 10,
      skip: 0,
    });
    const top10 = top10Movie.map((movie) => {
      return { ...movie, likeMovie: movie.likeMovie[0] };
    });
    const newReleasesMovie = await prisma.movie.findMany({
      orderBy: {
        releaseDateForNetflix: "desc",
      },
      include: {
        likeMovie: {
          where: {
            userProfileId: profileId,
          },
        },
      },
      take: 10,
      skip: 0,
    });
    const newReleases = newReleasesMovie.map((movie) => {
      return { ...movie, likeMovie: movie.likeMovie[0] };
    });
    data.continueWatching = continueWatching;
    data.top10 = top10;
    data.newReleases = newReleases;
    data.action = await getMovieByGenre(ACTION, profileId);
    data.sport = await getMovieByGenre(SPORTS, profileId);
    data.comedy = await getMovieByGenre(COMEDIES, profileId);
    data.horror = await getMovieByGenre(HORROR, profileId);
    data.kids = await getMovieByGenre(KID, profileId);
    data.romantic = await getMovieByGenre(ROMANCE, profileId);
  } else {
    const continueWatchingMovie = await prisma.history.findMany({
      where: {
        userProfileId: profileId,
      },
      include: {
        video: {
          include: {
            movie: {
              include: {
                likeMovie: true,
              },
            },
          },
        },
      },
      orderBy: {
        latestWatchingAt: "desc",
      },
    });
    const continueWatching = continueWatchingMovie.reduce((acc, movie) => {
      if (acc.length < 10 && movie.video.movie.isTVShow === isTVShow) {
        acc.push({
          ...movie.video.movie,
          likeMovie: movie.video.movie.likeMovie[0],
        });
      }
      return acc;
    }, []);
    const top10Movie = await prisma.movie.findMany({
      where: {
        isTVShow: isTVShow,
      },
      orderBy: {
        count_watching: "desc",
      },
      include: {
        likeMovie: {
          where: {
            userProfileId: profileId,
          },
        },
      },
      take: 10,
      skip: 0,
    });
    const top10 = top10Movie.map((movie) => {
      return { ...movie, likeMovie: movie.likeMovie[0] };
    });
    const newReleasesMovie = await prisma.movie.findMany({
      where: {
        isTVShow,
      },
      orderBy: {
        releaseDateForNetflix: "desc",
      },
      include: {
        likeMovie: {
          where: {
            userProfileId: profileId,
          },
        },
      },
      take: 10,
      skip: 0,
    });
    const newReleases = newReleasesMovie.map((movie) => {
      return { ...movie, likeMovie: movie.likeMovie[0] };
    });
    data.continueWatching = continueWatching;
    data.top10 = top10;
    data.newReleases = newReleases;
    data.action = await getMovieByGenre(ACTION, profileId, isTVShow);
    data.sport = await getMovieByGenre(SPORTS, profileId, isTVShow);
    data.comedy = await getMovieByGenre(COMEDIES, profileId, isTVShow);
    data.horror = await getMovieByGenre(HORROR, profileId, isTVShow);
    data.kids = await getMovieByGenre(KID, profileId, isTVShow);
    data.romantic = await getMovieByGenre(ROMANCE, profileId, isTVShow);
  }
  return data;
}

module.exports = getMovie;
