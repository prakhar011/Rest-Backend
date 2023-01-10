const httpStatus = require('http-status');
const { Academics } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an announcement
 * @param {Object} academicsBody
 * @returns {Promise<Announcement>}
 */
const createAcademics = async (academicsBody) => {
  const academics = await Academics.create(academicsBody);
  return academics;
};

// /**
//  * Query for announcements
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */
// const queryAnnouncements = async (filter, options) => {
//   const announcements = await Announcement.paginate(filter, options);
//   return announcements;
// };

/**
 * Get academics by studentId
 * @param {ObjectId} studentId
 * @returns {Promise<Academics>}
 */
const getAcademicsById = async (studentId) => {
  return Academics.findById(studentId);
};

/**
 * Update academics by id
 * @param {ObjectId} studentId
 * @param {Object} updateBody
 * @returns {Promise<Academics>}
 */
const updateAcademicsById = async (academicsId, updateBody) => {
  const academics = await getAcademicsById(academicsId);
  if (!academics) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student Academics not found');
  }
  Object.assign(academics, updateBody);
  await academics.save();
  return academics;
};

/**
 * Delete academics by id
 * @param {ObjectId} studentId
 * @returns {Promise<Academics>}
 */
const deleteAcademicsById = async (studentId) => {
  const academics = await getAcademicsById(studentId);
  if (!academics) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Academics not found');
  }
  await academics.remove();
  return academics;
};

module.exports = {
  createAcademics,
  // queryAnnouncements,
  getAcademicsById,
  updateAcademicsById,
  deleteAcademicsById,
};
