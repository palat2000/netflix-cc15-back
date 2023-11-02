const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const stripe = require("stripe")(process.env.STRIPE_API_TEST_KEY);
const createError = require("../utils/create-error");
const { registerSchema, loginSchema } = require("../validators/auth-validator");
const prisma = require("../models/prisma");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const emailDup = await prisma.user.findUnique({
      where: {
        email: value.email,
      },
    });
    if (emailDup) {
      return next(createError("email is already used", 400));
    }
    value.password = await bcrypt.hash(value.password, 12);

    const user = await prisma.user.create({
      data: value,
    });
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "qwertyuiopasdfghjkl",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    const kidProfile = await prisma.userProfile.create({
      data: {
        userProfileName: "Kids",
        favoriteGenres: "KID",
        profileImageUrl: null,
        userId: +user.id,
      },
    });

    res.status(201).json({ accessToken, user, kidProfile });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    console.log("dsdsd");
    if (error) {
      return next(error);
    }
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: value.emailOrMobile }, { mobile: value.emailOrMobile }],
      },
    });
    if (!user) {
      return next(createError("invalid credential", 400));
    }

    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return next(createError("Incorrect password. Please try again. ", 400));
    }
    const subscription = await stripe.subscriptions.retrieve(
      user.subscriptionId
    );
    if (subscription.status !== "active") {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isActive: false,
        },
      });
      user.isActive = false;
    }
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "1q2w3e4r5t6y7u8i9o0p",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    const allUserProfile = await prisma.userProfile.findMany({
      where: {
        userId: user.id,
      },
    });

    delete user.password;
    res.status(200).json({ accessToken, user, allUserProfile });
  } catch (error) {
    next(error);
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};
