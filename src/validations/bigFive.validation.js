const Joi = require('joi');

const createResult = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.array().items(
    Joi.object().keys({
      domain: Joi.string().required(),
      title: Joi.string().required(),
      shortDescription: Joi.string().required(),
      description: Joi.string().required(),
      scoreText: Joi.string().required(),
      count: Joi.number().required(),
      score: Joi.number().required(),
      facets: Joi.array().items(
        Joi.object().keys({
          facet: Joi.number().required(),
          title: Joi.string().required(),
          text: Joi.string().required(),
          score: Joi.number().required(),
          scoreText: Joi.string().valid('high', 'low', 'neutral').required(),
        })
      ),
    })
  ),
};

module.exports = {
  createResult,
};
