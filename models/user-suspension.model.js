const joi = require('joi');

const createSchema = joi.object({
  user_id: joi.number().required().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number',
    'any.required': 'User id is required'
  }),
  reason: joi.string().required().min(1).max(45).messages({
    'string.min': 'Reason must be at least 1 character',
    'string.max': 'Reason must be at most 45 characters',
    'any.required': 'Reason is required'
  }),
  end_date: joi.date().required().messages({
    'any.required': 'End date is required',
    'any.base': 'End date must be a valid date'
  })
});

const editSchema = joi.object({
  user_id: joi.number().optional().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number'
  }),
  reason: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Reason must be at least 1 character',
    'string.max': 'Reason must be at most 45 characters'
  }),
  end_date: joi.date().optional().messages({
    'any.base': 'End date must be a valid date'
  })
});

module.exports = { createSchema, editSchema };
