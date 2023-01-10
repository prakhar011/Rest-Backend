const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const classSchema = mongoose.Schema({
  standard: String,
  section: String,
  studentList: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: {
        type: String,
      },
      optedSubjects: {
        type: String,
      },
    },
  ],
  subjects: {
    curricular: [
      {
        type: String,
        required: true,
      },
    ],
    cocurricular: [
      {
        type: String,
        required: true,
      },
    ],
  },
  exams: {
    curricular: [
      {
        examName: {
          type: String,
          required: true,
        },
        maxMarks: {
          type: Number,
          required: true,
        },
        weightage: {
          type: Number,
          required: true,
        },
      },
    ],
    cocurricular: [
      {
        examName: {
          type: String,
          required: true,
        },
        maxMarks: {
          type: Number,
          required: true,
        },
        weightage: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  academics: {
    curricular: [
      {
        subject: String,
        average: Number,
        averageOf: Number,
        unit: String,
      },
    ],
    cocurricular: [
      {
        subject: String,
        average: Number,
        averageOf: Number,
        unit: String,
        total: Number,
      },
    ],
    attendance: {
      average: Number,
      averageOf: Number,
    },
  },
  sessionStart: {
    type: String,
  },
  sessionEnd: {
    type: String,
  },
  timetable: {
    monday: [
      {
        from: Date,
        to: Date,
        subject: String,
        teacher: String,
      },
    ],
    tuesday: [
      {
        from: Date,
        to: Date,
        subject: String,
        teacher: String,
      },
    ],
    wednesday: [
      {
        from: Date,
        to: Date,
        subject: String,
        teacher: String,
      },
    ],
    thursday: [
      {
        from: Date,
        to: Date,
        subject: String,
        teacher: String,
      },
    ],
    friday: [
      {
        from: Date,
        to: Date,
        subject: String,
        teacher: String,
      },
    ],
    saturday: [
      {
        from: Date,
        to: Date,
        subject: String,
        teacher: String,
      },
    ],
  },
});

// plugin that converts mongoose to JSON
classSchema.plugin(toJSON);
classSchema.plugin(paginate);

/**
 * @typedef Class
 */
const Class = mongoose.model('Class', classSchema);

module.exports = Class;
