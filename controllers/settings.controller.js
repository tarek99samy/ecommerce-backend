const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllSettings = async (req, res, next) => {
  try {
    const query = new QueryBuilder().select('settings');
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ settings: result.data[0].value });
    } else {
      throw ApiError.internal('Failed to get settings');
    }
  } catch (error) {
    next(error);
  }
};

const createSettings = async (req, res, next) => {
  try {
    const values = { value: JSON.stringify(req.body) };
    const query = new QueryBuilder().insert('settings', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Setting created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create settings');
    }
  } catch (error) {
    next(error);
  }
};

const editSettings = async (req, res, next) => {
  try {
    const values = { value: JSON.stringify(req.body) };
    const query = new QueryBuilder().update('settings', values).where(['id'], ['='], [1]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Setting updated successfully' });
    } else {
      throw ApiError.internal('Failed to update settings');
    }
  } catch (error) {
    next(error);
  }
};

const deleteSettings = async (req, res, next) => {
  try {
    const query = new QueryBuilder().delete('settings').where(['id'], ['='], [1]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Setting deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete settings');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSettings, createSettings, editSettings, deleteSettings };
