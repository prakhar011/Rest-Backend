const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const announcementSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    header: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['general', 'single_section', 'single_class', 'teachers'],
      default: 'general',
    },
    attachments: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
announcementSchema.plugin(toJSON);
announcementSchema.plugin(paginate);

/**
 * @typedef Announcement
 */
const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
