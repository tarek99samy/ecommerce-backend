const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { translateDifferentLang } = require('../middlewares/translate.middleware.js');

const prepareSubcategory = (acc, subcategory) => {
  if (!acc[subcategory.id]) {
    acc[subcategory.id] = {
      id: subcategory.id,
      name_en: subcategory.name_en,
      name_ar: subcategory.name_ar,
      category_id: subcategory.category_id,
      icon: subcategory.icon,
      thirdcategories: []
    };
    delete subcategory.name_en;
  }
  if (subcategory.thirdcategory_id) {
    acc[subcategory.id].thirdcategories.push({
      id: subcategory.thirdcategory_id,
      name_en: subcategory.thirdcategory_name_en,
      name_ar: subcategory.thirdcategory_name_ar,
      icon: subcategory.thirdcategory_icon
    });
  }
  delete subcategory.thirdcategory_id;
  delete subcategory.thirdcategory_name_en;
  delete subcategory.thirdcategory_name_ar;
  delete subcategory.thirdcategory_icon;
  return acc;
};

const getAllSubcategoriesByCategoryId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const categoryId = req.params.categoryId;
    const query = new QueryBuilder()
      .select('subcategory', [
        'subcategory.*',
        'thirdcategory.id as thirdcategory_id',
        'thirdcategory.name_en as thirdcategory_name_en',
        'thirdcategory.name_ar as thirdcategory_name_ar',
        'thirdcategory.icon as thirdcategory_icon'
      ])
      .leftJoin('thirdcategory', 'thirdcategory.subcategory_id', 'subcategory.id')
      .where(['subcategory.category_id'], ['='], [categoryId])
      .with('subcategory.id')
      .limit(page, 20);
    const result = await query.run();
    if (result.success) {
      let subcategories = result.data;
      if (result.data.length > 0) {
        subcategories = result.data.reduce(prepareSubcategory, {});
        subcategories = Object.values(subcategories);
      }
      subcategories = await translateDifferentLang(subcategories, ['name_en'], 'en', req.get('lang'));
      return res.status(httpStatus.OK).json({ subcategories });
    } else {
      throw ApiError.internal('Failed to get subcategories');
    }
  } catch (error) {
    next(error);
  }
};

const getAllSubcategories = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder()
      .select('subcategory', [
        'subcategory.*',
        'thirdcategory.id as thirdcategory_id',
        'thirdcategory.name_en as thirdcategory_name_en',
        'thirdcategory.name_ar as thirdcategory_name_ar',
        'thirdcategory.icon as thirdcategory_icon'
      ])
      .leftJoin('thirdcategory', 'thirdcategory.subcategory_id', 'subcategory.id')
      .with('subcategory.id')
      .limit(page, 20);
    const result = await query.run();
    if (result.success) {
      let subcategories = result.data;
      if (result.data.length > 0) {
        subcategories = result.data.reduce(prepareSubcategory, {});
        subcategories = Object.values(subcategories);
      }
      subcategories = await translateDifferentLang(subcategories, ['name_en'], 'en', req.get('lang'));
      return res.status(httpStatus.OK).json({ subcategories });
    } else {
      throw ApiError.internal('Failed to get subcategories');
    }
  } catch (error) {
    next(error);
  }
};

const getSubcategoryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder()
      .select('subcategory', [
        'subcategory.*',
        'thirdcategory.id as thirdcategory_id',
        'thirdcategory.name_en as thirdcategory_name_en',
        'thirdcategory.name_ar as thirdcategory_name_ar',
        'thirdcategory.icon as thirdcategory_icon'
      ])
      .leftJoin('thirdcategory', 'thirdcategory.subcategory_id', 'subcategory.id')
      .where(['subcategory.id'], ['='], [id]);

    const result = await query.run();
    if (result.success) {
      let subcategories = result.data;
      if (result.data.length > 0) {
        subcategories = result.data.reduce(prepareSubcategory, {});
        subcategories = Object.values(subcategories);
      }
      return res.status(httpStatus.OK).json({ subcategories });
    } else {
      throw ApiError.internal('Failed to get subcategories');
    }
  } catch (error) {
    next(error);
  }
};

const createSubcategory = async (req, res, next) => {
  try {
    const values = {
      name_en: req.body.name_en,
      name_ar: req.body.name_ar,
      category_id: req.body.category_id,
      icon: req.body.icon
    };
    const query = new QueryBuilder().insert('subcategory', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Subcategory created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create subcategory');
    }
  } catch (error) {
    next(error);
  }
};

const editSubcategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      name_en: req.body.name_en,
      name_ar: req.body.name_ar,
      category_id: req.body.category_id,
      icon: req.body.icon
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('subcategory', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Subcategory updated successfully' });
    } else {
      throw ApiError.internal('Failed to update subcategory');
    }
  } catch (error) {
    next(error);
  }
};

const deleteSubcategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('subcategory').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Subcategory deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete subcategory');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSubcategoriesByCategoryId,
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  editSubcategory,
  deleteSubcategory
};
