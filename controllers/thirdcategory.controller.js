const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllThirdcategories = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('thirdcategory').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ thirdcategories: result.data });
    } else {
      throw ApiError.internal('Failed to get thirdcategories');
    }
  } catch (error) {
    next(error);
  }
};

const getThirdcategoryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().select('thirdcategory').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ thirdcategory: result.data[0] });
    } else {
      throw ApiError.internal('Failed to get thirdcategory');
    }
  } catch (error) {
    next(error);
  }
};

const createThirdcategory = async (req, res, next) => {
  try {
    const values = {
      name_en: req.body.name_en,
      name_ar: req.body.name_ar,
      subcategory_id: req.body.subcategory_id,
      icon: req.body.icon
    };
    const query = new QueryBuilder().insert('thirdcategory', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Thirdcategory created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create thirdcategory');
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
  }
};

const editThirdcategory = async (req, res, next) => {
  try {
    const values = {
      name_en: req.body.name_en,
      name_ar: req.body.name_ar,
      subcategory_id: req.body.subcategory_id,
      icon: req.body.icon
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('thirdcategory', values, 'id = ?', [req.params.id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Thirdcategory updated successfully' });
    } else {
      throw ApiError.internal('Failed to update thirdcategory');
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
  }
};

const deleteThirdcategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('thirdcategory').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Thirdcategory deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete thirdcategory');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllThirdcategories, getThirdcategoryById, createThirdcategory, editThirdcategory, deleteThirdcategory };
