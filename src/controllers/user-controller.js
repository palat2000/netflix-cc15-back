const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary-service");
const fs = require("fs/promises");

exports.createUserProfile = async (req, res, next) => {
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

    const body = {
      userProfileName: userProfileName,
      favoriteGenres: favoriteGenres,
      profileImageUrl: null,
      userId: +userId,
    };

    if (req?.file?.path) {
      const imageUrl = await upload(req.file.path);
      console.log(imageUrl);
      body.profileImageUrl = imageUrl;
    }

    const userProfile = await prisma.userProfile.create({
      data: body,
    });

    res.status(201).json({ message: "userProfile created", userProfile });
  } catch (error) {
    next(error);
  } finally {
    console.log("req", req);
    if (req?.file?.path) {
      fs.unlink(req?.file?.path);
    }
  }
};

exports.deleteUserProfile = async (req, res, next) => {
  try {
    const { userProfileId } = req.body;
    const deleteUserProfile = await prisma.userProfile.delete({
      where: {
        id: +userProfileId,
      },
    });
    res.status(200).json({ message: "userProfile deleted", deleteUserProfile });
  } catch (error) {
    next(error);
  }
};

exports.getAllProfile = async (req, res, next) => {
  console.log(req.user.id, "userId");
  try {
    const allUserProfile = await prisma.userProfile.findMany({
      where: {
        userId: req.user.id,
      },
    });
    console.log(allUserProfile);

    res.status(200).json({ allUserProfile });
  } catch (error) {
    next(error);
  }
};

// exports.getProfile = async (req, res, next) => {
//   console.log(req.body, "body");
//   try {
//     const { userProfileId } = req.body;
//     const userProfile = await prisma.userProfile.findFirst({
//       where: {
//         id: userProfileId,
//       },
//     });
//     res.status(200).json({ userProfile });
//   } catch (error) {
//     next(error);
//   }
// };

exports.editUserProfile = async (req, res, next) => {
  try {
    const { userProfileName, userProfileId } = req.body;
    if (!userProfileName) {
      return next(createError("userProfileName is required", 400));
    }

    const imageUrl = await upload(req.file.path);
    console.log(imageUrl);

    const editUserProfile = await prisma.userProfile.update({
      where: {
        id: +userProfileId,
      },
      data: {
        profileImageUrl: req.body.quantity,
        userProfileName: userProfileName,
      },
    });

    res.status(200).json({ message: "userProfile deleted" });
  } catch (error) {
    next(error);
  }
};
