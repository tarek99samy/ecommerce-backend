const joi = require('joi');

const createSchema = joi.object({
  user_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number'
  }),
  article_id: joi.number().required().min(1).messages({
    'number.min': 'Article id must be at least 1',
    'number.base': 'Article id must be a number',
    'any.required': 'Article id is required'
  }),
  description: joi.string().required().min(1).max(500).messages({
    'string.min': 'Description must be at least 1 character',
    'string.max': 'Description must be at most 500 characters',
    'any.required': 'Description is required'
  }),
  datetime: joi.date().optional()
});

const editSchema = joi.object({
  description: joi.string().required().min(1).max(500).messages({
    'string.min': 'Description must be at least 1 character',
    'string.max': 'Description must be at most 500 characters',
    'any.required': 'Description is required'
  })
});

module.exports = { createSchema, editSchema };
