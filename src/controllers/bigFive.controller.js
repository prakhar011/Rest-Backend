const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bigFiveService } = require('../services');

const getResult = catchAsync(async (req, res) => {
  const result = await bigFiveService.getResultById(req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BigFive Result not found');
  }
  res.send(result);
});

const createResult = catchAsync(async (req, res) => {
  const newResult = await bigFiveService.createResult({ _id: req.params.id, results: req.body });
  return res.status(httpStatus.CREATED).send(newResult);
});

// const getClasses = catchAsync(async (req, res) => {
//   const result = await classService.queryClasses();
//   res.send(result);
// });

// const updateClass = catchAsync(async (req, res) => {
//   const classs = await classService.updateClassById(req.params.classId, req.body);
//   res.send(classs);
// });

// const deleteClass = catchAsync(async (req, res) => {
//   await classService.deleteClassById(req.params.classId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  createResult,
  getResult,
  //   getClasses,
  //   updateClass,
  //   deleteClass,
};
