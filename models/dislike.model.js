const joi = require('joi');

const createSchema = joi.object({
  article_id: joi.number().required().min(1).messages({
    'number.min': 'Article id must be at least 1',
    'number.base': 'Article id must be a number',
    'any.required': 'Article id is required'
  }),
  user_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number'
  })
});

module.exports = { createSchema };
