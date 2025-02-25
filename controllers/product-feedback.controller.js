const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllProductFeedbacksByAdId = async (req, res, next) => {
  try {
    const { page, type = 0 } = req.query;
    const adId = req.params.adId;
    const query = new QueryBuilder()
      .select('product_feedback', ['product_feedback.*', 'user.name as user_name, user.icon as user_icon'])
      .join('user', 'user.id', 'product_feedback.user_id')
      .where(['ad_id', 'type'], ['=', type ? '=' : '>'], [adId, type])
      .limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ productFeedbacks: result.data });
    } else {
      throw ApiError.internal('Failed to get product feedbacks');
    }
  } catch (error) {
    next(error);
  }
};

const getAllProductFeedbacks = async (req, res, next) => {
  try {
    try {
      const { page, type = 0 } = req.query;
      const query = new QueryBuilder()
        .select('product_feedback', ['product_feedback.*', 'user.name as user_name, user.icon as user_icon'])
        .join('user', 'user.id', 'product_feedback.user_id')
        .where(['type'], [type ? '=' : '>'], [type])
        .limit(page);
      const result = await query.run();
      if (result.success) {
        return res.status(httpStatus.OK).json({ productFeedbacks: result.data });
      } else {
        throw ApiError.internal('Failed to get product feedbacks');
      }
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const createProductFeedback = async (req, res, next) => {
  try {
    const values = {
      user_id: req.body.user_id || req.get('userId'),
      ad_id: req.body.ad_id,
      rating: req.body.rating,
      comment: req.body.comment,
      type: req.body.type,
      datetime:
        req.body.datetime ||
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    };
    const query = new QueryBuilder().insert('product_feedback', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Product feedback created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create product feedback');
    }
  } catch (error) {
    next(error);
  }
};

const editProductFeedback = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      user_id: req.body.user_id,
      ad_id: req.body.ad_id,
      rating: req.body.rating,
      comment: req.body.comment,
      type: req.body.type,
      datetime: req.body.datetime
    };
    for (const key in values) {
      if (key === 'rating' || key === 'comment') continue;
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('product_feedback', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Product feedback updated successfully' });
    } else {
      throw ApiError.internal('Failed to update product feedback');
    }
  } catch (error) {
    next(error);
  }
};

const deleteProductFeedback = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('product_feedback').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Product feedback deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete product feedback');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProductFeedbacksByAdId,
  getAllProductFeedbacks,
  createProductFeedback,
  editProductFeedback,
  deleteProductFeedback
};
