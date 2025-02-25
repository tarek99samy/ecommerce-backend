const joi = require('joi');

const createSchema = joi.object({
  name_en: joi.string().required().min(1).max(45).messages({
    'string.min': 'English subcategory name must be at least 1 character',
    'string.max': 'English subcategory name must be at most 45 characters',
    'any.required': 'English subcategory name is required'
  }),
  name_ar: joi.string().required().min(1).max(45).messages({
    'string.min': 'Arabic subcategory name must be at least 1 character',
    'string.max': 'Arabic subcategory name must be at most 45 characters',
    'any.required': 'Arabic subcategory name is required'
  }),
  category_id: joi.number().required().min(1).messages({
    'number.min': 'Category id must be at least 1',
    'number.base': 'Category id must be a number',
    'any.required': 'Category id is required'
  }),
  icon: joi.string().max(300).optional().allow(null).messages({
    'string.max': 'Icon must be at most 300 characters'
  })
});

const editSchema = joi.object({
  name_en: joi.string().optional().min(1).max(45).messages({
    'string.min': 'English subcategory name must be at least 1 character',
    'string.max': 'English subcategory name must be at most 45 characters'
  }),
  name_ar: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Arabic subcategory name must be at least 1 character',
    'string.max': 'Arabic subcategory name must be at most 45 characters'
  }),
  category_id: joi.number().optional().min(1).messages({
    'number.min': 'Category id must be at least 1',
    'number.base': 'Category id must be a number'
  }),
  icon: joi.string().max(300).optional().allow(null).messages({
    'string.max': 'Icon must be at most 300 characters'
  })
});

module.exports = { createSchema, editSchema };
