const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required().valid('student', 'parent', 'teacher', 'admin'),
    fullName: Joi.string().required(),
    details: Joi.alternatives().conditional('role', [
      {
        is: 'student',
        then: Joi.object().keys({
          admissionNo: Joi.number().required(),
          fullName: Joi.string().required(),
          gender: Joi.string().required().valid('male', 'female', 'other'),
          bloodGroup: Joi.string(),
          homeAddress: Joi.string(),
          fathersName: Joi.string().required(),
          mothersName: Joi.string().required(),
          parentsContact: Joi.string(),
          initialSection: Joi.string().required().trim(),
          initialClass: Joi.string().required().trim(),
          admissionYear: Joi.number().required(),
          dateOfBirth: Joi.date().required(),
        }),
      },
      {
        is: 'parent',
        then: Joi.object().keys({
          fullName: Joi.string().required(),
        }),
      },
      {
        is: 'teacher',
        then: Joi.object().keys({
          fullName: Joi.string().required(),
          class: Joi.string().custom(objectId),
          subjects: Joi.array().items(
            Joi.object().keys({
              name: Joi.string().required(),
              class: Joi.string().custom(objectId),
            })
          ),
        }),
      },
      {
        is: 'admin',
        then: Joi.object().keys({
          fullName: Joi.string().required(),
        }),
      },
    ]),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
