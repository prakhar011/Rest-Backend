const httpStatus = require('http-status');
const { BigFiveResult } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a bigFive Result
 * @param {Object} resultBody
 * @returns {Promise<BigFiveResult>}
 */
const createResult = async (resultBody) => {
  const result = await BigFiveResult.create(resultBody);
  return result;
};

/**
 * Fetches a bigFive Result
 * @param {ObjectId} id
 * @returns {Promise<BigFiveResult>}
 */
const getResultById = async (id) => {
  const result = await BigFiveResult.findById(id);
  return result;
};

module.exports = {
  createResult,
  getResultById,
};
