const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const validateRequestHeaders = (req, res, next) => {
  try {
    const userId = req.get('userId');
    const lang = req.get('lang');
    const countryId = req.get('countryId');
    if (!userId || !lang || !countryId) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Missing necessary headers'));
    }
    // req = { ...req, userId, lang, countryId };
    return next();
  } catch (error) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to validate headers!', true, error.stack));
  }
};

const validateRequestBody = (schema) => async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      //console.log(req.body);
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    return next();
  } catch (error) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to validate body schema!', true, error.stack));
  }
};

module.exports = { validateRequestHeaders, validateRequestBody };
