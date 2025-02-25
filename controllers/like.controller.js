const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllArticleLikes = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const query = new QueryBuilder().select('like', ['count(*) as num_likes']).where(['article_id'], ['='], [articleId]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ num_likes: result.data[0].num_likes });
    } else {
      throw ApiError.internal('Failed to get likes on article');
    }
  } catch (error) {
    next(error);
  }
};

const createLike = async (req, res, next) => {
  try {
    const values = { article_id: req.body.article_id, user_id: req.body.user_id || req.get('userId') };
    const query = new QueryBuilder().insert('like', values);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.CREATED).json({ message: 'Like created successfully' });
    } else {
      throw ApiError.internal('Failed to create like');
    }
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const userId = req.body.user_id || req.get('userId');
    const articleId = req.body.article_id;
    const query = new QueryBuilder().select('like', ['count(*) as num_likes']).where(['article_id', 'user_id'], ['=', '='], [articleId, userId]);
    const result = await query.run();
    if (result.success) {
      if (result.data[0].num_likes > 0) {
        req.params.articleId = articleId;
        return deleteLike(req, res, next);
      } else {
        return createLike(req, res, next);
      }
    } else {
      throw ApiError.internal('Failed to toggle like');
    }
  } catch (error) {
    next(error);
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const userId = req.body.user_id || req.get('userId');
    const articleId = req.params.articleId;
    const query = new QueryBuilder().delete('like').where(['article_id', 'user_id'], ['=', '='], [articleId, userId]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Like deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete like');
    }
  } catch (error) {
    next(error);
  }
};

const deleteAllLikes = async (req, res, next) => {
  try {
    const userId = req.body.user_id || req.get('userId');
    const query = new QueryBuilder().delete('like').where(['user_id'], ['='], [userId]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Likes deleted successfully for user' });
    } else {
      throw ApiError.internal('Failed to delete all likes for user');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllArticleLikes, createLike, toggleLike, deleteLike, deleteAllLikes };
