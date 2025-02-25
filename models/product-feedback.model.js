const joi = require('joi');

const createSchema = joi.object({
  user_id: joi.number().optional().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number'
  }),
  ad_id: joi.number().required().min(1).messages({
    'number.min': 'Ad id must be at least 1',
    'number.base': 'Ad id must be a number',
    'any.required': 'Ad id is required'
  }),
  rating: joi.number().optional().min(1).max(5).messages({
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating must be at most 5'
  }),
  comment: joi.string().optional().max(300).messages({
    'string.max': 'Comment must be at most 300 characters'
  }),
  type: joi.number().required().valid(1, 2, 3).messages({
    'number.base': 'Type must be a number',
    'any.only': 'Type must be 1, 2 or 3',
    'any.required': 'Type is required'
  }),
  datetime: joi.date().optional()
});

const editSchema = joi.object({
  user_id: joi.number().optional().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number'
  }),
  ad_id: joi.number().optional().min(1).messages({
    'number.min': 'Ad id must be at least 1',
    'number.base': 'Ad id must be a number'
  }),
  rating: joi.number().optional().allow(null).min(1).max(5).messages({
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating must be at most 5'
  }),
  comment: joi.string().optional().allow(null).max(300).messages({
    'string.max': 'Comment must be at most 300 characters'
  }),
  type: joi.number().optional().valid(1, 2, 3).messages({
    'number.base': 'Type must be a number',
    'any.only': 'Type must be 1, 2 or 3'
  }),
  datetime: joi.date().optional()
});

module.exports = { createSchema, editSchema };
