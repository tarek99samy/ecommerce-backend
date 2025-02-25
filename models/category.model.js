const joi = require('joi');

const createSchema = joi.object({
  name_en: joi.string().required().min(1).max(45).messages({
    'string.min': 'English category Name must be at least 1 character',
    'string.max': 'English category Name must be at most 45 characters',
    'any.required': 'English category Name is required'
  }),
  name_ar: joi.string().required().min(1).max(45).messages({
    'string.min': 'Arabic category Name must be at least 1 character',
    'string.max': 'Arabic category Name must be at most 45 characters',
    'any.required': 'Arabic category Name is required'
  }),
  icon: joi.string().optional().allow(null).min(0).max(300).messages({
    'string.max': 'Icon must be at most 300 characters'
  })
});

const editSchema = joi.object({
  name_en: joi.string().optional().min(1).max(45).messages({
    'string.min': 'English category Name must be at least 1 character',
    'string.max': 'English category Name must be at most 45 characters'
  }),
  name_ar: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Arabic category Name must be at least 1 character',
    'string.max': 'Arabic category Name must be at most 45 characters'
  }),
  icon: joi.string().optional().allow(null).min(0).max(300).messages({
    'string.max': 'Icon must be at most 300 characters'
  })
});

module.exports = { createSchema, editSchema };
