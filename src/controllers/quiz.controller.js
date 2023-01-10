const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { quizService } = require('../services');

const createQuiz = catchAsync(async (req, res) => {
  const quiz = await quizService.createQuiz(req.body);
  res.status(httpStatus.CREATED).send(quiz);
});

const getAllQuiz = catchAsync(async (req, res) => {
  const result = await quizService.getAllQuiz();
  if (req.user.role === 'student') {
    const quizesCompleted = await quizService.getQuizResultByStudentUserId(req.user._id);
    return res.send({ currentTime: new Date().toISOString(), result, quizesCompleted });
  } else {
    return res.send({ currentTime: new Date().toISOString(), result });
  }
});

const getQuiz = catchAsync(async (req, res) => {
  const quiz = await quizService.getQuizByName(req.params.quizName);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }
  res.send(quiz);
});

const createQuizResult = catchAsync(async (req, res) => {
  const quizResult = await quizService.createQuizResult(req.body);
  res.status(httpStatus.CREATED).send(quizResult);
});

const updateQuizResult = catchAsync(async (req, res) => {
  const quizResult = await quizService.updateQuizResult(req.body);
  res.status(httpStatus.CREATED).send(quizResult);
});

const getQuizResult = catchAsync(async (req, res) => {
  const quizResult = await quizService.getQuizResultByQuizId(req.params.quizId);
  if (!quizResult) {
    throw new ApiError(httpStatus.NOT_FOUND, 'QuizResult not found');
  }
  res.send(quizResult);
});

// const updateClass = catchAsync(async (req, res) => {
//   const classs = await classService.updateClassById(req.params.classId, req.body);
//   res.send(classs);
// });

// const deleteClass = catchAsync(async (req, res) => {
//   await classService.deleteClassById(req.params.classId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  getAllQuiz,
  getQuiz,
  createQuiz,
  getQuizResult,
  updateQuizResult,
  createQuizResult,
};
