const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const XLSX = require("xlsx");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary-service");
const fs = require("fs/promises");
const readXLSXFile = require("../services/read-xlsx-file");
const insertMovie = require("../services/insert-movie");
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

// exports.createMovie = async (req, res, next) => {
//   console.log("req.body", req.body);
//   try {
//     const { title, release_year, detail, isTVShow, enumGenres, actorName } =
//       req.body;

//     const titleMovieDup = await prisma.movie.findFirst({
//       where: {
//         title: title,
//       },
//     });

//     if (titleMovieDup) {
//       return next(createError("Already add this movie name", 400));
//     }
//     console.log(titleMovieDup);
//     console.log("sard");
//     console.log(req.files["image"][0].path, "meow");
//     console.log(req.files["trailer"][0].path, "meow");

//     let imageUrl;
//     let trailerUrl;

//     let body = {};

//     if (req?.files["image"]) {
//       imageUrl = await upload(req.files["image"][0].path);
//       console.log(imageUrl);
//       body.image = imageUrl;
//     }
//     if (req?.files["trailer"]) {
//       trailerUrl = await upload(req.files["trailer"][0].path);
//       console.log(trailerUrl);
//       body.trailer = trailerUrl;
//     }
//     body = {
//       ...body,
//       title: title,
//       release_year: release_year,
//       detail: detail,
//       isTVShow: !!isTVShow,
//       enumGenres: enumGenres,
//     };

//     const createMovie = await prisma.movie.create({
//       data: body,
//     });

//     actorName.forEach(async (el) => {
//       const actors = await prisma.actors.createMany({
//         data: {
//           movieId: createMovie.id,
//           name: el,
//         },
//       });
//     });

//     const movie = await prisma.movie.findMany({
//       where: {
//         id: createMovie.id,
//       },
//       include: {
//         actors: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });
//     res.status(201).json({ movie });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   } finally {
//     if (req.files["image"][0].path) {
//       fs.unlink(req.files["image"][0].path);
//     }
//     if (req.files["trailer"][0].path) {
//       fs.unlink(req.files["trailer"][0].path);
//     }
//   }
// };

exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.body;
  } catch (error) {
    next(error);
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    const file = XLSX.readFile(req.file.path);
    const sheetNames = file.SheetNames;
    const worksheet = file.Sheets[sheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    const formattedData = readXLSXFile(data);
    const movies = await insertMovie(formattedData);
    res.json({ movies });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
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

// exports.quickAdd = async (req, res, next) => {
//   try {
//     const {
//       title,
//       release_year,
//       detail,
//       isTVShow,
//       enumGenres,
//       actorName,
//       image,
//       trailer,
//     } = req.body;
//     const body = {
//       title,
//       release_year,
//       detail,
//       isTVShow: !!isTVShow,
//       enumGenres,
//       image,
//       trailer,
//     };
//     const createMovie = await prisma.movie.create({
//       data: body,
//     });
//     actorName.forEach(async (el) => {
//       await prisma.actors.createMany({
//         data: {
//           movieId: createMovie.id,
//           name: el,
//         },
//       });
//     });
//     const movie = await prisma.movie.findMany({
//       where: {
//         id: createMovie.id,
//       },
//       include: {
//         actors: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });
//     res.status(200).json({ movie });
//   } catch (err) {
//     next(err);
//   }
// };
exports.readUser = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};
