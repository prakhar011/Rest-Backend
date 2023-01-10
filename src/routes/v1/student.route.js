const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const studentValidation = require('../../validations/student.validation');
const studentController = require('../../controllers/student.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('getStudents'), validate(studentValidation.getStudents), studentController.getStudents)
  .patch(auth('manageStudents'), validate(studentValidation.updateMultiAcademics), studentController.updateMultiAcademics);

router
  .route('/:userId')
  .get(auth('getStudents'), validate(studentValidation.getStudent), studentController.getStudent)
  .patch(auth('manageStudents'), validate(studentValidation.updateStudent), studentController.updateStudent)
  .delete(auth('manageStudents'), validate(studentValidation.deleteStudent), studentController.deleteStudent);

router
  .route('/:userId/academics')
  .get(auth('getStudents'), validate(studentValidation.getAcademics), studentController.getAcademics)
  .patch(auth('manageStudents'), validate(studentValidation.updateAcademics), studentController.updateAcademics);

router
  .route('/academics')
  .get(auth('getStudents'), validate(studentValidation.getAllAcademics), studentController.getAllAcademics);

router.route('/:userId/getStats').get(auth('getStudents'), validate(studentValidation.getStats), studentController.getStats);
module.exports = router;
