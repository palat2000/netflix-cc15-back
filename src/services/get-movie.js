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

async function getMovieByGenre(genre, isTVShow) {
  const genreArr = [];
  if (isTVShow === undefined) {
    const genreMovie = await prisma.movie.findMany({
      where: {
        enumGenres: genre,
      },
    });
    shuffleArray(genreMovie);
    for (let i = 0; i < 10; i++) {
      genreArr.push(genreMovie.pop());
    }
  } else {
    const genreMovie = await prisma.movie.findMany({
      where: {
        enumGenres: genre,
        isTVShow,
      },
    });
    shuffleArray(genreMovie);
    for (let i = 0; i < 10; i++) {
      genreArr.push(genreMovie.pop());
    }
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
    console.log(JSON.stringify(continueWatching, null, 12));
    const top10 = await prisma.movie.findMany({
      orderBy: {
        count_watching: "desc",
      },
      take: 10,
      skip: 0,
    });
    const newReleases = await prisma.movie.findMany({
      orderBy: {
        releaseDateForNetflix: "desc",
      },
      take: 10,
      skip: 0,
    });
    data.continueWatching = continueWatching;
    data.top10 = top10;
    data.newReleases = newReleases;
    data.action = await getMovieByGenre(ACTION);
    data.sport = await getMovieByGenre(SPORTS);
    data.comedy = await getMovieByGenre(COMEDIES);
    data.horror = await getMovieByGenre(HORROR);
    data.kids = await getMovieByGenre(KID);
    data.romantic = await getMovieByGenre(ROMANCE);
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
        acc.push({ ...movie.video.movie });
      }
      return acc;
    }, []);
    const top10 = await prisma.movie.findMany({
      where: {
        isTVShow: isTVShow,
      },
      orderBy: {
        count_watching: "desc",
      },
      take: 10,
      skip: 0,
    });
    const newReleases = await prisma.movie.findMany({
      where: {
        isTVShow,
      },
      orderBy: {
        releaseDateForNetflix: "desc",
      },
      take: 10,
      skip: 0,
    });
    data.continueWatching = continueWatching;
    data.top10 = top10;
    data.newReleases = newReleases;
    data.action = await getMovieByGenre(ACTION, isTVShow);
    data.sport = await getMovieByGenre(SPORTS, isTVShow);
    data.comedy = await getMovieByGenre(COMEDIES, isTVShow);
    data.horror = await getMovieByGenre(HORROR, isTVShow);
    data.kids = await getMovieByGenre(KID, isTVShow);
    data.romantic = await getMovieByGenre(ROMANCE, isTVShow);
  }
  return data;
}

module.exports = getMovie;
