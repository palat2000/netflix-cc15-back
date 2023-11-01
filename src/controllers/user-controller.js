const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary-service");
const fs = require("fs/promises");
exports.getAllProfile = async (req, res, next) => {
  console.log(req.user.id, "userId");
  try {
    const allUserProfile = await prisma.userProfile.findMany({
      where: {
        userId: req.user.id,
      },
    });
    console.log(allUserProfile);

    delete user.password;
    res.status(200).json({ user: req.user, allUserProfile });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        usr,
      },
    });
    delete user.password;
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

exports.createUserProfile = async (req, res, next) => {
  console.log("req.file", req.file);
  console.log("req.body", req.body);
  try {
    const { userProfileName, isKid, userId } = req.body;
    const userProfileNameDup = await prisma.userProfile.findFirst({
      where: {
        userId: +userId,
        userProfileName: userProfileName,
      },
    });
    let favoriteGenres = null;
    if (userProfileNameDup) {
      return next(createError("Already add this profile name", 400));
    }
    console.log(userProfileNameDup);
    if (isKid) favoriteGenres = "KID";
    const imageUrl = await upload(req.file.path);
    console.log(imageUrl);
    const userProfile = await prisma.userProfile.create({
      data: {
        userProfileName: userProfileName,
        favoriteGenres: favoriteGenres,
        profileImageUrl: imageUrl,
        userId: +userId,
      },
    });
    const profileImageUrl = await prisma.userProfile.create({
      data: {
        productId: product.id,
        imageUrl: imageUrl,
      },
    });
    res.status(201).json({ message: "userProfile created", userProfile });
  } catch (error) {
    next(error);
  } finally {
    fs.unlink(req.file.path);
  }
};
