const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const prepareUserAdpackage = (user_adpackage) => {
  const columnCount = 5 + 12;
  let newUserAdpackage = { ...user_adpackage, ad_package: {} };
  for (let i = 5; i < columnCount; i++) {
    newUserAdpackage.ad_package[Object.keys(user_adpackage)[i]] = Object.values(user_adpackage)[i];
    delete newUserAdpackage[Object.keys(user_adpackage)[i]];
  }
  newUserAdpackage = {
    id: newUserAdpackage.user_ad_package_id,
    user_id: newUserAdpackage.user_id,
    ad_package_id: newUserAdpackage.ad_package_id,
    status_id: newUserAdpackage.user_ad_package_status_id,
    status_name: newUserAdpackage.status_name,
    ...newUserAdpackage
  };
  delete newUserAdpackage.user_ad_package_id;
  delete newUserAdpackage.user_ad_package_status_id;
  return newUserAdpackage;
};

const getAllUserAdpackagesByAdpackageId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const adpackageId = req.params.adpackageId;
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('user_ad_package', [
        'user_ad_package.id as user_ad_package_id, user_ad_package.status_id as user_ad_package_status_id, user_ad_package.ad_package_id, user_ad_package.user_id',
        'ad_package.*',
        `status.name_${lang} as status_name`
      ])
      .join('ad_package', 'ad_package.id', 'user_ad_package.ad_package_id')
      .join('status', 'status.id', 'user_ad_package.status_id')
      .where(['user_ad_package.ad_package_id'], ['='], [adpackageId])
      .limit(page);

    const result = await query.run();
    if (result.success) {
      const userAdpackages = result.data.map(prepareUserAdpackage);
      return res.status(httpStatus.OK).json({ userAdpackages });
    } else {
      throw ApiError.internal('Failed to get user adpackage by adpackage');
    }
  } catch (error) {
    next(error);
  }
};

const getAllUserAdpackagesByUserId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const userId = req.get('userId');
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('user_ad_package', [
        'user_ad_package.id as user_ad_package_id, user_ad_package.status_id as user_ad_package_status_id, user_ad_package.ad_package_id, user_ad_package.user_id',
        'ad_package.*',
        `status.name_${lang} as status_name`
      ])
      .join('ad_package', 'ad_package.id', 'user_ad_package.ad_package_id')
      .join('status', 'status.id', 'user_ad_package.status_id')
      .where(['user_ad_package.user_id'], ['='], [userId])
      .limit(page);

    const result = await query.run();
    if (result.success) {
      const userAdpackages = result.data.map(prepareUserAdpackage);
      return res.status(httpStatus.OK).json({ userAdpackages });
    } else {
      throw ApiError.internal('Failed to get user adpackage by user');
    }
  } catch (error) {
    next(error);
  }
};

const getAllUserAdpackages = async (req, res, next) => {
  try {
    const { page } = req.query;
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('user_ad_package', [
        'user_ad_package.id as user_ad_package_id, user_ad_package.status_id as user_ad_package_status_id, user_ad_package.ad_package_id, user_ad_package.user_id',
        'ad_package.*',
        `status.name_${lang} as status_name`
      ])
      .join('ad_package', 'ad_package.id', 'user_ad_package.ad_package_id')
      .join('status', 'status.id', 'user_ad_package.status_id')
      .limit(page);

    const result = await query.run();
    if (result.success) {
      const userAdpackages = result.data.map(prepareUserAdpackage);
      return res.status(httpStatus.OK).json({ userAdpackages });
    } else {
      throw ApiError.internal('Failed to get user adpackages');
    }
  } catch (error) {
    next(error);
  }
};

const getUserAdpackageById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('user_ad_package', [
        'user_ad_package.id as user_ad_package_id, user_ad_package.status_id as user_ad_package_status_id, user_ad_package.ad_package_id, user_ad_package.user_id',
        'ad_package.*',
        `status.name_${lang} as status_name`
      ])
      .join('ad_package', 'ad_package.id', 'user_ad_package.ad_package_id')
      .join('status', 'status.id', 'user_ad_package.status_id')
      .where(['user_ad_package.id'], ['='], [id]);

    const result = await query.run();
    if (result.success) {
      const userAdpackage = result.data.map(prepareUserAdpackage);
      return res.status(httpStatus.OK).json({ userAdpackage });
    } else {
      throw ApiError.internal('Failed to get user adpackage');
    }
  } catch (error) {
    next(error);
  }
};

const createUserAdpackage = async (req, res, next) => {
  try {
    const values = {
      user_id: req.body.user_id,
      ad_package_id: req.body.ad_package_id,
      status_id: req.body.status_id
    };
    const query = new QueryBuilder().insert('user_ad_package', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'User Adpackage created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create user adpackage');
    }
  } catch (error) {
    next(error);
  }
};

const createManyUserAdpackages = async (req, res, next) => {
  try {
    const values = req.body.values;
    const query = new QueryBuilder().insertMany('user_ad_package', values);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.CREATED).json({ message: 'User Adpackages created successfully' });
    } else {
      throw ApiError.internal('Failed to create user adpackages');
    }
  } catch (error) {
    next(error);
  }
};

const editUserAdpackage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      user_id: req.body.user_id,
      ad_package_id: req.body.ad_package_id,
      status_id: req.body.status_id
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('user_ad_package', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'User Adpackage updated successfully' });
    } else {
      throw ApiError.internal('Failed to update user adpackage');
    }
  } catch (error) {
    next(error);
  }
};

const deleteUserAdpackage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('user_ad_package').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'User Adpackage deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete user adpackage');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUserAdpackagesByUserId,
  getAllUserAdpackagesByAdpackageId,
  getAllUserAdpackages,
  getUserAdpackageById,
  createUserAdpackage,
  createManyUserAdpackages,
  editUserAdpackage,
  deleteUserAdpackage
};
