const Joi = require('joi');

module.exports.userValidSchema = Joi.object({
//         username: Joi.string()
//                 .min(3)
//                 .max(30),
//         password: Joi.string()
//                 .min(6)
//                 .required(),
//         email:  Joi.string()
//                 .email(),
//         mobile: Joi.string()
//                 .pattern(/^[789]\d{9}$/) // Indian mobile numbers start with 7, 8, or 9 and have a total of 10 digits
//                 .message('Please enter a valid mobile number').required(),
});

