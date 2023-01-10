const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { teacherService } = require('../services');

const getTeachers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['admissionYear']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await teacherService.queryTeachers(filter, options);
  res.send(result);
});

const getTeacher = catchAsync(async (req, res) => {
  const teacher = await teacherService.getTeacherByUserId(req.params.userId);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not found');
  }
  res.send(teacher);
});

const updateTeacher = catchAsync(async (req, res) => {
  const teacher = await teacherService.updateTeacherByUserId(req.params.userId, req.body);
  res.send(teacher);
});

const deleteTeacher = catchAsync(async (req, res) => {
  await teacherService.deleteTeacherByUserId(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAcademics = catchAsync(async (req, res) => {
  const academics = await teacherService.getAcademicsByUserId(req.params.userId);
  if (!academics) throw new ApiError(httpStatus.NOT_FOUND, 'Academics not found');
  res.send(academics);
});

const updateAcademics = catchAsync(async (req, res) => {
  console.log(req.body);
  const academics = await teacherService.updateAcademicsByUserId(req.params.userId, req.body);
  res.send(academics);
});

module.exports = {
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  getAcademics,
  updateAcademics,
};
