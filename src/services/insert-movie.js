const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { GENRE } = require("../config/constant");

async function insertMovie(arrMovie) {
  for (let movie of arrMovie) {
    const [isMatch] = GENRE.filter((genres) => genres == movie.genres);
    if (!isMatch) {
      return createError("invalid genres");
    }
    const movie = await prisma.movie.create({
      data: {
        title: movie.title,
        release_year: movie.release_year,
        detail: movie.detail,
        isTVShow: movie.isTVShow,
        image: movie.image,
        trailer: movie.trailer,
        enumGenres: isMatch,
      },
    });
    for (let name of movie.actorName) {
      const actor = await prisma.actors.create({
        data: {
          name,
        },
      });
    }
  }
}
