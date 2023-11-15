const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { GENRES } = require("../config/constant");

async function insertMovie(arrMovie) {
  const data = [];
  for (let movie of arrMovie) {
    const [isMatch] = GENRES.filter(
      (genres) => genres == movie.genres.toUpperCase()
    );
    if (!isMatch) {
      throw createError("invalid genres", 400);
    }
    const createMovie = await prisma.movie.create({
      data: {
        title: movie.title,
        release_year: "" + movie.release_year,
        detail: movie.detail,
        isTVShow: movie.isTVShow,
        image: movie.image,
        trailer: movie.trailer,
        enumGenres: isMatch,
      },
    });
    data.push(createMovie);
    const index = data.findIndex(
      (movieData) => movieData.id === createMovie.id
    );
    for (let video of movie.video) {
      const createVideo = await prisma.video.create({
        data: {
          videoEpisodeName: video.videoEpisodeName,
          videoUrl: video.videoUrl,
          videoEpisodeNo: video.videoEpisodeNo,
          movieId: createMovie.id,
        },
      });
      if (!data[index].video) {
        data[index].video = [createVideo];
      } else {
        data[index].video.push(createVideo);
      }
    }
    for (let name of movie.actorName) {
      let actor;
      actor = await prisma.actors.findFirst({
        where: {
          name,
        },
      });
      if (!actor) {
        actor = await prisma.actors.create({
          data: {
            name,
          },
        });
      }
      await prisma.actorMovie.create({
        data: {
          actorsId: actor.id,
          movieId: createMovie.id,
        },
      });
    }
    const actorMovie = await prisma.actorMovie.findMany({
      where: {
        movieId: createMovie.id,
      },
      select: {
        actors: {
          select: {
            name: true,
          },
        },
      },
    });
    data[index].actorMovie = actorMovie;
  }
  return data;
}

module.exports = insertMovie;
