const joi = require('joi');

const createSchema = joi.object({
  name_en: joi.string().required().min(1).max(45).messages({
    'string.min': 'English product name must be at least 1 character',
    'string.max': 'English product name must be at most 45 characters',
    'any.required': 'English product name is required'
  }),
  name_ar: joi.string().required().min(1).max(45).messages({
    'string.min': 'Arabic product name must be at least 1 character',
    'string.max': 'Arabic product name must be at most 45 characters',
    'any.required': 'Arabic product name is required'
  }),
  description_en: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'English product description must be at most 150 characters'
  }),
  description_ar: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'Arabic product description must be at most 150 characters'
  }),
  images: joi.string().optional().allow(null).min(0).max(1500).messages({
    'string.max': 'Images must be at most 1500 characters'
  }),
  videos: joi.string().optional().allow(null).min(0).max(1500).messages({
    'string.max': 'videos must be at most 1500 characters'
  }),
  subcategory_id: joi.number().required().min(1).messages({
    'number.min': 'Subcategory id must be at least 1',
    'number.base': 'Subcategory id must be a number',
    'any.required': 'Subcategory id is required'
  }),
  thirdcategory_id: joi.number().optional().allow(null).messages({
    'number.base': 'Third category id must be a number'
  }),
  area_id: joi.number().required().min(1).messages({
    'number.min': 'Area id must be at least 1',
    'number.base': 'Area id must be a number',
    'any.required': 'Area id is required'
  }),
  status_id: joi.number().optional().min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number'
  }),
  price: joi.number().optional().allow(null).min(0).messages({
    'number.min': 'Price must be at least 0',
    'number.base': 'Price must be a number'
  }),
  original_currency_id: joi.number().required().min(1).messages({
    'number.min': 'Original currency id must be at least 1',
    'number.base': 'Original currency id must be a number',
    'any.required': 'Original currency id is required'
  }),
  country_id: joi.number().required().min(1).messages({
    'number.min': 'Country id must be at least 1',
    'number.base': 'Country id must be a number',
    'any.required': 'Country id is required'
  })
});

const editSchema = joi.object({
  name_en: joi.string().optional().min(1).max(45).messages({
    'string.min': 'English product name must be at least 1 character',
    'string.max': 'English product name must be at most 45 characters',
    'any.required': 'English product name is required'
  }),
  name_ar: joi.string().optional().min(1).max(45).messages({
    'string.min': 'Arabic product name must be at least 1 character',
    'string.max': 'Arabic product name must be at most 45 characters',
    'any.required': 'Arabic product name is required'
  }),
  description_en: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'English product description must be at most 150 characters'
  }),
  description_ar: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'Arabic product description must be at most 150 characters'
  }),
  images: joi.string().optional().allow(null).min(0).max(1500).messages({
    'string.max': 'Images must be at most 1500 characters'
  }),
  videos: joi.string().optional().allow(null).min(0).max(1500).messages({
    'string.max': 'videos must be at most 1500 characters'
  }),
  subcategory_id: joi.number().optional().min(1).messages({
    'number.min': 'Subcategory id must be at least 1',
    'number.base': 'Subcategory id must be a number',
    'any.required': 'Subcategory id is required'
  }),
  thirdcategory_id: joi.number().optional().allow(null).messages({
    'number.base': 'Third category id must be a number'
  }),
  area_id: joi.number().optional().min(1).messages({
    'number.min': 'Area id must be at least 1',
    'number.base': 'Area id must be a number',
    'any.required': 'Area id is required'
  }),
  status_id: joi.number().optional().min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number',
    'any.required': 'Status id is required'
  }),
  price: joi.number().optional().allow(null).min(0).messages({
    'number.min': 'Price must be at least 0',
    'number.base': 'Price must be a number'
  }),
  original_currency_id: joi.number().optional().min(1).messages({
    'number.min': 'Original currency id must be at least 1',
    'number.base': 'Original currency id must be a number',
    'any.required': 'Original currency id is required'
  }),
  country_id: joi.number().optional().min(1).messages({
    'number.min': 'Country id must be at least 1',
    'number.base': 'Country id must be a number',
    'any.required': 'Country id is required'
  })
});

module.exports = { createSchema, editSchema };
