const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const parentSchema = mongoose.Schema({
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

// custom plugins
parentSchema.plugin(toJSON);
parentSchema.plugin(paginate);

/**
 * @typedef Parent
 */
const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
