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
  chat_id: joi.number().required().min(1).messages({
    'number.min': 'Chat id must be at least 1',
    'number.base': 'Chat id must be a number',
    'any.required': 'Chat id is required'
  }),
  description: joi.string().optional().min(1).max(2000).messages({
    'string.min': 'Description must be at least 1 character',
    'string.max': 'Description must be at most 2000 characters'
  }),
  image: joi.string().optional().max(500).messages({
    'string.max': 'Image must be at most 500 characters'
  }),
  datetime: joi.date().optional()
});

const editSchema = joi.object({
  description: joi.string().required().min(1).max(2000).messages({
    'string.min': 'Description must be at least 1 character',
    'string.max': 'Description must be at most 2000 characters',
    'any.required': 'Description is required'
  })
});

module.exports = { createSchema, editSchema };
