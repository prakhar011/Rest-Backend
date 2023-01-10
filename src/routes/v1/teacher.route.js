const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const teacherValidation = require('../../validations/teacher.validation');
const teacherController = require('../../controllers/teacher.controller');

const router = express.Router();

router.route('/').get(auth('getStudents'), validate(teacherValidation.getTeachers), teacherController.getTeachers);

router
  .route('/:userId')
  .get(auth('getStudents'), validate(teacherValidation.getTeacher), teacherController.getTeacher)
  .patch(auth('manageTeachers'), validate(teacherValidation.updateTeacher), teacherController.updateTeacher)
  .delete(auth('manageTeachers'), validate(teacherValidation.deleteTeacher), teacherController.deleteTeacher);

// router
//   .route('/:userId/academics')
//   .get(auth('getTeachers'), validate(teacherValidation.getAcademics), teacherController.getAcademics)
//   .patch(auth('manageTeachers'), validate(teacherValidation.updateAcademics), teacherController.updateAcademics);

module.exports = router;
