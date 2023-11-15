const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const XLSX = require("xlsx");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary-service");
const fs = require("fs/promises");
const readXLSXFile = require("../services/read-xlsx-file");
const {
  registerSchema,
  loginSchema,
} = require("../validators/admin-validator");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    console.log(value, "value hereee");
    if (error) {
      return next(error);
    }
    const usernameDup = await prisma.admin.findFirst({
      where: {
        username: value.username,
      },
    });

    console.log(usernameDup, "usernameDup====");
    if (usernameDup) {
      return next(createError("This username is already used", 400));
    }

    value.password = await bcrypt.hash(value.password, 12);

    const admin = await prisma.admin.create({
      data: {
        username: value.username,
        password: value.password,
        createAt: new Date(),
      },
    });

    const payload = { adminId: admin.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "HFTAFH",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    res.status(201).json({ accessToken, admin });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    console.log(value, "value=====");
    if (error) {
      return next(error);
    }
    const admin = await prisma.admin.findFirst({
      where: {
        username: value.username,
      },
    });

    console.log(admin, "admin ====");

    if (!admin) {
      return next(
        createError(
          "Sorry, we can't find an account with this username. Please try again. ",
          400
        )
      );
    }

    const isMatch = await bcrypt.compare(value.password, admin.password);
    if (!isMatch) {
      return next(createError("Incorrect password. Please try again. ", 400));
    }

    const payload = { adminId: admin.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "HFTAFH",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    delete admin.password;
    res.status(200).json({ accessToken, admin });
  } catch (error) {
    next(error);
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ admin: req.admin });
};

exports.createMovie = async (req, res, next) => {
  try {
    console.log(
      req.body,
      "BODYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
    );
    const actorNameArray = req.body.actorName.split(",");
    const titleMovieDup = await prisma.movie.findFirst({
      where: {
        title: req.body.title,
      },
    });

    if (titleMovieDup) {
      return next(createError("Already add this movie name", 400));
    }

    const Genres = req.body.genres.toUpperCase();

    const movie = await prisma.movie.create({
      data: {
        title: req.body.title.toLowerCase(),
        release_year: req.body.release_year,
        detail: req.body.detail.toLowerCase(),
        isTVShow: !!req.body.isTVShow,
        image: req.body.coverImage,
        enumGenres: Genres,
        trailer: req.body.trailer,
        releaseDateForNetflix: new Date(req.body.releaseDateForNetflix),
      },
    });

    actorNameArray.forEach(async (e) => {
      const checkActors = await prisma.actors.findFirst({
        where: {
          name: e.toLowerCase(),
        },
      });

      if (!checkActors) {
        const actorIdcheck = await prisma.actors.create({
          data: { name: e.toLowerCase() },
        });
        if (actorIdcheck) {
          await prisma.actorMovie.create({
            data: {
              actorsId: actorIdcheck.id,
              movieId: movie.id,
            },
          });
        }
      }
      if (checkActors) {
        await prisma.actorMovie.create({
          data: {
            actorsId: checkActors.id,
            movieId: movie.id,
          },
        });
      }
    });

    const episodeDup = await prisma.video.findFirst({
      where: {
        videoEpisodeName: req.body.videoEpisodeName.toLowerCase(),
        videoUrl: req.body.video,
        videoEpisodeNo: +req.body.videoEpisodeNo,
      },
    });

    if (episodeDup) {
      return next(createError("Already add this Episode", 400));
    }

    await prisma.video.create({
      data: {
        videoEpisodeName: req.body.videoEpisodeName.toLowerCase(),
        videoUrl: req.body.video,
        videoEpisodeNo: +req.body.videoEpisodeNo,
        movieId: movie.id,
      },
    });

    res.status(201).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.prepareFile = async (req, res, next) => {
  try {
    const file = XLSX.readFile(req.file.path);
    const sheetNames = file.SheetNames;
    const worksheet = file.Sheets[sheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    const formattedData = readXLSXFile(data);
    res.status(200).json({ formattedData });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.readUser = async (req, res, next) => {
  try {
    const allUserswithPassword = await prisma.user.findMany({
      select: {
        email: true,
        activeAt: true,
        expiredDate: true,
      },
      orderBy: {
        activeAt: "desc",
      },
      take: 5,
    });

    const allUsersWithoutPassword = allUserswithPassword.map((user) => {
      const { password, ...allUsersWithoutPassword } = user;
      return allUsersWithoutPassword;
    });

    res.status(200).json(allUsersWithoutPassword);
  } catch (error) {
    console.log(error);
  }
};

exports.readMovieList = async (req, res, next) => {
  try {
    console.log("first");

    const movie = await prisma.movie.findMany();
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
  }
};

exports.editMovieList = async (req, res, next) => {
  try {
    console.log("req.body naja ", req.body);
    console.log("filllllleeeee", req.file);

    let imageUrl;
    if (req?.file?.path) {
      imageUrl = await upload(req.file.path);
      // body.profileImageUrl = imageUrl;
    }
    console.log(imageUrl);
    // if ( req.body.enumGen === "null"){
    //   req.body.enumGen = req.body.subEnumGen
    // }
    if (req.body.tvShow === "NO") {
      req.body.tvShow = false;
    }
    if (req.body.tvShow === "YES") {
      req.body.tvShow = true;
    }
    const editMovie = await prisma.movie.update({
      where: {
        id: +req.body.editTargetId,
      },
      data: {
        title: req.body.title,
        release_year: req.body.year,
        count_watching: +req.body.countWatch,
        count_liked: +req.body.countLike,
        detail: req.body.detail,
        isTVShow: !!req.body.tvShow,
        enumGenres: req.body.enumGen,
        image: imageUrl,
      },
    });

    res.status(200).json(editMovie);
    console.log("resultttttttttttttttttttttttttttttt", editMovie);
  } catch (error) {
    console.log(error);
  } finally {
    // console.log("req", req);
    if (req?.file?.path) {
      fs.unlink(req?.file?.path);
    }
  }
};
exports.deleteMovieList = async (req, res, next) => {
  try {
    console.log(req.body.id);

    const deleteMovieList = await prisma.movie.delete({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json(deleteMovieList);
  } catch (error) {
    console.log(error);
  }
};

exports.getNewestUserAndTopMovie = async (req, res, next) => {
  try {
    const newestUser = await prisma.user.findMany({
      orderBy: {
        activeAt: "desc",
      },
      select: {
        email: true,
        activeAt: true,
        expiredDate: true,
      },
      take: 5,
    });

    const topMovie = await prisma.movie.findMany({
      orderBy: {
        count_watching: "desc",
      },
      select: {
        title: true,
        release_year: true,
        count_watching: true,
        count_liked: true,
        isTVShow: true,
        enumGenres: true,
      },
      take: 10,
    });

    const userAndMovie = {
      newestUser: newestUser,
      topMovie: topMovie,
    };

    res.status(200).json(userAndMovie);
  } catch (error) {
    console.log(error);
  }
};
