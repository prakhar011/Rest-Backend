const httpStatus = require('http-status');
const { Quiz, QuizResult } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a quiz
 * @param {Object} quizBody
 * @returns {Promise<Quiz>}
 */
const createQuiz = async (quizBody) => {
  if (await Quiz.isNameTaken(quizBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Quiz name already taken');
  }
  const quiz = await Quiz.create(quizBody);
  return quiz;
};

/**
 * Get all quizzes
 * @returns {Promise<QueryResult>}
 */
const getAllQuiz = async () => {
  return Quiz.find();
};

/**
 * Get quiz by id
 * @param {String} id
 * @returns {Promise<Quiz>}
 */
const getQuizById = async (quizId) => {
  return Quiz.findById(quizId);
};

/**
 * Get quiz by name
 * @param {String} name
 * @returns {Promise<Quiz>}
 */
const getQuizByName = async (quizName) => {
  return Quiz.find({ name: quizName });
};

/**
 * Get quizResult by userId
 * @param {String} studentUserId
 * @returns {Promise<Quiz>}
 */
const getQuizResultByStudentUserId = async (studentUserId) => {
  return QuizResult.find({ student: studentUserId });
};

/**
 * Get quizResult by quizId
 * @param {String} quizId
 * @returns {Promise<Quiz>}
 */
const getQuizResultByQuizId = async (quizId) => {
  return Quiz.find({ quiz: quizId });
};

const createQuizResult = async (quizResultBody) => {
  const quizResult = await QuizResult.create(quizResultBody);
  return quizResult;
};

const updateQuizResult = async (updateBody) => {
  const quizResult = await QuizResult.find({ quiz: updateBody.quiz });
  if (!quizResult) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'QuizResult Not found');
  }

  Object.assign(quizResult, updateBody);
  await quizResult.save();

  return quizResult;
};

// /**
//  * Update quiz by name
//  * @param {String} quizName
//  * @param {Object} updateBody
//  * @returns {Promise<Quiz>}
//  */
// const updateQuizByName = async (quizName, updateBody) => {
//   const quiz = await getQuizByName(quizName);
//   if (!quiz) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
//   }
//   if (quizName.name && (await Quiz.isNameTaken(updateBody., userId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

// /**
//  * Delete user by id
//  * @param {ObjectId} userId
//  * @returns {Promise<User>}
//  */
// const deleteUserById = async (userId) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   await user.remove();
//   return user;
// };

module.exports = {
  createQuiz,
  getAllQuiz,
  getQuizByName,
  getQuizById,
  getQuizResultByStudentUserId,
  getQuizResultByQuizId,
  createQuizResult,
  updateQuizResult,
};
