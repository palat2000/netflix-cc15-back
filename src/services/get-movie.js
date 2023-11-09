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

  const historyWatchMovie = await prisma.history.findMany({
    where: {
      userProfileId: profileId,
    },
  });
  const top10 = await prisma.movie.findMany({
    orderBy: {
      count_watching: "desc",
    },
    take: 10,
    skip: 0,
  });
  const recommendFevGenreMovie = await prisma.movie.findMany({
    where: {
      enumGenres: genre,
    },
  });
  shuffleArray(historyWatchMovie);
  shuffleArray(recommendFevGenreMovie);
  for (let i = 0; i < 10; i++) {
    data.fevGenre.push(recommendFevGenreMovie.pop());
  }
  for (let i = 0; i < 10; i++) {
    data.history.push(historyWatchMovie.pop());
  }

  data.top10 = top10;

  return data;
}

module.exports = getMovie;
