const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getTeachers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTeacher = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateTeacher = {
  params: Joi.object().keys({
    userId: Joi.custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      fullName: Joi.string(),
      dob: Joi.string(),
      gender: Joi.string(),
      emergencyContact: Joi.number(),
      bloodGroup: Joi.string(),
      dateOfJoining: Joi.string(),
      homeAddress: Joi.string(),
      class: Joi.string().custom(objectId),
      subjects: Joi.array().items(
        Joi.object().keys({
          name: Joi.string(),
          class: Joi.string().custom(objectId),
        })
      ),
      timetable: Joi.object().keys({
        monday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            class: Joi.string().required(),
            section: Joi.string().required(),
            subject: Joi.string().required(),
          })
        ),
        tuesday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            class: Joi.string().required(),
            section: Joi.string().required(),
            subject: Joi.string().required(),
          })
        ),
        wednesday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            class: Joi.string().required(),
            subject: Joi.string().required(),
            section: Joi.string().required(),
          })
        ),
        thursday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            class: Joi.string().required(),
            subject: Joi.string().required(),
            section: Joi.string().required(),
          })
        ),
        friday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            class: Joi.string().required(),
            subject: Joi.string().required(),
            section: Joi.string().required(),
          })
        ),
        saturday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            class: Joi.string().required(),
            subject: Joi.string().required(),
            section: Joi.string().required(),
          })
        ),
      }),
    })
    .min(1),
};

const deleteTeacher = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
};
