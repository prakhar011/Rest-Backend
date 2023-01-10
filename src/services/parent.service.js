const httpStatus = require('http-status');
const { Parent } = require('../models');

const createParent = async (parentBody) => {
  const parent = await Parent.create(parentBody);

  return parent;
};

const getParentById = async (id) => {
  return Parent.findById(id);
};

const deleteParentById = async (id) => {
  const parent = await getParentById(id);

  if (!parent) throw new ApiError(httpStatus.NOT_FOUND, 'Parent not found');

  await parent.remove();

  return parent;
};

module.exports = {
  createParent,
  getParentById,
  deleteParentById,
};
