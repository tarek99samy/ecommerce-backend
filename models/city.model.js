const joi = require('joi');

const createSchema = joi.object({
  name_en: joi.string().required().min(1).max(45).messages({
    'string.min': 'English city Name must be at least 1 character',
    'string.max': 'English city Name must be at most 45 characters',
    'any.required': 'English city Name is required'
  }),
  name_ar: joi.string().required().min(1).max(45).messages({
    'string.min': 'Arabic city Name must be at least 1 character',
    'string.max': 'Arabic city Name must be at most 45 characters',
    'any.required': 'Arabic city Name is required'
  }),
  country_id: joi.number().required().min(1).messages({
    'number.base': 'Country id must be a number',
    'number.min': 'Country id must be at least 1',
    'any.required': 'Country id is required'
  })
});

const editSchema = joi.object({
  name_en: joi.string().optional().min(1).max(45).messages({
    'string.min': 'English city Name must be at least 1 character',
    'string.max': 'English city Name must be at most 45 characters'
  }),
  name_ar: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Arabic city Name must be at least 1 character',
    'string.max': 'Arabic city Name must be at most 45 characters'
  }),
  country_id: joi.number().optional().min(1).messages({
    'number.base': 'Country id must be a number',
    'number.min': 'Country id must be at least 1'
  })
});

module.exports = { createSchema, editSchema };
