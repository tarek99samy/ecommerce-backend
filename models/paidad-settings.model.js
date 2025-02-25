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
  }),
  price: joi.number().required().min(1).messages({
    'number.min': 'Price must be at least 1',
    'number.base': 'Price must be a number',
    'any.required': 'Price is required'
  }),
  type: joi.number().required().min(1).messages({
    'number.min': 'Type must be at least 1',
    'number.base': 'Type must be a number',
    'any.required': 'Type is required'
  }),
  value: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Value must be at least 1 character',
    'string.max': 'Value must be at most 45 characters'
  }),
  currency_id: joi.number().required().min(1).messages({
    'number.min': 'Currency id must be at least 1',
    'number.base': 'Currency id must be a number',
    'any.required': 'Currency id is required'
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
  }),
  price: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Price must be at least 1',
    'number.base': 'Price must be a number'
  }),
  type: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Type must be at least 1',
    'number.base': 'Type must be a number'
  }),
  value: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Value must be at least 1 character',
    'string.max': 'Value must be at most 45 characters'
  }),
  currency_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Currency id must be at least 1',
    'number.base': 'Currency id must be a number'
  })
});

module.exports = { createSchema, editSchema };
