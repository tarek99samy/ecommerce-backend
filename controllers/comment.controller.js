const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllCommentsByArticleId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const articleId = req.params.articleId;
    const query = new QueryBuilder()
      .select('comment', ['comment.*', 'user.name as user_name, user.icon as user_icon'])
      .join('user', 'user.id', 'comment.user_id')
      .where(['comment.article_id'], ['='], [articleId])
      .limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ comments: result.data });
    } else {
      throw ApiError.internal('Failed to get comments');
    }
  } catch (error) {
    next(error);
  }
};

const getAllCommentsByUserId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const userId = req.get('userId');
    const query = new QueryBuilder()
      .select('comment', ['comment.*', 'user.name as user_name, user.icon as user_icon'])
      .join('user', ['user.id', 'user.id'], ['comment.user_id', userId], true)
      .limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ comments: result.data });
    } else {
      throw ApiError.internal('Failed to get comments');
    }
  } catch (error) {
    next(error);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder()
      .select('comment', ['comment.*', 'user.name as user_name, user.icon as user_icon'])
      .join('user', 'user.id', 'comment.user_id')
      .limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ comments: result.data });
    } else {
      throw ApiError.internal('Failed to get comments');
    }
  } catch (error) {
    next(error);
  }
};

const getCommentById = async (req, res, next) => {
  try {
    const { page } = req.query;
    const id = req.params.id;
    const query = new QueryBuilder()
      .select('comment', ['comment.*', 'user.name as user_name, user.icon as user_icon'])
      .join('user', 'user.id', 'comment.user_id')
      .where(['comment.id'], ['='], [id])
      .limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ comment: result.data });
    } else {
      throw ApiError.internal('Failed to get comment');
    }
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const values = {
      article_id: req.body.article_id,
      user_id: req.body.user_id || req.get('userId'),
      description: req.body.description,
      datetime:
        req.body.datetime ||
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    };
    const query = new QueryBuilder().insert('comment', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Comment created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create comment');
    }
  } catch (error) {
    next(error);
  }
};

const editComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = { description: req.body.description };
    const query = new QueryBuilder().update('comment', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Comment updated successfully' });
    } else {
      throw ApiError.internal('Failed to update comment');
    }
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('comment').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Comment deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete comment');
    }
  } catch (error) {
    next(error);
  }
};

const deleteArticleComments = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const query = new QueryBuilder().delete('comment').where(['article_id'], ['='], [articleId]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Comments deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete comments on article');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCommentsByArticleId,
  getAllCommentsByUserId,
  getAllComments,
  getCommentById,
  createComment,
  editComment,
  deleteComment,
  deleteArticleComments
};
