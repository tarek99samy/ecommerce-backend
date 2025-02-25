const express = require('express');
const commentController = require('../controllers/comment.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/comment.model');
const router = express.Router();

router.get('/all/article/:articleId', commentController.getAllCommentsByArticleId);
router.get('/all/user', commentController.getAllCommentsByUserId);
router.get('/all', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.post('/', validateRequestBody(createSchema), commentController.createComment);
router.put('/:id', validateRequestBody(editSchema), commentController.editComment);
router.delete('/article/:articleId', commentController.deleteArticleComments);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
