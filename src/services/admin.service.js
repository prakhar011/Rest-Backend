const httpStatus = require('http-status');
const { Admin } = require('../models');
const ApiError = require('../utils/ApiError');

const createAdmin = async (adminBody) => {
  const admin = await Admin.create(adminBody);

  return admin;
};

const getAdminById = async (id) => {
  return Admin.findById(id);
};

const deleteAdminById = async (id) => {
  const admin = await getAdminById(id);

  if (!admin) throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');

  await admin.remove();

  return admin;
};

module.exports = {
  createAdmin,
  getAdminById,
  deleteAdminById,
};
