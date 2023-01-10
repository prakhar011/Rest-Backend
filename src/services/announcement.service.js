const httpStatus = require('http-status');
const { Announcement } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an announcement
 * @param {Object} announcementBody
 * @returns {Promise<Announcement>}
 */
const createAnnouncement = async (announcementBody, files) => {
  const att = [];
  for (let index = 0; index < files.length; index += 1) {
    att.push({ name: files[index].key, url: files[index].location });
  }
  Object.assign(announcementBody, { attachments: att });
  // console.log(announcementBody);
  const announcement = await Announcement.create(announcementBody);
  return announcement;
};

/**
 * Query for announcements
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAnnouncements = async (filter, options) => {
  const announcements = await Announcement.paginate(filter, options);
  return announcements;
};

/**
 * Get announcement by id
 * @param {ObjectId} id
 * @returns {Promise<Announcement>}
 */
const getAnnouncementById = async (id) => {
  return Announcement.findById(id);
};

/**
 * Update announcement by id
 * @param {ObjectId} announcementId
 * @param {Object} updateBody
 * @returns {Promise<Announcement>}
 */
const updateAnnouncementById = async (announcementId, updateBody) => {
  const announcement = await getAnnouncementById(announcementId);
  if (!announcement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Announcement not found');
  }
  Object.assign(announcement, updateBody);
  await announcement.save();
  return announcement;
};

/**
 * Delete announcement by id
 * @param {ObjectId} announcementId
 * @returns {Promise<Announcement>}
 */
const deleteAnnouncementById = async (announcementId) => {
  const announcement = await getAnnouncementById(announcementId);
  // Todo s3 deletion function
  if (!announcement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Announcement not found');
  }
  await announcement.remove();
  return announcement;
};

module.exports = {
  createAnnouncement,
  queryAnnouncements,
  getAnnouncementById,
  updateAnnouncementById,
  deleteAnnouncementById,
};
