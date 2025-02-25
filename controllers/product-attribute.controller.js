const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError.js');

const getAllProductAttributesByProductId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const productId = req.params.productId;
    const query = new QueryBuilder().select('product_attribute').where(['product_id'], ['='], [productId]).limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ productAttributes: result.data });
    } else {
      throw ApiError.internal('Failed to get product attributes');
    }
  } catch (error) {
    next(error);
  }
};

const getAllProductAttributes = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('product_attribute').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ productAttributes: result.data });
    } else {
      throw ApiError.internal('Failed to get product attributes');
    }
  } catch (error) {
    next(error);
  }
};

const createProductAttribute = async (req, res, next) => {
  try {
    const values = {
      product_id: req.body.product_id,
      subcategory_attribute_id: req.body.subcategory_attribute_id,
      value: req.body.value ? JSON.stringify(req.body.value) : null
    };
    const query = new QueryBuilder().insert('product_attribute', values);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.CREATED).json({ message: 'Product attribute created successfully' });
    } else {
      throw ApiError.internal('Failed to create product attribute');
    }
  } catch (error) {
    next(error);
  }
};

const createManyProductAttribute = async (req, res, next) => {
  try {
    const values = req.body.values.map((value) => ({
      product_id: value.product_id,
      subcategory_attribute_id: value.subcategory_attribute_id,
      value: JSON.stringify(value.value)
    }));
    const query = new QueryBuilder().insertMany('product_attribute', values);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.CREATED).json({ message: 'Product attributes created successfully' });
    } else {
      throw ApiError.internal('Failed to create product attributes');
    }
  } catch (error) {
    next(error);
  }
};

const editProductAttribute = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      product_id: req.body.product_id,
      subcategory_attribute_id: req.body.subcategory_attribute_id,
      value: req.body.value ? JSON.stringify(req.body.value) : null
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('product_attribute', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Product attribute updated successfully' });
    } else {
      throw ApiError.internal('Failed to update product attribute');
    }
  } catch (error) {
    next(error);
  }
};

const deleteProductAttribute = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('product_attribute').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Product attribute deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete product attribute');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProductAttributesByProductId,
  getAllProductAttributes,
  createManyProductAttribute,
  createProductAttribute,
  editProductAttribute,
  deleteProductAttribute
};
