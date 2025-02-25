const joi = require('joi');

const createSchema = joi.object({
  product_id: joi.number().required().min(1).messages({
    'number.min': 'Product id must be at least 1',
    'number.base': 'Product id must be a number',
    'any.required': 'Product id is required'
  }),
  user_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number',
    'any.required': 'User id is required'
  }),
  ad_package_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Ad package id must be at least 1',
    'number.base': 'Ad package id must be a number'
  }),
  seller_name: joi.string().optional().allow(null).min(0).max(45).messages({
    'string.max': 'Seller name must be at most 45 characters'
  }),
  seller_phone: joi
    .string()
    .max(15)
    .optional()
    .allow(null)
    .pattern(/^[0-9]+$/)
    .messages({
      'string.max': 'Seller phone must be at most 15 digits',
      'string.pattern.base': 'Seller phone must be a number'
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
  }),
  datetime: joi.date().optional(),
  num_views: joi.number().optional(),
  num_calls: joi.number().optional(),
  allow_comments: joi.boolean().required().messages({
    'any.required': 'Allow comments is required'
  }),
  allow_calls: joi.boolean().required().messages({
    'any.required': 'Allow calls is required'
  })
});

const editSchema = joi.object({
  product_id: joi.number().optional().min(1).messages({
    'number.min': 'Product id must be at least 1',
    'number.base': 'Product id must be a number',
    'any.required': 'Product id is required'
  }),
  user_id: joi.number().optional().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number',
    'any.required': 'User id is required'
  }),
  ad_package_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Ad package id must be at least 1',
    'number.base': 'Ad package id must be a number'
  }),
  seller_name: joi.string().optional().allow(null).min(0).max(45).messages({
    'string.max': 'Seller name must be at most 45 characters'
  }),
  seller_phone: joi
    .string()
    .max(15)
    .optional()
    .allow(null)
    .pattern(/^[0-9]+$/)
    .messages({
      'string.max': 'Seller phone must be at most 15 digits',
      'string.pattern.base': 'Seller phone must be a number'
    }),
  status_id: joi.number().optional().min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number',
    'any.required': 'Status id is required'
  }),
  country_id: joi.number().optional().min(1).messages({
    'number.min': 'Country id must be at least 1',
    'number.base': 'Country id must be a number',
    'any.required': 'Country id is required'
  }),
  datetime: joi.date().optional(),
  num_views: joi.number().optional(),
  num_calls: joi.number().optional(),
  allow_comments: joi.boolean().optional(),
  allow_calls: joi.boolean().optional()
});

module.exports = { createSchema, editSchema };
