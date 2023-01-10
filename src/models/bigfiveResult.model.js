const mongoose = require('mongoose');

const bigFiveResultSchema = mongoose.Schema({
  id: String,
  results: [
    {
      domain: String,
      title: String,
      shortDescription: String,
      description: String,
      scoreText: String,
      count: Number,
      score: Number,
      facets: [
        {
          facet: Number,
          title: String,
          text: String,
          score: Number,
          count: Number,
          scoreText: {
            type: String,
            enum: ['high', 'low', 'neutral'],
          },
        },
      ],
      text: String,
    },
  ],
});

/**
 * @typedef BigFiveResult
 */
const BigFiveResult = mongoose.model('BigFiveResult', bigFiveResultSchema);

module.exports = BigFiveResult;
