const joi = require('joi');

const createSchema = joi.object({
  name_en: joi.string().required().min(1).max(45).messages({
    'string.min': 'English status name must be at least 1 character',
    'string.max': 'English status name must be at most 45 characters',
    'any.required': 'English status name is required'
  }),
  name_ar: joi.string().required().min(1).max(45).messages({
    'string.min': 'Arabic status name must be at least 1 character',
    'string.max': 'Arabic status name must be at most 45 characters',
    'any.required': 'Arabic status name is required'
  })
});

const editSchema = joi.object({
  name_en: joi.string().optional().min(1).max(45).messages({
    'string.min': 'English status name must be at least 1 character',
    'string.max': 'English status name must be at most 45 characters'
  }),
  name_ar: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Arabic status name must be at least 1 character',
    'string.max': 'Arabic status name must be at most 45 characters'
  })
});

module.exports = { createSchema, editSchema };
