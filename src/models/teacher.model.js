const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const teacherSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  emergencyContact: {
    type: Number,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    required: true,
  },
  homeAddress: {
    type: String,
    required: true,
  },
  subjects: [
    {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      class: {
        type: mongoose.Schema.Types.ObjectId,
        requied: true,
        ref: 'Class',
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  timetable: {
    monday: [
      {
        from: Date,
        to: Date,
        class: String,
        section: String,
        subject: String,
      },
    ],
    tuesday: [
      {
        from: Date,
        to: Date,
        class: String,
        section: String,
        subject: String,
      },
    ],
    wednesday: [
      {
        from: Date,
        to: Date,
        class: String,
        subject: String,
        section: String,
      },
    ],
    thursday: [
      {
        from: Date,
        to: Date,
        class: String,
        subject: String,
        section: String,
      },
    ],
    friday: [
      {
        from: Date,
        to: Date,
        class: String,
        subject: String,
        section: String,
      },
    ],
    saturday: [
      {
        from: Date,
        to: Date,
        class: String,
        subject: String,
        section: String,
      },
    ],
  },
});

teacherSchema.plugin(toJSON);
teacherSchema.plugin(paginate);

/**
 * @typedef Teacher
 */
const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
