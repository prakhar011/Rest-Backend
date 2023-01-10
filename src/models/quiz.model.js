const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
  name: String,
  date: Date,
  questions: [
    {
      index: Number,
      question: String,
      options: [
        {
          index: Number,
          value: String,
          marks: Number,
        },
      ],
    },
  ],
});

/**
 * Check if quizName is taken
 * @param {string} quizName - Name of Quiz
 * @return {Promise<boolean>}
 */
quizSchema.statics.isNameTaken = async function (quizName) {
  const quiz = await this.findOne({ name: quizName });
  return !!quiz;
};

/**
 * @typedef Quiz
 */
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
