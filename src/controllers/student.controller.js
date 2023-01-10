const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { studentService } = require('../services');

const getStudents = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['admissionYear', 'currentClass', 'currentSection']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await studentService.queryStudents(filter, options);
  res.send(result);
});

const getStudent = catchAsync(async (req, res) => {
  const student = await studentService.getStudentByUserId(req.params.userId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  const studentClass = await studentService.getClassByStdAndSection(student.currentClass, student.currentSection);
  if (!studentClass) throw new ApiError(httpStatus.NOT_FOUND, 'Student Class not found');
  const date = new Date();
  const ISToffSet = 330;
  const currentDate = new Date(date.getTime() + ISToffSet);
  res.send({ student, class: studentClass, currentTime: currentDate });
});

const updateStudent = catchAsync(async (req, res) => {
  const student = await studentService.updateStudentByUserId(req.params.userId, req.body);
  res.send(student);
});

const deleteStudent = catchAsync(async (req, res) => {
  await studentService.deleteStudentByUserId(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAcademics = catchAsync(async (req, res) => {
  const academics = await studentService.getAcademicsByUserId(req.params.userId);
  if (!academics) throw new ApiError(httpStatus.NOT_FOUND, 'Academics not found');
  res.send(academics);
});

const getAllAcademics = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await studentService.getAllAcademics(filter, options);
  res.send(result);
});

const updateAcademics = catchAsync(async (req, res) => {
  // console.log(req.body);
  const academics = await studentService.updateAcademicsByUserId(req.params.userId, req.body);
  res.send(academics);
});

const updateMultiAcademics = catchAsync(async (req, res) => {
  // console.log('update multi academics called');
  const academics = await studentService.updateMultiAcademicsByUserId(req.body);
  res.send(academics);
});

const getStats = catchAsync(async (req, res) => {
  const stats = await studentService.getStats(req.params.userId, req.query.isAcademics);

  if (!stats) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stats not found');
  }
  res.send(stats);
});

module.exports = {
  getStats,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getAcademics,
  getAllAcademics,
  updateAcademics,
  updateMultiAcademics,
};
