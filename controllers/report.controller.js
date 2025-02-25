const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllReports = async (req, res, next) => {
  try {
    const query = new QueryBuilder().select('report');
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ reports: result.data });
    } else {
      throw ApiError.internal('Failed to get reports');
    }
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().select('report').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ report: result.data[0] });
    } else {
      throw ApiError.internal('Failed to get report');
    }
  } catch (error) {
    next(error);
  }
};

const createReport = async (req, res, next) => {
  try {
    const values = {
      entity_id: req.body.entity_id,
      entity_type: req.body.entity_type,
      user_id: req.body.user_id || req.get('userId'),
      reason: req.body.reason,
      datetime:
        req.body.datetime ||
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      extra_data: req.body.extra_data ? JSON.stringify(req.body.extra_data) : null
    };
    const query = new QueryBuilder().insert('report', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Report created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create report');
    }
  } catch (error) {
    next(error);
  }
};

const editReport = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      entity_id: req.body.entity_id,
      entity_type: req.body.entity_type,
      user_id: req.body.user_id,
      reason: req.body.reason,
      datetime: req.body.datetime,
      extra_data: req.body.extra_data ? JSON.stringify(req.body.extra_data) : null
    };
    for (const key in values) {
      if (values[key] === undefined || values[key] === null) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('report', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Report updated successfully' });
    } else {
      throw ApiError.internal('Failed to update report');
    }
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const entityId = req.params.entityId;
    const entityType = req.params.entityType;
    const query = new QueryBuilder().delete('report').where(['entity_id', 'entity_type'], ['=', '='], [entityId, entityType]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Report deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete report');
    }
  } catch (error) {
    next(error);
  }
};

const deleteReportById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('report').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Report deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete report');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllReports, getReportById, createReport, editReport, deleteReport, deleteReportById };
