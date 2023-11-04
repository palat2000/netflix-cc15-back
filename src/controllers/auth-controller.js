const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const stripe = require("stripe")(process.env.STRIPE_API_TEST_KEY);
const createError = require("../utils/create-error");
const { registerSchema, loginSchema } = require("../validators/auth-validator");
const prisma = require("../models/prisma");

exports.checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailRegis = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
      },
    });

    let emailKey = "";
    let message = "";

    if (!emailRegis) {
      throw createError("email not found", 404);
    }
    emailKey = emailRegis;
    message = "email found";

    res.status(200).json({ emailKey, message });
  } catch (error) {
    next(error);
  }
};

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
        isKid: true,
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
    if (error) {
      return next(error);
    }
    const user = await prisma.user.findUnique({
      where: {
        email: value.email,
      },
    });

    if (!user) {
      return next(
        createError(
          "Sorry, we can't find an account with this email address. Please try again or create a new account. ",
          400
        )
      );
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
      process.env.JWT_SECRET_KEY || "qwertyuiopasdfghjkl",
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

exports.chooseProfile = async (req, res, next) => {
  try {
    console.log(req.body, "req body");
    const payload = { userProfileId: req.body.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "qwertyuiopasdfghjkl",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    const userProfile = await prisma.userProfile.findFirst({
      where: {
        id: +req.body.id,
      },
    });

    res.status(200).json({ accessToken, userProfile });
  } catch (error) {
    next(error);
  }
};
