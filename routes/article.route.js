const express = require('express');
const articleController = require('../controllers/article.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/article.model');
const router = express.Router();

router.get('/all/category/:categoryId', articleController.getAllArticlesByCategoryId);
router.get('/all/user', articleController.getAllArticlesByUserId);
router.get('/all/featured', articleController.getAllArticlesFeatured);
router.get('/all/formated', articleController.getAllArticles);
router.get('/all', articleController.getAllArticlesPlain);
router.get('/:id', articleController.getArticleById);
router.post('/', validateRequestBody(createSchema), articleController.createArticle);
router.put('/:id', validateRequestBody(editSchema), articleController.editArticle);
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
