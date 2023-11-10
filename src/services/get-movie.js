const prisma = require("../models/prisma");
const shuffleArray = require("./shuffle-array");
const { ACTION } = require("../config/constant");

async function getMovieByGenre(genre, isTVShow) {
  const genreArr = [];
  if (isTVShow === undefined) {
    const genreMovie = await prisma.movie.findMany({
      where: {
        enumGenres: genre,
      },
    });
    shuffleArray(genreMovie);
    for (let i = 0; i < 10; i++) {
      genre.push(genreMovie.pop());
    }
  } else {
    const genreMovie = await prisma.movie.findMany({
      where: {
        enumGenres: genre,
        isTVShow,
      },
    });
    shuffleArray(genreMovie);
    for (let i = 0; i < 10; i++) {
      genre.push(genreMovie.pop());
    }
  }
  return genreArr;
}

async function getMovie(profileId, genre, isTVShow) {
  const data = {};
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
      orderBy: {
        // latestSomething:"desc"
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
    const newReleases = await prisma.movie.findMany({
      orderBy: {
        releaseDataNetflix: "desc",
      },
      take: 10,
      skip: 0,
    });
    data.continueWatching = continueWatching;
    data.top10 = top10;
    data.newReleases = newReleases;
    data.action = await getMovieByGenre(ACTION);
    data.comedy = await getMovieByGenre();
    data.dramas = await getMovieByGenre();
    data.horror = await getMovieByGenre();
    data.kids = await getMovieByGenre();
    data.romantic = await getMovieByGenre();
  } else {
    const continueWatching = await prisma.history.findMany({
      where: {
        userProfileId: profileId,
        isTVShow,
      },
      include: {
        video: {
          include: {
            movie: true,
          },
        },
      },
      orderBy: {
        // latestSomething:"desc"
      },
      take: 10,
      skip: 0,
    });
    const top10 = await prisma.movie.findMany({
      where: {
        isTVShow,
      },
      orderBy: {
        count_watching: "desc",
      },
      take: 10,
      skip: 0,
    });
    const newReleases = await prisma.movie.findMany({
      where: {
        isTVShow,
      },
      orderBy: {
        releaseDateNetflix: "desc",
      },
      take: 10,
      skip: 0,
    });
    data.continueWatching = continueWatching;
    data.top10 = top10;
    data.newReleases = newReleases;
    data.action = await getMovieByGenre(ACTION);
    data.comedy = await getMovieByGenre();
    data.dramas = await getMovieByGenre();
    data.horror = await getMovieByGenre();
    data.kids = await getMovieByGenre();
    data.romantic = await getMovieByGenre();
  }

  return data;
}

module.exports = getMovie;
