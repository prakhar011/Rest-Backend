const mongoose = require('mongoose');

const quizResultSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student',
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Quiz',
  },
  answers: [
    {
      index: Number,
      option: Number,
    },
  ],
});

/**
 * @typedef QuizResult
 */
const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
