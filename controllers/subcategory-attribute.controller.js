const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError.js');

const getAllSubcategoryAttributesBySubcategoryId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const subcategoryId = req.params.subcategoryId;
    const query = new QueryBuilder().select('subcategory_attribute').where(['subcategory_id'], ['='], [subcategoryId]).limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ subcategoryAttributes: result.data });
    } else {
      throw ApiError.internal('Failed to get subcategory attributes');
    }
  } catch (error) {
    next(error);
  }
};

const getAllSubcategoryAttributes = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('subcategory_attribute').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ subcategoryAttributes: result.data });
    } else {
      throw ApiError.internal('Failed to get subcategory attributes');
    }
  } catch (error) {
    next(error);
  }
};

const getSubcategoryAttributeById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().select('subcategory_attribute').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ subcategoryAttribute: result.data[0] });
    } else {
      throw ApiError.internal('Failed to get subcategory attribute');
    }
  } catch (error) {
    next(error);
  }
};

const createSubcategoryAttribute = async (req, res, next) => {
  try {
    const values = {
      name_ar: req.body.name_ar,
      name_en: req.body.name_en,
      data_type: req.body.data_type,
      allow_multiselect: req.body.allow_multiselect,
      options: req.body.options ? JSON.stringify(req.body.options) : null,
      is_required: req.body.is_required,
      subcategory_id: req.body.subcategory_id,
      status_id: req.body.status_id
    };
    const query = new QueryBuilder().insert('subcategory_attribute', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Subcategory attribute created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create subcategory attribute');
    }
  } catch (error) {
    next(error);
  }
};

const editSubcategoryAttribute = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      name_ar: req.body.name_ar,
      name_en: req.body.name_en,
      data_type: req.body.data_type,
      allow_multiselect: req.body.allow_multiselect,
      options: req.body.options ? JSON.stringify(req.body.options) : null,
      is_required: req.body.is_required,
      subcategory_id: req.body.subcategory_id,
      status_id: req.body.status_id
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('subcategory_attribute', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Subcategory attribute updated successfully' });
    } else {
      throw ApiError.internal('Failed to update subcategory attribute');
    }
  } catch (error) {
    next(error);
  }
};

const deleteSubcategoryAttribute = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('subcategory_attribute').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Subcategory attribute deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete subcategory attribute');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSubcategoryAttributesBySubcategoryId,
  getAllSubcategoryAttributes,
  getSubcategoryAttributeById,
  createSubcategoryAttribute,
  editSubcategoryAttribute,
  deleteSubcategoryAttribute
};
