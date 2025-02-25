const joi = require('joi');

const createSchema = joi.object({
  name_en: joi.string().required().min(1).max(45).messages({
    'string.min': 'English ad package Name must be at least 1 character',
    'string.max': 'English ad package Name must be at most 45 characters',
    'any.required': 'English ad package Name is required'
  }),
  name_ar: joi.string().required().min(1).max(45).messages({
    'string.min': 'Arabic ad package Name must be at least 1 character',
    'string.max': 'Arabic ad package Name must be at most 45 characters',
    'any.required': 'Arabic ad package Name is required'
  }),
  description_en: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'English ad package Description must be at most 500 characters'
  }),
  description_ar: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'Arabic ad package Description must be at most 500 characters'
  }),
  price: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Price must be at least 1',
    'number.base': 'Price must be a number'
  }),
  currency_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Currency id must be at least 1',
    'number.base': 'Currency id must be a number'
  }),
  discount: joi.number().optional().allow(null).messages({
    'number.base': 'Discount must be a number'
  }),
  icon: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'Icon must be at most 500 characters'
  }),
  title_color: joi.string().optional().allow(null).min(0).max(45).messages({
    'string.max': 'Title color must be at most 45 characters'
  }),
  status_id: joi.number().required().min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number',
    'any.required': 'Status id is required'
  }),
  country_id: joi.number().required().min(1).messages({
    'number.min': 'Country id must be at least 1',
    'number.base': 'Country id must be a number',
    'any.required': 'Country id is required'
  })
});

const editSchema = joi.object({
  name_en: joi.string().optional().allow(null).min(1).max(45).messages({
    'string.min': 'English ad package Name must be at least 1 character',
    'string.max': 'English ad package Name must be at most 45 characters',
    'any.required': 'English ad package Name is required'
  }),
  name_ar: joi.string().optional().allow(null).min(1).max(45).messages({
    'string.min': 'Arabic ad package Name must be at least 1 character',
    'string.max': 'Arabic ad package Name must be at most 45 characters',
    'any.required': 'Arabic ad package Name is required'
  }),
  description_en: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'English ad package Description must be at most 500 characters'
  }),
  description_ar: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'Arabic ad package Description must be at most 500 characters'
  }),
  price: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Price must be at least 1',
    'number.base': 'Price must be a number'
  }),
  currency_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Currency id must be at least 1',
    'number.base': 'Currency id must be a number'
  }),
  discount: joi.number().optional().allow(null).messages({
    'number.base': 'Discount must be a number'
  }),
  icon: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'Icon must be at most 500 characters'
  }),
  title_color: joi.string().optional().allow(null).min(0).max(45).messages({
    'string.max': 'Title color must be at most 45 characters'
  }),
  status_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number',
    'any.required': 'Status id is required'
  }),
  country_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Country id must be at least 1',
    'number.base': 'Country id must be a number',
    'any.required': 'Country id is required'
  })
});

module.exports = { createSchema, editSchema };
