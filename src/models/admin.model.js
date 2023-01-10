const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const adminSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

adminSchema.plugin(toJSON);
adminSchema.plugin(paginate);

/**
 * @typedef Admin
 */
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
