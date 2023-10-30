const prisma = require("../models/prisma");

exports.getAllProfile = async (req, res, next) => {
  console.log(req.user.id, "userId");
  try {
    const allUserProfile = await prisma.userProfile.({
      where: {
        userId: req.user.id,
      },
    });
    console.log(allUserProfile);

    delete user.password;
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    delete user.password;
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

exports.createUserProfile = async (req, res, next) => {
  try {
    const { message } = req.body;
    if ((!message || !message.trim()) && !req.file) {
      return next(createError("title or image is required", 400));
    }

    const data = { userId: req.user.id };
    if (req.file) {
      data.image = await upload(req.file.path);
    }
    if (message) {
      data.message = message;
    }

    const post = await prisma.post.create({
      data: data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });
    res.status(201).json({ message: "userProfile created", post });
  } catch (error) {
    next(error);
  }
};
