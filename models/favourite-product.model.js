const joi = require('joi');

const createSchema = joi.object({
  user_id: joi.number().optional().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number'
  }),
  product_id: joi.number().required().min(1).messages({
    'number.min': 'Product id must be at least 1',
    'number.base': 'Product id must be a number',
    'any.required': 'Product id is required'
  })
});

const editSchema = joi.object({
  user_id: joi.number().optional().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number'
  }),
  product_id: joi.number().optional().min(1).messages({
    'number.min': 'Product id must be at least 1',
    'number.base': 'Product id must be a number'
  })
});

module.exports = { createSchema, editSchema };
