const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllCurrencies = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('currency').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ currencies: result.data });
    } else {
      throw ApiError.internal('Failed to get currencies');
    }
  } catch (error) {
    next(error);
  }
};

const getCurrencyById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().select('currency').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ currency: result.data[0] });
    } else {
      throw ApiError.internal('Failed to get currency');
    }
  } catch (error) {
    next(error);
  }
};

const createCurrency = async (req, res, next) => {
  try {
    const values = { name_en: req.body.name_en, name_ar: req.body.name_ar };
    const query = new QueryBuilder().insert('currency', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Currency created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create currency');
    }
  } catch (error) {
    next(error);
  }
};

const editCurrency = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = { name_en: req.body.name_en, name_ar: req.body.name_ar };
    const query = new QueryBuilder().update('currency', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Currency updated successfully' });
    } else {
      throw ApiError.internal('Failed to update currency');
    }
  } catch (error) {
    next(error);
  }
};

const deleteCurrency = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('currency').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Currency deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete currency');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCurrencies, getCurrencyById, createCurrency, editCurrency, deleteCurrency };
