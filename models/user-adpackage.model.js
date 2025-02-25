const joi = require('joi');

const createSchema = joi.object({
  user_id: joi.number().required().min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number',
    'any.required': 'User id is required'
  }),
  ad_package_id: joi.number().required().min(1).messages({
    'number.min': 'Ad package id must be at least 1',
    'number.base': 'Ad package id must be a number',
    'any.required': 'Ad package id is required'
  }),
  status_id: joi.number().required().min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number',
    'any.required': 'Status id is required'
  }),
  remaining_ads: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Remaining ads must be at least 1',
    'number.base': 'Remaining ads must be a number'
  })
});

const createManySchema = joi.object({
  values: joi.array().items(createSchema).required()
});

const editSchema = joi.object({
  user_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'User id must be at least 1',
    'number.base': 'User id must be a number',
    'any.required': 'User id is required'
  }),
  ad_package_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Ad package id must be at least 1',
    'number.base': 'Ad package id must be a number',
    'any.required': 'Ad package id is required'
  }),
  status_id: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Status id must be at least 1',
    'number.base': 'Status id must be a number',
    'any.required': 'Status id is required'
  }),
  remaining_ads: joi.number().optional().allow(null).min(1).messages({
    'number.min': 'Remaining ads must be at least 1',
    'number.base': 'Remaining ads must be a number'
  })
});

module.exports = { createSchema, createManySchema, editSchema };
