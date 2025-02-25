const joi = require('joi');

const createSchema = joi.object({
  author_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Author id must be at least 1',
    'number.base': 'Author id must be a number'
  }),
  category_id: joi.number().required().min(1).messages({
    'number.min': 'Category id must be at least 1',
    'number.base': 'Category id must be a number',
    'any.required': 'Category id is required'
  }),
  title_en: joi.string().required().min(1).max(150).messages({
    'string.min': 'English Article Title must be at least 1 character',
    'string.max': 'English Article Title must be at most 150 characters',
    'any.required': 'English Article Title is required'
  }),
  title_ar: joi.string().required().min(1).max(150).messages({
    'string.min': 'Arabic Article Title must be at least 1 character',
    'string.max': 'Arabic Article Title must be at most 150 characters',
    'any.required': 'Arabic Article Title is required'
  }),
  description_en: joi.string().required().min(1).max(2000).messages({
    'string.min': 'English Article Description must be at least 1 character',
    'string.max': 'English Article Description must be at most 2000 characters',
    'any.required': 'English Article Description is required'
  }),
  description_ar: joi.string().required().min(1).max(2000).messages({
    'string.min': 'Arabic Article Description must be at least 1 character',
    'string.max': 'Arabic Article Description must be at most 2000 characters',
    'any.required': 'Arabic Article Description is required'
  }),
  datetime: joi.date().optional(),
  image: joi.string().optional().min(0).max(300).messages({
    'string.max': 'Image must be at most 300 characters'
  }),
  num_likes: joi.number().optional().min(0).messages({
    'number.base': 'Number of likes must be a number'
  }),
  num_dislikes: joi.number().optional().min(0).messages({
    'number.base': 'Number of dislikes must be a number'
  }),
  status_id: joi.number().optional().min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number'
  })
});

const editSchema = joi.object({
  category_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Category id must be at least 1',
    'number.base': 'Category id must be a number',
    'any.required': 'Category id is required'
  }),
  title_en: joi.string().optional().allow(null).min(1).max(150).messages({
    'string.min': 'English Article Title must be at least 1 character',
    'string.max': 'English Article Title must be at most 150 characters',
    'any.required': 'English Article Title is required'
  }),
  title_ar: joi.string().optional().allow(null).min(1).max(150).messages({
    'string.min': 'Arabic Article Title must be at least 1 character',
    'string.max': 'Arabic Article Title must be at most 150 characters',
    'any.required': 'Arabic Article Title is required'
  }),
  description_en: joi.string().optional().allow(null).min(1).max(2000).messages({
    'string.min': 'English Article Description must be at least 1 character',
    'string.max': 'English Article Description must be at most 2000 characters',
    'any.required': 'English Article Description is required'
  }),
  description_ar: joi.string().optional().allow(null).min(1).max(2000).messages({
    'string.min': 'Arabic Article Description must be at least 1 character',
    'string.max': 'Arabic Article Description must be at most 2000 characters',
    'any.required': 'Arabic Article Description is required'
  }),
  datetime: joi.date().optional(),
  image: joi.string().optional().allow(null).min(0).max(300).messages({
    'string.max': 'Image must be at most 300 characters'
  }),
  num_likes: joi.number().optional().allow(null).messages({
    'number.base': 'Number of likes must be a number'
  }),
  num_dislikes: joi.number().optional().allow(null).messages({
    'number.base': 'Number of dislikes must be a number'
  }),
  status_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number'
  })
});

module.exports = { createSchema, editSchema };
