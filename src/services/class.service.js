const httpStatus = require('http-status');
const { Class } = require('../models');
const ApiError = require('../utils/ApiError');

// /**
//  * Create a class
//  * @param {Object} classBody
//  * @returns {Promise<Classs>}
//  */
// const createClass = async (classBody) => {
//   const classs = await Class.create(classBody);
//   return classs;
// };

/**
 * Query for announcements
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClasses = async (filter, options) => {
  const classes = await Class.find();
  return classes;
};

/**
 * Get class by id
 * @param {ObjectId} id
 * @returns {Promise<Class>}
 */
const getClassById = async (id) => {
  return Class.findById(id);
};

/**
 * Update class by id
 * @param {ObjectId} classId
 * @param {Object} updateBody
 * @returns {Promise<Class>}
 */
const updateClassById = async (classId, updateBody) => {
  const classs = await getClassById(classId);
  if (!classs) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  Object.assign(classs, updateBody);
  await classs.save();
  return classs;
};

/**
 * Delete class by id
 * @param {ObjectId} classId
 * @returns {Promise<Class>}
 */
const deleteClassById = async (classId) => {
  const classs = await getClassById(classId);
  if (!classs) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  await classs.remove();
  return classs;
};

module.exports = {
  queryClasses,
  getClassById,
  updateClassById,
  deleteClassById,
};
