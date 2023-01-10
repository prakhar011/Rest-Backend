const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const classValidation = require('../../validations/class.validation');
const classController = require('../../controllers/class.controller');

const router = express.Router();

router.route('/').get(auth('getStudents'),  classController.getClasses);

router
  .route('/:classId')
  .get(auth('getStudents'), validate(classValidation.getClass), classController.getClass)
  .patch(auth('manageStudents'), validate(classValidation.updateClass), classController.updateClass)
  .delete(auth('manageStudents'), validate(classValidation.deleteClass), classController.deleteClass);

module.exports = router;
