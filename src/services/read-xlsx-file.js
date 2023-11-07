function readXLSXFile(arrMovie) {
  const movieObj = {};
  arrMovie.forEach((row) => {
    const title = row.title;
    const existingMovie = title in movieObj;
    if (existingMovie) {
      movieObj[title].video.push({
        videoEpisodeName: row.videoEpisodeName,
        videoEpisodeNo: row.videoEpisodeNo,
        video: row.video,
      });
    } else {
      const actorName = row.actorName.split(",").map((name) => name.trim());
      const movie = {
        title: title,
        isTVShow: row.isTVShow === "true",
        image: row.image || null,
        release_year: row.release_year || null,
        genres: row.genres || null,
        trailer: row.trailer || null,
        detail: row.detail,
        actorName,
        video: [
          {
            videoEpisodeName: row.videoEpisodeName,
            videoEpisodeNo: row.videoEpisodeNo,
            video: row.video,
          },
        ],
      };
      movieObj[title] = movie;
    }
  });
  return Object.values(movieObj);
}

module.exports = readXLSXFile;
