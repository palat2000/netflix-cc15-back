const prisma = require("../models/prisma");
const { KID } = require("../config/constant");
const shuffleArray = require("./shuffle-array");

async function getMovieKids() {
  const movie = await prisma.movie.findMany({
    where: {
      enumGenres: KID,
    },
    orderBy: {
      count_watching: "asc",
    },
  });
  const data = { row1: [], row2: [], top10: [] };
  for (let i = 0; i < 10; i++) {
    data.top10.push(movie.pop());
  }
  shuffleArray(fevGenreMovie);
  for (let i = 0; i < 10; i++) {
    data.row1.push(movie.pop());
  }
  for (let i = 0; i < 10; i++) {
    data.row2.push(movie.pop());
  }
  return data;
}

module.exports = getMovieKids;
