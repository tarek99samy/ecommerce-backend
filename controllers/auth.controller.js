require('dotenv').config();
const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const OTP = require('../utils/otp.js');
const axios = require('axios');

const loginWithPhone = async (req, res, next) => {
  try {
    const { phone, country_code, password } = req.body;
    let query = new QueryBuilder().select('user').where(['phone', 'country_code'], ['=', '='], [phone, country_code]);
    let result = await query.run();
    if (result.success) {
      if (result.data.length === 0) {
        throw ApiError.notFound('User not found');
      }
      if (result.data[0].password !== password) {
        throw ApiError.forbidden('Incorrect phone, or country_code, or password');
      }
      if (result.data[0].status_id === 4) {
        query = new QueryBuilder().select('suspension').where(['user_id'], ['='], [result.data[0].id]);
        result = await query.run();
        if (result.success && result.data.length > 0) {
          return res.status(httpStatus.NOT_ACCEPTABLE).json({ message: 'User is suspended', suspension: result.data[0] });
        } else {
          throw ApiError.unauthorized('User is suspended, but failed to get suspension details');
        }
      }
      if (result.data[0].status_id !== 1) {
        throw ApiError.unauthorized('User is not verified, please verify first');
      }
      const token = jwt.sign(result.data[0], process.env.JWT_SECRET);
      return res.status(httpStatus.OK).json({ message: 'Login successful', token, user: result.data[0] });
    } else {
      throw ApiError.internal('Failed to login with phone');
    }
  } catch (error) {
    next(error);
  }
};

const loginWithEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let query = new QueryBuilder().select('user').where(['email'], ['='], [email]);
    let result = await query.run();
    if (result.success) {
      if (result.data.length === 0) {
        throw ApiError.notFound('User not found');
      }
      if (result.data[0].password !== password) {
        throw ApiError.forbidden('Incorrect email or password');
      }
      if (result.data[0].status_id === 4) {
        query = new QueryBuilder().select('suspension').where(['user_id'], ['='], [result.data[0].id]);
        result = await query.run();
        if (result.success && result.data.length > 0) {
          return res.status(httpStatus.NOT_ACCEPTABLE).json({ message: 'User is suspended', suspension: result.data[0] });
        } else {
          throw ApiError.unauthorized('User is suspended, but failed to get suspension details');
        }
      }
      if (result.data[0].status_id !== 1) {
        throw ApiError.unauthorized('User is not verified, please verify first');
      }
      const token = jwt.sign(result.data[0], process.env.JWT_SECRET);
      return res.status(httpStatus.OK).json({ message: 'Login successful', token, user: result.data[0] });
    } else {
      throw ApiError.internal('Failed to login with email');
    }
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const values = {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      country_code: req.body.country_code,
      password: req.body.password,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      about: req.body.about,
      icon: req.body.icon,
      lang: req.body.lang,
      country_id: req.body.country_id
    };
    const whereOptions = { keys: ['phone'], opers: ['='], values: [values.phone], joiners: [' OR '] };
    if (values.email !== null && values.email !== undefined) {
      whereOptions.keys.push('email');
      whereOptions.opers.push('=');
      whereOptions.values.push(values.email);
    }
    const query = new QueryBuilder().select('user').where(whereOptions.keys, whereOptions.opers, whereOptions.values, whereOptions.joiners);
    const result = await query.run();
    if (result.success && result.data.length > 0) {
      throw ApiError.badRequest('User already exists');
    } else {
      const query = new QueryBuilder().insert('user', values);
      const result = await query.run();
      if (result.success && result.data.insertId !== null) {
        return res.status(httpStatus.CREATED).json({ message: 'User registered successfully, please verify', id: result.data.insertId });
      } else {
        throw ApiError.internal('Failed to register user');
      }
    }
  } catch (error) {
    next(error);
  }
};

const sendOTP = async (req, res, next) => {
  try {
    const { phone, country_code } = req.body;
    const query = new QueryBuilder().select('user').where(['phone', 'country_code'], ['=', '='], [phone, country_code]);
    const result = await query.run();
    if (result.success && result.data.length === 0) {
      throw ApiError.notFound('User not found');
    }
    OTP.removeOTP(phone);
    const otp = OTP.generateOTP(phone);
    await axios
      .get(
        `https://api.4whats.net/sendMessage?instanceid=${process.env.WA_INSTANCE_ID}&token=${process.env.WA_TOKEN}&phone=${country_code}${phone}&body=Your OTP code is ${otp}`
      )
      .then(() => console.log('Whatsapp message sent'))
      .catch(() => {
        throw ApiError.internal('Failed to send OTP');
      });
    return res.status(httpStatus.OK).json({ message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { otp, phone, isResettingPassword } = req.body;
    if (OTP.verifyOTP(phone) === otp) {
      OTP.removeOTP(phone);
      if (isResettingPassword) {
        const query = new QueryBuilder().update('user', { status_id: 3 }).where(['phone'], ['='], [phone]);
        const result = await query.run();
        if (!result.success || result.data.affectedRows === 0) {
          throw ApiError.internal('Failed to verify user while resetting password');
        }
      } else {
        const query = new QueryBuilder().update('user', { status_id: 1 }).where(['phone'], ['='], [phone]);
        const result = await query.run();
        if (!result.success || result.data.affectedRows === 0) {
          throw ApiError.internal('Failed to verify user after registering');
        }
      }
      return res.status(httpStatus.OK).json({ message: 'OTP verified successfully' });
    } else {
      throw ApiError.unauthorized('Invalid OTP or phone, resend otp or check entered phone');
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    let query = new QueryBuilder().select('user').where(['phone'], ['='], [phone]);
    let result = await query.run();
    if (!result.success || result.data.length === 0) {
      throw ApiError.notFound('User not found');
    }
    if (result.data[0].status_id !== 3) {
      throw ApiError.unauthorized('User is not verified, please verify first');
    }
    query = new QueryBuilder().update('user', { password, status_id: 1 }).where(['phone'], ['='], [phone]);
    result = await query.run();
    if (!result.success || result.data.affectedRows === 0) {
      throw ApiError.internal('Failed to reset password');
    }
    return res.status(httpStatus.OK).json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginWithPhone,
  loginWithEmail,
  register,
  sendOTP,
  verifyOTP,
  resetPassword
};
