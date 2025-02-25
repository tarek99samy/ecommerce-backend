const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { translateDifferentLang } = require('../middlewares/translate.middleware.js');

const prepareCategory = (acc, category) => {
  if (!acc[category.id]) {
    acc[category.id] = {
      id: category.id,
      name_ar: category.name_ar,
      name_en: category.name_en,
      icon: category.icon,
      subcategories: []
    };
  }

  let subcategory = acc[category.id].subcategories.find((sub) => sub.id === category.subcategory_id);
  if (!subcategory) {
    subcategory = {
      id: category.subcategory_id,
      name_en: category.subcategory_name_en,
      name_ar: category.subcategory_name_ar,
      icon: category.subcategory_icon,
      thirdcategories: []
    };
    acc[category.id].subcategories.push(subcategory);
  }

  if (category.thirdcategory_id) {
    subcategory.thirdcategories.push({
      id: category.thirdcategory_id,
      subcategory_id: category.thirdcategory_subcategory_id,
      name_en: category.thirdcategory_name_en,
      name_ar: category.thirdcategory_name_ar,
      icon: category.thirdcategory_icon
    });
  }
  return acc;
};

const getAllCategoriesChildren = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder()
      .select('category', [
        'category.*',
        'subcategory.id as subcategory_id, subcategory.name_en as subcategory_name_en, subcategory.name_ar as subcategory_name_ar, subcategory.icon as subcategory_icon',
        'thirdcategory.id as thirdcategory_id, thirdcategory.subcategory_id as thirdcategory_subcategory_id, thirdcategory.name_en as thirdcategory_name_en, thirdcategory.name_ar as thirdcategory_name_ar, thirdcategory.icon as thirdcategory_icon'
      ])
      .leftJoin('subcategory', 'subcategory.category_id', 'category.id')
      .leftJoin('thirdcategory', 'thirdcategory.subcategory_id', 'subcategory.id')
      .with('category.id')
      .limit(page);
    const result = await query.run();
    if (result.success) {
      let categories = Object.values(result.data.reduce(prepareCategory, {}));
      categories = await translateDifferentLang(categories, ['name_en'], 'en', req.get('lang'));
      return res.status(httpStatus.OK).json({ categories });
    } else {
      throw ApiError.internal('Failed to get categories');
    }
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('category').limit(page);
    const result = await query.run();
    if (result.success) {
      let categories = await translateDifferentLang(result.data, ['name_en'], 'en', req.get('lang'));
      return res.status(httpStatus.OK).json({ categories });
    } else {
      throw ApiError.internal('Failed to get categories');
    }
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().select('category').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ category: result.data[0] });
    } else {
      throw ApiError.internal('Failed to get category');
    }
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const values = { name_ar: req.body.name_ar, name_en: req.body.name_en, icon: req.body.icon };
    const query = new QueryBuilder().insert('category', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Category created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create category');
    }
  } catch (error) {
    next(error);
  }
};

const editCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = { name_ar: req.body.name_ar, name_en: req.body.name_en, icon: req.body.icon };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('category', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Category updated successfully' });
    } else {
      throw ApiError.internal('Failed to update category');
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('category').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Category deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete category');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCategoriesChildren, getAllCategories, getCategoryById, createCategory, editCategory, deleteCategory };
