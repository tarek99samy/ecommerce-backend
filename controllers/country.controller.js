const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { translateDifferentLang } = require('../middlewares/translate.middleware.js');

const getAllCountries = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('country').limit(page);
    const result = await query.run();
    if (result.success) {
      let countries = await translateDifferentLang(result.data, ['name_en'], 'en', req.get('lang'));
      return res.status(httpStatus.OK).json({ countries });
    } else {
      throw ApiError.internal('Failed to get countries');
    }
  } catch (error) {
    next(error);
  }
};

const getCountryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().select('country').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ country: result.data[0] });
    } else {
      throw ApiError.notFound('Failed to get country');
    }
  } catch (error) {
    next(error);
  }
};

const createCountry = async (req, res, next) => {
  try {
    const values = { name_ar: req.body.name_ar, name_en: req.body.name_en };
    const query = new QueryBuilder().insert('country', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Country created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create country');
    }
  } catch (error) {
    next(error);
  }
};

const editCountry = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = { name_ar: req.body.name_ar, name_en: req.body.name_en };
    const query = new QueryBuilder().update('country', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Country updated successfully' });
    } else {
      throw ApiError.internal('Failed to update country');
    }
  } catch (error) {
    next(error);
  }
};

const deleteCountry = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('country').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Country deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete country');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCountries, getCountryById, createCountry, editCountry, deleteCountry };
