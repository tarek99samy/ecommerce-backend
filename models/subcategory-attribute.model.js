const joi = require('joi');

const createSchema = joi.object({
  name_en: joi.string().required().min(1).max(45).messages({
    'string.min': 'English subcategory attribute Name must be at least 1 character',
    'string.max': 'English subcategory attribute Name must be at most 45 characters',
    'any.required': 'English subcategory attribute Name is required'
  }),
  name_ar: joi.string().required().min(1).max(45).messages({
    'string.min': 'Arabic subcategory attribute Name must be at least 1 character',
    'string.max': 'Arabic subcategory attribute Name must be at most 45 characters',
    'any.required': 'Arabic subcategory attribute Name is required'
  }),
  data_type: joi.string().required().min(1).max(45).messages({
    'string.min': 'Data type must be at least 1 character',
    'string.max': 'Data type must be at most 45 characters',
    'string.base': 'Data type must be a string',
    'any.required': 'Data type is required'
  }),
  allow_multiselect: joi.boolean().optional().allow(null),
  options: joi.array().optional().allow(null),
  is_required: joi.number().optional().allow(null),
  subcategory_id: joi.number().required().min(1).messages({
    'number.min': 'Subcategory id must be at least 1',
    'number.base': 'Subcategory id must be a number',
    'any.required': 'Subcategory id is required'
  }),
  status_id: joi.number().required().min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number',
    'any.required': 'Status id is required'
  })
});

const editSchema = joi.object({
  name_en: joi.string().optional().min(1).max(45).messages({
    'string.min': 'English subcategory attribute Name must be at least 1 character',
    'string.max': 'English subcategory attribute Name must be at most 45 characters'
  }),
  name_ar: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Arabic subcategory attribute Name must be at least 1 character',
    'string.max': 'Arabic subcategory attribute Name must be at most 45 characters'
  }),
  data_type: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Data type must be at least 1 character',
    'string.max': 'Data type must be at most 45 characters'
  }),
  allow_multiselect: joi.boolean().optional(),
  options: joi.array().optional(),
  is_required: joi.number().optional(),
  subcategory_id: joi.number().optional().min(1).messages({
    'number.min': 'Subcategory id must be at least 1',
    'number.base': 'Subcategory id must be a number'
  }),
  status_id: joi.number().optional().min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number'
  })
});

module.exports = { createSchema, editSchema };
