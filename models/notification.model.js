const joi = require('joi');

const createSchema = joi.object({
  user_id: joi.number().required().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number',
    'any.required': 'User id is required'
  }),
  title: joi.string().required().min(1).max(150).messages({
    'string.min': 'Title must be at least 1 character',
    'string.max': 'Title must be at most 150 characters',
    'any.required': 'Title is required'
  }),
  description: joi.string().required().min(1).max(300).messages({
    'string.min': 'Description must be at least 1 character',
    'string.max': 'Description must be at most 300 characters',
    'any.required': 'Description is required'
  }),
  status_id: joi.number().required().messages({
    'any.required': 'Status id is required'
  })
});

module.exports = { createSchema };
