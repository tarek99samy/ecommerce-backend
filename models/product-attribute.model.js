const joi = require('joi');

const createSchema = joi.object({
  product_id: joi.number().required().min(1).messages({
    'number.min': 'Product id must be at least 1',
    'number.base': 'Product id must be a number',
    'any.required': 'Product id is required'
  }),
  subcategory_attribute_id: joi.number().required().min(1).messages({
    'number.min': 'Subcategory attribute id must be at least 1',
    'number.base': 'Subcategory attribute id must be a number',
    'any.required': 'Subcategory attribute id is required'
  }),
  value: joi
    .alternatives()
    .try(
      joi.string().min(1).max(500).messages({
        'string.min': 'Value must be at least 1 character',
        'string.max': 'Value must be at most 500 characters',
        'string.base': 'Value must be a string'
      }),
      joi.number(),
      joi.date(),
      joi.array()
    )
    .required()
    .messages({
      'any.required': 'Value is required'
    })
});

const createManySchema = joi.object({
  values: joi.array().items(createSchema).required().messages({
    'array.base': 'Values must be an array of objects each have the product attribute schema',
    'any.required': 'Values is required'
  })
});

const editSchema = joi.object({
  product_id: joi.number().optional().min(1).messages({
    'number.min': 'Product id must be at least 1',
    'number.base': 'Product id must be a number'
  }),
  subcategory_attribute_id: joi.number().optional().min(1).messages({
    'number.min': 'Subcategory attribute id must be at least 1',
    'number.base': 'Subcategory attribute id must be a number'
  }),
  value: joi
    .alternatives()
    .try(
      joi.string().min(1).max(500).messages({
        'string.min': 'Value must be at least 1 character',
        'string.max': 'Value must be at most 500 characters',
        'string.base': 'Value must be a string'
      }),
      joi.number(),
      joi.date(),
      joi.array()
    )
    .optional()
});

module.exports = { createSchema, editSchema, createManySchema };
