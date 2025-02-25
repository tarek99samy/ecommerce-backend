const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllArticleDislikes = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const query = new QueryBuilder().select('dislike', ['count(*) as num_dislikes']).where(['article_id'], ['='], [articleId]);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ num_dislikes: result.data[0].num_dislikes });
    } else {
      throw ApiError.internal('Failed to get dislikes on article');
    }
  } catch (error) {
    next(error);
  }
};

const createDislike = async (req, res, next) => {
  try {
    const values = { article_id: req.body.article_id, user_id: req.body.user_id || req.get('userId') };
    const query = new QueryBuilder().insert('dislike', values);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.CREATED).json({ message: 'Dislike created successfully' });
    } else {
      throw ApiError.internal('Failed to create dislike');
    }
  } catch (error) {
    next(error);
  }
};

const toggleDislike = async (req, res, next) => {
  try {
    const userId = req.body.user_id || req.get('userId');
    const articleId = req.body.article_id;
    const query = new QueryBuilder()
      .select('dislike', ['count(*) as num_dislikes'])
      .where(['article_id', 'user_id'], ['=', '='], [articleId, userId]);
    const result = await query.run();
    if (result.success) {
      if (result.data[0].num_dislikes > 0) {
        req.params.articleId = articleId;
        return deleteDislike(req, res, next);
      } else {
        return createDislike(req, res, next);
      }
    } else {
      throw ApiError.internal('Failed to toggle dislike');
    }
  } catch (error) {
    next(error);
  }
};

const deleteDislike = async (req, res, next) => {
  try {
    const userId = req.body.user_id || req.get('userId');
    const articleId = req.params.articleId;
    const query = new QueryBuilder().delete('dislike').where(['article_id', 'user_id'], ['=', '='], [articleId, userId]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Dislike deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete dislike');
    }
  } catch (error) {
    next(error);
  }
};

const deleteAllDislikes = async (req, res, next) => {
  try {
    const userId = req.body.user_id || req.get('userId');
    const query = new QueryBuilder().delete('dislike').where(['user_id'], ['='], [userId]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Dislikes deleted successfully for user' });
    } else {
      throw ApiError.internal('Failed to delete all dislikes for user');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllArticleDislikes, createDislike, toggleDislike, deleteDislike, deleteAllDislikes };
