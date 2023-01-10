const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getClass = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId),
  }),
};

const updateClass = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      subjects: Joi.object().keys({
        curricular: Joi.array().items(Joi.string()).required(),
        cocurricular: Joi.array().items(Joi.string()).required(),
      }),
      exams: Joi.object().keys({
        curricular: Joi.array().items(
          Joi.object().keys({
            examName: Joi.string().required(),
            maxMarks: Joi.number().required(),
            weightage: Joi.number().required(),
          })
        ),
        cocurricular: Joi.array().items(
          Joi.object().keys({
            examName: Joi.string().required(),
            maxMarks: Joi.number().required(),
            weightage: Joi.number().required(),
          })
        ),
      }),
      sessionStart: Joi.string(),
      sessionEnd: Joi.string(),

      timetable: Joi.object().keys({
        monday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            subject: Joi.string().required(),
            teacher: Joi.string(),
          })
        ),
        tuesday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            subject: Joi.string().required(),
            teacher: Joi.string(),
          })
        ),
        wednesday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            subject: Joi.string().required(),
            teacher: Joi.string(),
          })
        ),
        thursday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            subject: Joi.string().required(),
            teacher: Joi.string(),
          })
        ),
        friday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            subject: Joi.string().required(),
            teacher: Joi.string(),
          })
        ),
        saturday: Joi.array().items(
          Joi.object().keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
            subject: Joi.string().required(),
            teacher: Joi.string(),
          })
        ),
      }),
    })
    .max(1)
    .min(1),
};

const deleteClass = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getClass,
  updateClass,
  deleteClass,
};
