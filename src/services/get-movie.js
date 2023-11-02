const prisma = require("../models/prisma");
const shuffleArray = require("./shuffle-array");

async function getMovie(profileId, genre) {
  const data = { fevGenre: [], history: [], top10: [] };
  const historyWatchMovie = await prisma.history.findMany({
    where: {
      userProfileId: profileId,
    },
  });
  const top10Movie = await prisma.movie.findMany({
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

  data.top10 = [...top10Movie];

  return data;
}

module.exports = getMovie;
