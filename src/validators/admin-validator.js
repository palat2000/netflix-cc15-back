const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-z0-9]{6,30}$/)
    .trim()
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-z0-9]{6,30}$/)
    .trim()
    .required(),
});

exports.registerSchema = registerSchema;

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

exports.loginSchema = loginSchema;
