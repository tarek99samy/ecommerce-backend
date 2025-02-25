const joi = require('joi');

const loginWithEmailSchema = joi.object({
  email: joi.string().email().max(45).required().messages({
    'string.max': 'Email must be at most 45 characters',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  password: joi.string().required().min(8).max(32).messages({
    'string.pattern.base': 'Password must be at least 8 characters and at most 32 characters',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be at most 32 characters',
    'any.required': 'Password is required'
  })
});

const loginWithPhoneSchema = joi.object({
  phone: joi.string().required().min(8).max(10).messages({
    'string.min': 'Phone number must be 10 digits',
    'string.max': 'Phone number must be 10 digits',
    'any.required': 'Phone number is required'
  }),
  country_code: joi.string().required().min(2).max(4).messages({
    'string.min': 'country_code must be at least 2 digits',
    'string.max': 'country_code must be at most 3 digits',
    'any.required': 'country_code is required'
  }),
  password: joi.string().required().min(8).max(32).messages({
    'string.pattern.base': 'Password must be at least 8 characters and at most 32 characters',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be at most 32 characters',
    'any.required': 'Password is required'
  })
});

const registerSchema = joi.object({
  email: joi.string().email().optional().allow(null).max(45).messages({
    'string.max': 'Email must be at most 45 characters',
    'string.email': 'Email must be a valid email address'
  }),
  name: joi.string().optional().allow(null).min(0).max(45).messages({
    'string.max': 'Name must be at most 45 characters'
  }),
  phone: joi.string().required().min(8).max(10).messages({
    'string.min': 'Phone number must be 10 digits',
    'string.max': 'Phone number must be 10 digits',
    'any.required': 'Phone number is required'
  }),
  country_code: joi.string().required().min(2).max(4).messages({
    'string.min': 'country_code must be at least 2 digits',
    'string.max': 'country_code must be at most 3 digits',
    'any.required': 'country_code is required'
  }),
  password: joi.string().required().min(8).max(32).messages({
    'string.pattern.base': 'Password must be at least 8 characters and at most 32 characters',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be at most 32 characters',
    'any.required': 'Password is required'
  }),
  birthdate: joi.date().optional().allow(null),
  gender: joi.number().optional().allow(null),
  about: joi.string().optional().allow(null).min(0).max(150).allow(null).messages({
    'string.max': 'About must be at most 150 characters'
  }),
  icon: joi.string().min(0).max(300).optional().allow(null).messages({
    'string.max': 'Icon must be at most 300 characters'
  }),
  lang: joi.string().required().min(2).valid('en', 'ar').messages({
    'any.required': 'lang is required'
  }),
  country_id: joi.number().required().min(1).messages({
    'number.min': 'country_id must be at least 1',
    'number.base': 'country_id must be a number',
    'any.required': 'country_id is required'
  })
});

const createUserSchema = joi.object({
  email: joi.string().email().optional().allow(null).max(45).messages({
    'string.max': 'Email must be at most 45 characters',
    'string.email': 'Email must be a valid email address'
  }),
  phone: joi.string().required().min(8).max(10).messages({
    'string.min': 'Phone number must be 10 digits',
    'string.max': 'Phone number must be 10 digits',
    'any.required': 'Phone number is required'
  }),
  country_code: joi.string().required().min(2).max(4).messages({
    'string.min': 'country_code must be at least 2 digits',
    'string.max': 'country_code must be at most 3 digits',
    'any.required': 'country_code is required'
  }),
  password: joi.string().required().min(8).max(32).messages({
    'string.pattern.base': 'Password must be at least 8 characters and at most 32 characters',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be at most 32 characters',
    'any.required': 'Password is required'
  }),
  status_id: joi.number().required().messages({
    'number.base': 'Status must be a number',
    'any.required': 'Status is required'
  }),
  name: joi.string().optional().min(0).max(45).messages({
    'string.max': 'Name must be at most 45 characters'
  }),
  birthdate: joi.date().optional().allow(null).messages({
    'any.base': 'birthdate must be a valid date'
  }),
  gender: joi.number().optional().min(0).max(1).allow(null).messages({
    'number.min': 'gender must be at least 0',
    'number.max': 'gender must be at most 1',
    'any.base': 'gender must be a number'
  }),
  about: joi.string().optional().allow(null).min(0).max(150).messages({
    'string.max': 'About must be at most 150 characters'
  }),
  icon: joi.string().max(300).optional().allow(null).messages({
    'string.max': 'Icon must be at most 300 characters'
  }),
  lang: joi.string().required().min(2).valid('en', 'ar').messages({
    'any.required': 'lang is required'
  }),
  country_id: joi.number().required().min(1).messages({
    'number.min': 'country_id must be at least 1',
    'number.base': 'country_id must be a number',
    'any.required': 'country_id is required'
  }),
  fcm_token: joi.string().optional().allow(null).min(0).max(500).messages({
    'string.max': 'fcm_token must be at most 500 characters'
  }),
  role: joi.number().optional()
});

const editUserSchema = joi.object({
  email: joi.string().email().optional().allow(null).max(45).messages({
    'string.max': 'Email must be at most 45 characters',
    'string.email': 'Email must be a valid email address'
  }),
  phone: joi.string().optional().min(8).max(10).messages({
    'string.min': 'Phone number must be 10 digits',
    'string.max': 'Phone number must be 10 digits'
  }),
  country_code: joi.string().optional().min(2).max(4).messages({
    'string.min': 'country_code must be at least 2 digits',
    'string.max': 'country_code must be at most 3 digits'
  }),
  password: joi.string().optional().min(8).max(32).messages({
    'string.pattern.base': 'Password must be at least 8 characters and at most 32 characters',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be at most 32 characters'
  }),
  status_id: joi.number().optional().min(1).messages({
    'number.min': 'Status must be at least 1',
    'number.base': 'Status must be a number'
  }),
  name: joi.string().optional().min(0).max(45).messages({
    'string.max': 'Name must be at most 45 characters'
  }),
  birthdate: joi.date().optional().messages({
    'any.base': 'birthdate must be a valid date'
  }),
  gender: joi.number().optional().min(0).max(1).messages({
    'number.min': 'gender must be at least 0',
    'number.max': 'gender must be at most 1',
    'any.base': 'gender must be a number'
  }),
  about: joi.string().optional().min(0).max(150).messages({
    'string.max': 'About must be at most 150 characters'
  }),
  icon: joi.string().min(0).max(300).optional().messages({
    'string.max': 'Icon must be at most 300 characters'
  }),
  lang: joi.string().optional().min(2).valid('en', 'ar'),
  country_id: joi.number().optional().min(1).messages({
    'number.min': 'country_id must be at least 1',
    'number.base': 'country_id must be a number'
  }),
  fcm_token: joi.string().optional().min(0).max(500).messages({
    'string.max': 'fcm_token must be at most 500 characters'
  }),
  role: joi.number().optional().min(0).messages({
    'number.min': 'Role must be at least 0',
    'number.base': 'Role must be a number'
  })
});

const resetPasswordSchema = joi.object({
  phone: joi.string().required().min(8).max(10).messages({
    'string.min': 'Phone number must be 10 digits',
    'string.max': 'Phone number must be 10 digits',
    'any.required': 'Phone number is required'
  }),
  password: joi.string().required().min(8).max(32).messages({
    'string.pattern.base': 'Password must be at least 8 characters and at most 32 characters',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be at most 32 characters',
    'any.required': 'Password is required'
  })
});

module.exports = {
  loginWithEmailSchema,
  loginWithPhoneSchema,
  registerSchema,
  createUserSchema,
  editUserSchema,
  resetPasswordSchema
};
