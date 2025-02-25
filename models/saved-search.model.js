const joi = require('joi');

const createSchema = joi.object({
  city_id: joi.number().required().min(1).messages({
    'number.min': 'City id must be at least 1',
    'any.required': 'City id is required'
  }),
  area_id: joi.number().required().min(1).messages({
    'number.min': 'Area id must be at least 1',
    'any.required': 'Area id is required'
  }),
  keyword: joi.string().required().min(1).max(150).messages({
    'string.min': 'Keyword must be at least 1 character',
    'string.max': 'Keyword must be at most 150 characters',
    'any.required': 'Keyword is required'
  })
});

const editSchema = joi.object({
  keyword: joi.string().required().min(1).max(150).messages({
    'string.min': 'Keyword must be at least 1 character',
    'string.max': 'Keyword must be at most 150 characters',
    'any.required': 'Keyword is required'
  })
});

module.exports = { createSchema, editSchema };
