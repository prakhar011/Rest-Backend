const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { classService } = require('../services');

// const createClass = catchAsync(async (req, res) => {
//   const classs = await classService.createClass(req.body);
//   res.status(httpStatus.CREATED).send(classs);
// });

const getClasses = catchAsync(async (req, res) => {
  const result = await classService.queryClasses();
  res.send(result);
});

const getClass = catchAsync(async (req, res) => {
  const classs = await classService.getClassById(req.params.classId);
  if (!classs) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  res.send(classs);
});

const updateClass = catchAsync(async (req, res) => {
  const classs = await classService.updateClassById(req.params.classId, req.body);
  res.send(classs);
});

const deleteClass = catchAsync(async (req, res) => {
  await classService.deleteClassById(req.params.classId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getClasses,
  getClass,
  updateClass,
  deleteClass,
};
