const prisma = require("../models/prisma");
const { KID } = require("../config/constant");
const shuffleArray = require("./shuffle-array");

async function getMovieKids(profileId, isTVShow) {
  const data = { top10: [], continueWatching: [], newReleases: [], kids: [] };
  if (isTVShow === undefined) {
    const top10Movie = await prisma.movie.findMany({
      where: {
        enumGenres: KID,
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
      take: 10,
      skip: 0,
    });
    const continueWatching = continueWatchingMovie.reduce((acc, movie) => {
      if (acc.length < 10 && movie.video.movie.enumGenres === KID) {
        acc.push({
          ...movie.video.movie,
          likeMovie: movie.video.movie.likeMovie[0],
        });
      }
      return acc;
    }, []);
    const newReleasesMovie = await prisma.movie.findMany({
      where: {
        enumGenres: KID,
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
    const isKids = await prisma.movie.findMany({
      where: {
        enumGenres: KID,
      },
      include: {
        likeMovie: {
          where: {
            userProfileId: profileId,
          },
        },
      },
    });
    shuffleArray(isKids);
    isKids.forEach((movie) => {
      if (data.kids.length < 10) {
        data.kids.push({ ...movie, likeMovie: movie.likeMovie[0] });
      }
    });
    data.continueWatching = continueWatching;
    data.top10 = top10;
    data.newReleases = newReleases;
  } else {
    const top10Movie = await prisma.movie.findMany({
      where: {
        enumGenres: KID,
        isTVShow,
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
      take: 10,
      skip: 0,
    });
    const continueWatching = continueWatchingMovie.reduce((acc, movie) => {
      if (
        acc.length < 10 &&
        movie.video.movie.enumGenres === KID &&
        movie.video.movie.isTVShow === isTVShow
      ) {
        acc.push({
          ...movie.video.movie,
          likeMovie: movie.video.movie.likeMovie[0],
        });
      }
      return acc;
    }, []);
    const newReleasesMovie = await prisma.movie.findMany({
      where: {
        enumGenres: KID,
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
    const isKids = await prisma.movie.findMany({
      where: {
        enumGenres: KID,
      },
      include: {
        likeMovie: {
          where: {
            userProfileId: profileId,
          },
        },
      },
    });
    shuffleArray(isKids);
    isKids.forEach((movie) => {
      if (data.kids.length < 10) {
        data.kids.push({ ...movie, likeMovie: movie.likeMovie[0] });
      }
    });
    data.continueWatching = continueWatching;
    data.top10 = top10;
    data.newReleases = newReleases;
  }
  return data;
}

module.exports = getMovieKids;
