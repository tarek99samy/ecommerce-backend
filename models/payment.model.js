const joi = require('joi');

const createSchema = joi.object({
  user_id: joi.number().required().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number',
    'any.required': 'User id is required'
  }),
  ad_id: joi.number().required().min(1).messages({
    'number.min': 'Ad id must be at least 1',
    'number.base': 'Ad id must be a number',
    'any.required': 'Ad id is required'
  }),
  datetime: joi
    .string()
    .pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Datetime must be in YYYY-MM-DD HH:mm:ss format',
      'any.required': 'Datetime is required'
    }),
  status_id: joi.number().required().min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number',
    'any.required': 'Status id is required'
  })
});

module.exports = { createSchema };
