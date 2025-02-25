const joi = require('joi');

const createSchema = joi.object({
  entity_id: joi.number().required().min(1).messages({
    'number.min': 'Entity id must be at least 1',
    'number.base': 'Entity id must be a number',
    'any.required': 'Entity id is required'
  }),
  entity_type: joi.string().required().valid('ad', 'article').messages({
    'string.base': 'Entity type must be a string',
    'any.only': 'Entity type must be ad or article',
    'any.required': 'Entity type is required'
  }),
  user_id: joi.number().optional().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number'
  }),
  reason: joi.string().required().min(1).max(150).messages({
    'string.min': 'Reason must be at least 1 character',
    'string.max': 'Reason must be at most 150 characters',
    'any.required': 'Reason is required'
  }),
  datetime: joi.date().optional().messages({
    'any.base': 'Datetime must be a valid date'
  }),
  extra_data: joi.alternatives().try(joi.string(), joi.number(), joi.date(), joi.array(), null).messages({
    'any.base': 'Extra data must be a string, number, date or array'
  })
});

const editSchema = joi.object({
  entity_id: joi.number().optional().min(1).messages({
    'number.min': 'Entity id must be at least 1',
    'number.base': 'Entity id must be a number'
  }),
  entity_type: joi.string().optional().valid('ad', 'article').messages({
    'string.base': 'Entity type must be a string',
    'any.only': 'Entity type must be ad or article'
  }),
  user_id: joi.number().optional().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number'
  }),
  reason: joi.string().optional().min(1).max(150).messages({
    'string.min': 'Reason must be at least 1 character',
    'string.max': 'Reason must be at most 150 characters'
  }),
  datetime: joi.date().optional().messages({
    'any.base': 'Datetime must be a valid date'
  }),
  extra_data: joi.alternatives().try(joi.string(), joi.number(), joi.date(), joi.array()).optional().messages({
    'any.base': 'Extra data must be a string, number, date or array'
  })
});

module.exports = { createSchema, editSchema };
