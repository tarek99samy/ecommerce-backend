require('dotenv').config();
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

function verifyToken(req, res, next) {
  try {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Access denied'));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
    }
    if (!req.header('userId')) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Missing necessary headers'));
    }
    if (+req.header('userId') !== +decoded.id) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid usage of another users token'));
    }

    next();
  } catch (error) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Failed to authenticate token!', error));
  }
}

module.exports = { verifyToken };
