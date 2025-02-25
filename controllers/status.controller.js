const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllStatuses = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('status').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ statuses: result.data });
    } else {
      throw ApiError.internal('Failed to get statuses');
    }
  } catch (error) {
    next(error);
  }
};

const getStatusById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().select('status').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ status: result.data[0] });
    } else {
      throw ApiError.notFound('Failed to get status');
    }
  } catch (error) {
    next(error);
  }
};

const createStatus = async (req, res, next) => {
  try {
    const values = { name_en: req.body.name_en, name_ar: req.body.name_ar };
    const query = new QueryBuilder().insert('status', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Status created successfully' });
    } else {
      throw ApiError.internal('Failed to create status');
    }
  } catch (error) {
    next(error);
  }
};

const editStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = { name_en: req.body.name_en, name_ar: req.body.name_ar };
    const query = new QueryBuilder().update('status', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Status updated successfully' });
    } else {
      throw ApiError.internal('Failed to update status');
    }
  } catch (error) {
    next(error);
  }
};

const deleteStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('status').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Status deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete status');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllStatuses, getStatusById, createStatus, editStatus, deleteStatus };
