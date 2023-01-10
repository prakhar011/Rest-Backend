const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const bigFiveValidation = require('../../validations/bigFive.validation');
const bigFiveController = require('../../controllers/bigFive.controller');

const router = express.Router();

router.route('/:id').get(auth('getStudents'), bigFiveController.getResult).post(bigFiveController.createResult);
//   .post(auth('manageStudents'), validate(bigFiveValidation.createResult), bigFiveController.createResult);

module.exports = router;
