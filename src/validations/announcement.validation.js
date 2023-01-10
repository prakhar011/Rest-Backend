const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAnnouncement = {
  body: Joi.object().keys({
    announcementBody: Joi.object().keys({
      createdBy: Joi.required().custom(objectId),
      content: Joi.string().required(),
      header: Joi.string().required(),
      type: Joi.string().required().valid('general', 'single_section', 'single_class'),
      attachments: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          url: Joi.string().required(),
        })
      ),
    }),
  }),
};

const getAnnouncements = {
  query: Joi.object().keys({
    type: Joi.string().valid('general', 'single_section', 'single_class'),
    createdBy: Joi.custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string(),
  }),
};

const getAnnouncement = {
  params: Joi.object().keys({
    announcementId: Joi.string().custom(objectId),
  }),
};

const updateAnnouncement = {
  params: Joi.object().keys({
    announcementId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      createdBy: Joi.custom(objectId),
      content: Joi.string(),
      header: Joi.string(),
      type: Joi.string(),
      attachments: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          url: Joi.string().required(),
        })
      ),
    })
    .min(1),
};

const deleteAnnouncement = {
  params: Joi.object().keys({
    announcementId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
