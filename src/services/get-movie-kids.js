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
  const isKids = await prisma.movie.findMany({
    where: {
      enumGenres: KID,
    },
  });
  isKids.sort((a, b) => b.release_year - a.release_year);
  for (let i = 0; i < 10; i++) {
    data.newReleases[i] = isKids[i];
  }
  shuffleArray(isKids);
  data.continueWatching = continueWatching;
  data.top10 = top10;
  for (let i = 0; i < 10; i++) {
    data.isKids.push(isKids.pop());
  }

  return data;
}

module.exports = getMovieKids;
