const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const prepareArticle = (acc, article) => {
  if (!acc[article.id]) {
    acc[article.id] = {
      ...article,
      is_liked: article.is_liked ? true : false,
      is_disliked: article.is_disliked ? true : false,
      category: {
        id: article.category_id,
        name: article.category_name
      }
    };
    delete acc[article.id].row_num;
    delete acc[article.id].category_name;
    delete acc[article.id].title_en;
    delete acc[article.id].title_ar;
    delete acc[article.id].description_en;
    delete acc[article.id].description_ar;
  }
  return acc;
};

const getAllArticlesByUserId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const userId = req.get('userId');
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('article', [
        `article.*, article.title_${lang} as title, article.description_${lang} as description`,
        `category.name_${lang} as category_name`,
        '(SELECT COUNT(*) FROM comment WHERE comment.article_id = article.id) as comment_count',
        'like.user_id as is_liked',
        'dislike.user_id as is_disliked'
      ])
      .join('category', 'category.id', 'article.category_id')
      .leftJoin('comment', 'comment.article_id', 'article.id')
      .leftJoin('like', ['like.article_id', 'like.user_id'], ['article.id', userId], true)
      .leftJoin('dislike', ['dislike.article_id', 'dislike.user_id'], ['article.id', userId], true)
      .where(['article.author_id'], ['='], [userId])
      .with('article.id')
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let articles = result.data;
      if (result.data.length > 0) {
        articles = Object.values(articles.reduce(prepareArticle, {}));
      }
      return res.status(httpStatus.OK).json({ articles });
    } else {
      throw ApiError.internal('Failed to get articles by user');
    }
  } catch (error) {
    next(error);
  }
};

const getAllArticlesByCategoryId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const categoryId = req.params.categoryId;
    const userId = req.get('userId');
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('article', [
        `article.*, article.title_${lang} as title, article.description_${lang} as description`,
        `category.name_${lang} as category_name`,
        '(SELECT COUNT(*) FROM comment WHERE comment.article_id = article.id) as comment_count',
        'like.user_id as is_liked',
        'dislike.user_id as is_disliked'
      ])
      .join('category', ['category.id', 'category.id'], ['article.category_id', categoryId], true)
      .leftJoin('comment', 'comment.article_id', 'article.id')
      .leftJoin('like', ['like.article_id', 'like.user_id'], ['article.id', userId], true)
      .leftJoin('dislike', ['dislike.article_id', 'dislike.user_id'], ['article.id', userId], true)
      .where(['article.status_id'], ['='], [1])
      .with('article.id')
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let articles = result.data;
      if (result.data.length > 0) {
        articles = Object.values(articles.reduce(prepareArticle, {}));
      }
      return res.status(httpStatus.OK).json({ articles });
    } else {
      throw ApiError.internal('Failed to get articles by category');
    }
  } catch (error) {
    next(error);
  }
};

const getAllArticlesFeatured = async (req, res, next) => {
  try {
    const lang = req.get('lang');
    const userId = req.get('userId');
    const query = new QueryBuilder()
      .select('article', [
        `article.*, article.title_${lang} as title, article.description_${lang} as description`,
        `category.name_${lang} as category_name`,
        '(SELECT COUNT(*) FROM comment WHERE comment.article_id = article.id) as comment_count',
        'like.user_id as is_liked',
        'dislike.user_id as is_disliked'
      ])
      .join('category', 'category.id', 'article.category_id')
      .leftJoin('comment', 'comment.article_id', 'article.id')
      .leftJoin('like', ['like.article_id', 'like.user_id'], ['article.id', userId], true)
      .leftJoin('dislike', ['dislike.article_id', 'dislike.user_id'], ['article.id', userId], true)
      .where(['article.status_id'], ['='], [1])
      .with('article.id')
      .limit(1, 5);

    const result = await query.run();
    if (result.success) {
      let articles = result.data;
      if (result.data.length > 0) {
        articles = Object.values(articles.reduce(prepareArticle, {}));
        articles = articles.sort((a, b) => +b.num_likes - +a.num_likes);
      }
      return res.status(httpStatus.OK).json({ articles });
    } else {
      throw ApiError.internal('Failed to get featured articles ');
    }
  } catch (error) {
    next(error);
  }
};

