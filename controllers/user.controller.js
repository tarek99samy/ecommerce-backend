const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllActiveUsers = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('user').where(['status_id'], ['='], [1]).limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ users: result.data });
    } else {
      throw ApiError.internal('Failed to get users');
    }
  } catch (error) {
    next(error);
  }
};

const getAllActiveUsersInCountry = async (req, res, next) => {
  try {
    const { page } = req.query;
    const countryId = req.params.countryId;
    const query = new QueryBuilder().select('user').where(['status_id', 'country_id'], ['=', '='], [1, countryId]).limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ users: result.data });
    } else {
      throw ApiError.internal('Failed to get users');
    }
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('user').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ users: result.data });
    } else {
      throw ApiError.internal('Failed to get users');
    }
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().select('user').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ user: result.data[0] });
    } else {
      throw ApiError.notFound('Failed to get user');
    }
  } catch (error) {
    next(error);
  }
};

const getUserByPhone = async (req, res, next) => {
  try {
    const phone = req.params.phone;
    const query = new QueryBuilder().select('user').where(['phone'], ['='], [phone]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ user: result.data[0] });
    } else {
      throw ApiError.notFound('Failed to get user');
    }
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const values = {
      email: req.body.email,
      phone: req.body.phone,
      country_code: req.body.country_code,
      password: req.body.password,
      status_id: req.body.status_id,
      name: req.body.name,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      about: req.body.about,
      icon: req.body.icon,
      lang: req.body.lang,
      country_id: req.body.country_id,
      fcm_token: req.body.fcm_token,
      role: req.body.role || 0
    };
    const query = new QueryBuilder().insert('user', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'User created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create user');
    }
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      email: req.body.email,
      phone: req.body.phone,
      country_code: req.body.country_code,
      password: req.body.password,
      status_id: req.body.status_id,
      name: req.body.name,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      about: req.body.about,
      icon: req.body.icon,
      lang: req.body.lang,
      country_id: req.body.country_id,
      fcm_token: req.body.fcm_token,
      role: req.body.role
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    if (Object.keys(values).length === 0) {
      throw ApiError.badRequest('No data to update');
    }
    const query = new QueryBuilder().update('user', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'User updated successfully' });
    } else {
      throw ApiError.internal('Failed to update user');
    }
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('user').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'User deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete user');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllActiveUsers,
  getAllActiveUsersInCountry,
  getAllUsers,
  getUserById,
  getUserByPhone,
  createUser,
  editUser,
  deleteUser
};
