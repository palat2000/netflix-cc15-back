const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary-service");
const fs = require("fs/promises");

exports.createUserProfile = async (req, res, next) => {
  try {
    const { userProfileName, isKid, userId } = req.body;
    console.log("isKid", isKid);
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
    if (isKid === "true") favoriteGenres = "KID";

    console.log(!isKid, "sssssssssssssssssssssssssss");
    console.log(favoriteGenres, "sssssssssssssssssssssssssss");
    const body = {
      userProfileName: userProfileName,
      favoriteGenres: favoriteGenres,
      profileImageUrl: null,
      userId: +userId,
      isKid: isKid === "true" ? true : false,
    };

    if (req?.file?.path) {
      const imageUrl = await upload(req.file.path);
      body.profileImageUrl = imageUrl;
    }

    const userProfile = await prisma.userProfile.create({
      data: body,
    });

    res.status(201).json({ message: "userProfile created", userProfile });
    console.log(userProfile);
  } catch (error) {
    next(error);
  } finally {
    // console.log("req", req);
    if (req?.file?.path) {
      fs.unlink(req?.file?.path);
    }
  }
};

exports.deleteUserProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;

    const deleteUserProfile = await prisma.userProfile.delete({
      where: {
        id: +profileId,
      },
    });
    res.status(200).json({ message: "userProfile deleted", deleteUserProfile });
  } catch (error) {
    next(error);
  }
};

exports.editUserProfile = async (req, res, next) => {
  try {
    console.log(
      req.file,
      "req.fileeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    );
    const { userProfileName, userProfileId } = req.body;
    if (!userProfileName) {
      return next(createError("userProfileName is required", 400));
    }

    const body = {
      userProfileName: userProfileName,
      profileImageUrl: null,
    };

    const dupUserProfileNameWithUserProfileId =
      await prisma.userProfile.findFirst({
        where: {
          AND: [{ id: +userProfileId }, { userProfileName: userProfileName }],
        },
      });

    if (dupUserProfileNameWithUserProfileId) {
      delete body.userProfileName;
    }
    const dupUserProfileNameWithUserId = await prisma.userProfile.findMany({
      where: {
        AND: [{ userId: +req.user.id }, { userProfileName: userProfileName }],
        NOT: dupUserProfileNameWithUserProfileId
          ? [
              {
                id: +dupUserProfileNameWithUserProfileId.id,
              },
            ]
          : [],
      },
    });
    if (dupUserProfileNameWithUserId.length > 0) {
      return next(createError("This userProfileName is already use", 400));
    }
    if (req?.file?.path) {
      const imageUrl = await upload(req.file.path);
      body.profileImageUrl = imageUrl;
    }

    const userProfile = await prisma.userProfile.update({
      where: {
        id: +userProfileId,
      },
      data: body,
    });

    res.status(200).json({ userProfile });
  } catch (error) {
    next(error);
  } finally {
    if (req?.file?.path) {
      fs.unlink(req?.file?.path);
    }
  }
};

exports.chooseProfile = async (req, res, next) => {
  try {
    const payload = { userProfileId: req.body.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "qwertyuiopasdfghjkl",
      {
        expiresIn: process.env.JWT_PROFILE_EXPIRE,
      }
    );

    const userProfile = await prisma.userProfile.findFirst({
      where: {
        id: +req.body.id,
      },
    });

    res.status(200).json({ accessToken, userProfile });
    console.log("accessToken", accessToken);
    console.log("userProfile", userProfile);
  } catch (error) {
    next(error);
  }
};

exports.getAllUserProfile = async (req, res, next) => {
  try {
    const allUserProfile = await prisma.userProfile.findMany({
      where: {
        userId: +req.user.id,
      },
    });
    res.status(200).json({ allUserProfile });
  } catch (err) {
    next(err);
  }
};

exports.getMeProfile = async (req, res, next) => {
  try {
    res.status(200).json({ userProfile: req.userProfile });
  } catch (err) {
    next(err);
  }
};
