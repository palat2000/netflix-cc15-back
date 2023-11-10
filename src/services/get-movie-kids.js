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
  const continueWatching = await prisma.history.findMany({
    where: {
      userProfileId: profileId,
    },
    include: {
      video: {
        include: {
          movie: true,
        },
      },
    },
    take: 10,
    skip: 0,
  });
  const isKids = [];
  for (let i = 0; i < 10; i++) {
    const randomNum = Math.floor(Math.random() * 10);
    const kidsMovie = await prisma.movie.findFirst({
      where: {
        enumGenres: KID,
      },
      take: 1,
      skip: randomNum,
    });
    isKids.push(kidsMovie);
  }
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
  // isKids.sort((a, b) => b.release_year - a.release_year);
  // for (let i = 0; i < 10; i++) {
  //   data.newReleases[i] = isKids[i];
  // }
  shuffleArray(isKids);
  data.continueWatching = continueWatching;
  data.top10 = top10;
  data.isKids = isKids;
  data.newReleases = newReleases;

  return data;
}

module.exports = getMovieKids;
