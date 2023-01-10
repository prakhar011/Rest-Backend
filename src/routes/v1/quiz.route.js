const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const quizValidation = require('../../validations/quiz.validation');
const quizController = require('../../controllers/quiz.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('getStudents'), quizController.getAllQuiz)
  .post(auth('manageStudents'), validate(quizValidation.createQuiz), quizController.createQuiz);

router.route('/:quizName').get(auth('getStudents'), validate(quizValidation.getQuiz), quizController.getQuiz);
//   .patch(auth('manageStudents'), validate(qui), studentController.updateStudent)
//   .delete(auth('manageStudents'), validate(studentValidation.deleteStudent), studentController.deleteStudent);

router
  .route('/:quizId/result')
  .get(auth('getStudents'), validate(quizValidation.getQuizResult), quizController.getQuizResult)
  .post(auth('getStudents'), validate(quizValidation.createQuizResult), quizController.createQuizResult)
  .patch(auth('getStudents'), validate(quizValidation.updateQuizResult), quizController.updateQuizResult);

module.exports = router;
