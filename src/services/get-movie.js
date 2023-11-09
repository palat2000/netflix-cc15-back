const prisma = require("../models/prisma");
const shuffleArray = require("./shuffle-array");

async function getMovie(profileId, genre, isTVShow) {
  const data = {
    top10: [],
    newReleases: [],
    continueWatching: [],
    action: [],
    romantic: [],
    comedy: [],
    horror: [],
    dramas: [],
    kids: [],
  };
  if (isTVShow === undefined) {
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
    const top10 = await prisma.movie.findMany({
      orderBy: {
        count_watching: "desc",
      },
      take: 10,
      skip: 0,
    });
    data.continueWatching = continueWatching;
    data.top10 = top10;
  }

  return data;
}

module.exports = getMovie;
