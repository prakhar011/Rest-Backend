const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const studentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  admissionNo: {
    type: Number,
    required: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    enum: ['male', 'female', 'other'],
  },
  bloodGroup: String,
  homeAddress: String,
  fathersName: {
    type: String,
    required: true,
  },
  mothersName: {
    type: String,
    required: true,
  },
  parentsContact: String,
  initialSection: {
    type: String,
    required: true,
    trim: true,
  },
  initialClass: {
    type: String,
    required: true,
    trim: true,
  },
  currentSection: {
    type: String,
    required: true,
    trim: true,
  },
  currentClass: {
    type: String,
    required: true,
    trim: true,
  },
  admissionYear: {
    type: Number,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  academics: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Academics',
  },
});

// add plugin that converts mongoose to json
studentSchema.plugin(toJSON);
studentSchema.plugin(paginate);

/**
 * Check if admissionNo taken
 * @param {string} admissionNo - Student's admission number
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
studentSchema.statics.isAdmissionNoTaken = async function (admissionNo, excludeUserId) {
  const student = await this.findOne({ admissionNo, _id: { $ne: excludeUserId } });
  return !!student;
};

/**
 * @typedef Student
 */
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