const getAllArticles = async (req, res, next) => {
  try {
    const { page } = req.query;
    const userId = req.get('userId');
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('article', [
        `article.*, article.title_${lang} as title, article.description_${lang} as description`,
        `category.name_${lang} as category_name`,
        '(SELECT COUNT(*) FROM comment WHERE comment.article_id = article.id) as comment_count',
        'like.user_id as is_liked',
        'dislike.user_id as is_disliked'
      ])
      .join('category', 'category.id', 'article.category_id')
      .leftJoin('comment', 'comment.article_id', 'article.id')
      .leftJoin('like', ['like.article_id', 'like.user_id'], ['article.id', userId], true)
      .leftJoin('dislike', ['dislike.article_id', 'dislike.user_id'], ['article.id', userId], true)
      .where(['article.status_id'], ['='], [1])
      .with('article.id')
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let articles = result.data;
      if (result.data.length > 0) {
        articles = Object.values(articles.reduce(prepareArticle, {}));
      }
      return res.status(httpStatus.OK).json({ articles });
    } else {
      throw ApiError.internal('Failed to get articles');
    }
  } catch (error) {
    next(error);
  }
};

const getAllArticlesPlain = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('article').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ articles: result.data });
    } else {
      throw ApiError.internal('Failed to get articles');
    }
  } catch (error) {
    next(error);
  }
};

const getArticleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.get('userId');
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('article', [
        `article.*, article.title_${lang} as title, article.description_${lang} as description`,
        `category.name_${lang} as category_name`,
        '(SELECT COUNT(*) FROM comment WHERE comment.article_id = article.id) as comment_count',
        'like.user_id as is_liked',
        'dislike.user_id as is_disliked'
      ])
      .join('category', 'category.id', 'article.category_id')
      .leftJoin('comment', 'comment.article_id', 'article.id')
      .leftJoin('like', ['like.article_id', 'like.user_id'], ['article.id', userId], true)
      .leftJoin('dislike', ['dislike.article_id', 'dislike.user_id'], ['article.id', userId], true)
      .where(['article.id'], ['='], [id]);

    const result = await query.run();
    if (result.success) {
      let article = result.data;
      if (result.data.length > 0) {
        article = Object.values(article.reduce(prepareArticle, {}));
      }
      return res.status(httpStatus.OK).json({ article });
    } else {
      throw ApiError.internal('Failed to get article');
    }
  } catch (error) {
    next(error);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const values = {
      author_id: req.body.author_id || req.get('userId'),
      category_id: req.body.category_id,
      title_en: req.body.title_en,
      title_ar: req.body.title_ar,
      description_en: req.body.description_en,
      description_ar: req.body.description_ar,
      datetime:
        req.body.datetime ||
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      image: req.body.image,
      num_likes: req.body.num_likes || 0,
      num_dislikes: req.body.num_dislikes || 0,
      status_id: req.body.status_id || 1
    };

    const query = new QueryBuilder().insert('article', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Article created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create article');
    }
  } catch (error) {
    next(error);
  }
};

const editArticle = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      author_id: req.body.author_id || req.get('userId'),
      category_id: req.body.category_id,
      title_en: req.body.title_en,
      title_ar: req.body.title_ar,
      description_en: req.body.description_en,
      description_ar: req.body.description_ar,
      datetime: req.body.datetime,
      image: req.body.image,
      num_likes: req.body.num_likes,
      num_dislikes: req.body.num_dislikes,
      status_id: req.body.status_id
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }

    const query = new QueryBuilder().update('article', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Article updated successfully' });
    } else {
      throw ApiError.internal('Failed to update article');
    }
  } catch (error) {
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('article').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Article deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete article');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArticlesByUserId,
  getAllArticlesByCategoryId,
  getAllArticlesFeatured,
  getAllArticles,
  getAllArticlesPlain,
  getArticleById,
  createArticle,
  editArticle,
  deleteArticle
};
