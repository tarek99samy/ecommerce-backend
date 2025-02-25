const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getUserSuspensionByUserId = async (req, res, next) => {
  try {
    const userId = req.get('userId');
    const query = new QueryBuilder().select('suspension').where(['user_id'], ['='], [userId]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ suspension: result.data[0] });
    } else {
      throw ApiError.internal('Failed to get user suspension');
    }
  } catch (error) {
    next(error);
  }
};

const getAllUserSuspensions = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('suspension').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ suspensions: result.data });
    } else {
      throw ApiError.internal('Failed to get suspensions');
    }
  } catch (error) {
    next(error);
  }
};

const getUserSuspensionById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().select('suspension').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.length > 0) {
      return res.status(httpStatus.OK).json({ suspension: result.data[0] });
    } else {
      throw ApiError.internal('Failed to get suspension');
    }
  } catch (error) {
    next(error);
  }
};

const createUserSuspension = async (req, res, next) => {
  try {
    const values = {
      user_id: req.body.user_id,
      reason: req.body.reason,
      end_date: req.body.end_date
    };
    const query = new QueryBuilder().insert('suspension', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Suspension created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create suspension');
    }
  } catch (error) {
    next(error);
  }
};

const editUserSuspension = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      reason: req.body.reason,
      end_date: req.body.end_date
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('suspension', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Suspension updated successfully' });
    } else {
      throw ApiError.internal('Failed to update suspension');
    }
  } catch (error) {
    next(error);
  }
};

const deleteUserSuspension = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('suspension').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Suspension deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete suspension');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserSuspensionByUserId,
  getAllUserSuspensions,
  getUserSuspensionById,
  createUserSuspension,
  editUserSuspension,
  deleteUserSuspension
};
