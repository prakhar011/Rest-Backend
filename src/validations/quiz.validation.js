const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createQuiz = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    date: Joi.date().required(),
    questions: Joi.array().items(
      Joi.object().keys({
        index: Joi.number().required(),
        question: Joi.string().required(),
        options: Joi.array().items(
          Joi.object().keys({
            index: Joi.number().required(),
            value: Joi.string().required(),
            marks: Joi.number().required(),
          })
        ),
      })
    ),
  }),
};

const getQuiz = {
  params: Joi.object().keys({
    quizName: Joi.string().required(),
  }),
};

const getQuizResult = {
  params: Joi.object().keys({
    quizId: Joi.string().custom(objectId),
  }),
};

const createQuizResult = {
  body: Joi.object().keys({
    student: Joi.string().custom(objectId).required(),
    quiz: Joi.string().custom(objectId).required(),
    answers: Joi.array().items(
      Joi.object().keys({
        index: Joi.number().required(),
        option: Joi.number().required(),
      })
    ),
  }),
};

const updateQuizResult = {
  body: Joi.object().keys({
    student: Joi.string().custom(objectId),
    quiz: Joi.string().custom(objectId),
    answers: Joi.array().items(
      Joi.object().keys({
        index: Joi.number(),
        option: Joi.number(),
      })
    ),
  }),
};

module.exports = {
  getQuiz,
  createQuiz,
  getQuizResult,
  createQuizResult,
  updateQuizResult,
};
