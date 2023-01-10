const httpStatus = require('http-status');
const { Teacher } = require('../models');
const ApiError = require('../utils/ApiError');

const createTeacher = async (teacherBody) => {
  const teacher = await Teacher.create(teacherBody);
  return teacher;
};

const queryTeachers = async (filter, options) => {
  const teachers = await Teacher.paginate(filter, options);
  return teachers;
};

const getTeacherById = async (id) => {
  return Teacher.findById(id).populate('class').populate('class').populate('subjects');
};

const getTeacherByUserId = async (userId) => {
  return Teacher.findOne({ user: userId }).populate('class').populate('subjects.class');
};

const updateTeacherByUserId = async (userId, updateBody) => {
  const teacher = await getTeacherByUserId(userId);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not found');
  }
  Object.assign(teacher, updateBody);
  await teacher.save();
  return teacher;
};

const deleteTeacherByUserId = async (userId) => {
  const teacher = await getTeacherByUserId(userId);
  if (!teacher) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not found');

  await teacher.remove();
  return teacher;
};

module.exports = {
  createTeacher,
  queryTeachers,
  getTeacherById,
  getTeacherByUserId,
  updateTeacherByUserId,
  deleteTeacherByUserId,
};
