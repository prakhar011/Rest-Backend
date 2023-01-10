const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createStudent = {
  body: Joi.object().keys({
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
};

const getStudents = {
  query: Joi.object().keys({
    admissionYear: Joi.number(),
    currentClass: Joi.string(),
    currentSection: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string(),
  }),
};

const getStudent = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateStudent = {
  params: Joi.object().keys({
    userId: Joi.custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      fullName: Joi.string(),
      gender: Joi.string().valid('male', 'female', 'other'),
      bloodGroup: Joi.string(),
      homeAddress: Joi.string(),
      fathersName: Joi.string(),
      mothersName: Joi.string(),
      parentsContact: Joi.string(),
      initialSection: Joi.string(),
      initialClass: Joi.string(),
      admissionYear: Joi.number(),
      email: Joi.string().email(),
      dateOfBirth: Joi.string(),
    })
    .min(1),
};

const deleteStudent = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getAcademics = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getAllAcademics = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateAcademics = {
  params: Joi.object().keys({
    userId: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    curricular: Joi.array().items(
      Joi.object().keys({
        subject: Joi.string().required(),
        score: Joi.number().required(),
        unit: Joi.string().required(),
        date: Joi.date(),
      })
    ),
    cocurricular: Joi.array().items(
      Joi.object().keys({
        subject: Joi.string().required(),
        score: Joi.number().required(),
        unit: Joi.string().required(),
        date: Joi.date(),
      })
    ),
    attendance: Joi.array().items(
      Joi.object().keys({
        date: Joi.date(),
        present: Joi.boolean().required(),
      })
    ),
  }),
};

const updateMultiAcademics = {
  body: Joi.array().items(
    Joi.object().keys({
      userId: Joi.custom(objectId).required(),
      curricular: Joi.array().items(
        Joi.object().keys({
          subject: Joi.string().required(),
          score: Joi.number().required(),
          unit: Joi.string().required(),
          date: Joi.date(),
        })
      ),
      cocurricular: Joi.array().items(
        Joi.object().keys({
          subject: Joi.string().required(),
          score: Joi.number().required(),
          unit: Joi.string().required(),
          date: Joi.date(),
        })
      ),
      attendance: Joi.array().items(
        Joi.object().keys({
          date: Joi.date(),
          present: Joi.boolean().required(),
        })
      ),
    })
  ),
};

const getStats = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    isAcademics: Joi.string().required(),
  }),
};

module.exports = {
  getStats,
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getAcademics,
  updateAcademics,
  updateMultiAcademics,
  getAllAcademics,
};
