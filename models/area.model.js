const joi = require('joi');

const createSchema = joi.object({
  name_en: joi.string().required().min(1).max(45).messages({
    'string.min': 'English area name must be at least 1 character',
    'string.max': 'English area name must be at most 45 characters',
    'any.required': 'English area name is required'
  }),
  name_ar: joi.string().required().min(1).max(45).messages({
    'string.min': 'Arabic area name must be at least 1 character',
    'string.max': 'Arabic area name must be at most 45 characters',
    'any.required': 'Arabic area name is required'
  }),
  city_id: joi.number().required().min(1).messages({
    'number.min': 'City id must be at least 1',
    'number.base': 'City id must be a number',
    'any.required': 'City id is required'
  })
});

const editSchema = joi.object({
  name_en: joi.string().optional().min(1).max(45).messages({
    'string.min': 'English area name must be at least 1 character',
    'string.max': 'English area name must be at most 45 characters'
  }),
  name_ar: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Arabic area name must be at least 1 character',
    'string.max': 'Arabic area name must be at most 45 characters'
  }),
  city_id: joi.number().optional().min(1).messages({
    'number.min': 'City id must be at least 1',
    'number.base': 'City id must be a number'
  })
});

module.exports = { createSchema, editSchema };
