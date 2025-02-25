const joi = require('joi');

const createSchema = joi.object({
  sender_id: joi.number().required().min(1).messages({
    'number.min': 'Sender id must be at least 1',
    'number.base': 'Sender id must be a number',
    'any.required': 'Sender id is required'
  }),
  receiver_id: joi.number().required().min(1).messages({
    'number.min': 'Receiver id must be at least 1',
    'number.base': 'Receiver id must be a number',
    'any.required': 'Receiver id is required'
  }),
  product_id: joi.number().required().min(1).messages({
    'number.min': 'Product id must be at least 1',
    'number.base': 'Product id must be a number',
    'any.required': 'Product id is required'
  })
});

module.exports = { createSchema };
