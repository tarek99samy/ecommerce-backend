const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllArchives = async (req, res, next) => {
  try {
    const query = new QueryBuilder().select('archive');
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ archives: result.data });
    } else {
      throw ApiError.internal('Failed to get archives');
    }
  } catch (error) {
    next(error);
  }
};
const getArchiveById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().select('archive').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ archive: result.data[0] });
    } else {
      throw ApiError.notFound('Failed to get archive');
    }
  } catch (error) {
    next(error);
  }
};
const createArchive = async (req, res, next) => {
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
    const query = new QueryBuilder().insert('archive', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Archive created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create archive');
    }
  } catch (error) {
    next(error);
  }
};
const editArchive = async (req, res, next) => {
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
    const query = new QueryBuilder().update('archive', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Archive updated successfully' });
    } else {
      throw ApiError.internal('Failed to update archive');
    }
  } catch (error) {
    next(error);
  }
};
const deleteArchive = async (req, res, next) => {
  try {
    const entityId = req.params.entityId;
    const entityType = req.params.entityType;
    const query = new QueryBuilder().delete('archive').where(['entity_id', 'entity_type'], ['=', '='], [entityId, entityType]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Archive deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete archive');
    }
  } catch (error) {
    next(error);
  }
};

const deleteArchiveById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('archive').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Archive deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete archive');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllArchives, getArchiveById, createArchive, editArchive, deleteArchive, deleteArchiveById };
