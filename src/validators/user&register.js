const Joi = require('joi')

const registerSchema = Joi.object({
    emailOroPhoneNumber:Joi.alternatives([
        Joi.string().email(),
        Joi.string().pattern(/^[0-9]{10}$/)]).required().strip(),
        password: Joi.string().pattern(/^[a-zA-z0-9]{6,30}$/).trim().required(),
        mobile: Joi.forbidden().when('emailOrMobile', {
            is: Joi.string().pattern(/^[0-9]{10}$/),
            then: Joi.string().default(Joi.ref('emailOrMobile'))
        }),
        email: Joi.forbidden().when('emailOrMobile', {
            is: Joi.string().email(),
            then: Joi.string().default(Joi.ref('emailOrMobile'))
        }
        )
})

exports.registerSchema = registerSchema;


const loginSchema = Joi.object({
    emailOrMobile: Joi.string().required(),
    password:Joi.string().required()
});

exports.loginSchema = loginSchema;