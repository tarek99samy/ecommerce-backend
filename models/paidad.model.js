const joi = require('joi');

const createSchema = joi.object({
  title_en: joi.string().required().min(1).max(45).messages({
    'string.min': 'English title must be at least 1 character',
    'string.max': 'English title must be at most 45 characters',
    'any.required': 'English title is required'
  }),
  title_ar: joi.string().required().min(1).max(45).messages({
    'string.min': 'Arabic title must be at least 1 character',
    'string.max': 'Arabic title must be at most 45 characters',
    'any.required': 'Arabic title is required'
  }),
  description_en: joi.string().optional().min(1).max(500).messages({
    'string.min': 'English description must be at least 1 character',
    'string.max': 'English description must be at most 500 characters'
  }),
  description_ar: joi.string().optional().min(1).max(500).messages({
    'string.min': 'Arabic description must be at least 1 character',
    'string.max': 'Arabic description must be at most 500 characters'
  }),
  image: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'Image must be at most 500 characters'
  }),
  link: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'Link must be at most 500 characters'
  }),
  category_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Category id must be at least 1',
    'number.base': 'Category id must be a number'
  }),
  is_premium: joi.number().required().default(0).messages({
    'number.base': 'Is premium must be a number',
    'number.min': 'Is premium must be at least 0',
    'any.required': 'Is premium is required'
  }),
  remaining_days: joi.number().required().min(1).messages({
    'number.min': 'Remaining days must be at least 1',
    'number.base': 'Remaining days must be a number',
    'any.required': 'Remaining days is required'
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
  city_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'City id must be at least 1',
    'number.base': 'City id must be a number'
  }),
  area_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Area id must be at least 1',
    'number.base': 'Area id must be a number'
  })
});

const editSchema = joi.object({
  title_en: joi.string().optional().allow(null).min(1).max(45).messages({
    'string.min': 'English title must be at least 1 character',
    'string.max': 'English title must be at most 45 characters'
  }),
  title_ar: joi.string().optional().allow(null).min(1).max(45).messages({
    'string.min': 'Arabic title must be at least 1 character',
    'string.max': 'Arabic title must be at most 45 characters'
  }),
  description_en: joi.string().optional().allow(null).min(1).max(500).messages({
    'string.min': 'English description must be at least 1 character',
    'string.max': 'English description must be at most 500 characters'
  }),
  description_ar: joi.string().optional().allow(null).min(1).max(500).messages({
    'string.min': 'Arabic description must be at least 1 character',
    'string.max': 'Arabic description must be at most 500 characters'
  }),
  image: joi.string().optional().allow(null).max(500).messages({
    'string.max': 'Image must be at most 500 characters'
  }),
  link: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'Link must be at most 500 characters'
  }),
  category_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Category id must be at least 1',
    'number.base': 'Category id must be a number'
  }),
  is_premium: joi.number().optional().default(0).messages({
    'number.base': 'Is premium must be a number',
    'number.min': 'Is premium must be at least 0'
  }),
  remaining_days: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Remaining days must be at least 1',
    'number.base': 'Remaining days must be a number'
  }),
  num_views: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Number of views must be at least 1',
    'number.base': 'Number of views must be a number'
  }),
  status_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number'
  }),
  country_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Country id must be at least 1',
    'number.base': 'Country id must be a number'
  }),
  city_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'City id must be at least 1',
    'number.base': 'City id must be a number'
  }),
  area_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Area id must be at least 1',
    'number.base': 'Area id must be a number'
  })
});

module.exports = { createSchema, editSchema };
