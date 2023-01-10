const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// subject array to be added, constants
const academicsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  curricular: [
    {
      subject: {
        type: String,
        required: true,
        trim: true,
      },
      score: {
        type: Number,
        required: true,
        trim: true,
        min: 0,
      },
      unit: {
        type: String, // Do compute avg for each unit test
        required: true,
        trim: true,
      },
      date: {
        type: Date,
        required: true,
        trim: true,
      },
    },
  ],
  cocurricular: [
    {
      subject: {
        type: String,
        required: true,
        trim: true,
      },
      score: {
        type: Number,
        required: true,
        trim: true,
        min: 0,
      },
      unit: {
        type: String, // Do compute avg for each unit test
        required: true,
        trim: true,
      },
      date: {
        type: Date,
        required: true,
        trim: true,
      },
    },
  ],
  attendance: [
    {
      date: Date,
      present: Boolean,
    },
  ],
});

// add plugin that converts mongoose to json
academicsSchema.plugin(toJSON);
academicsSchema.plugin(paginate);

/**
 * @typedef Academics
 */
const Academics = mongoose.model('Academics', academicsSchema);

module.exports = Academics;
