const prisma = require("../models/prisma");
const { KID } = require("../config/constant");
const shuffleArray = require("./shuffle-array");

async function getMovieKids(profileId) {
  const data = { top10: [], continueWatching: [], newReleases: [], isKids: [] };
  const top10 = await prisma.movie.findMany({
    where: {
      enumGenres: KID,
    },
    orderBy: {
      count_watching: "desc",
    },
    take: 10,
    skip: 0,
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
      acc.push({ ...movie.video.movie });
    }
    return acc;
  }, []);
  const newReleases = await prisma.movie.findMany({
    where: {
      enumGenres: KID,
    },
    orderBy: {
      releaseDateForNetflix: "desc",
    },
    take: 10,
    skip: 0,
  });
  const isKids = await prisma.movie.findMany({
    where: {
      enumGenres: KID,
    },
  });
  shuffleArray(isKids);
  for (let i = 0; i < 10; i++) {
    data.isKids.push(isKids.pop());
  }
  data.continueWatching = continueWatching;
  data.top10 = top10;
  data.newReleases = newReleases;

  return data;
}

module.exports = getMovieKids;
