const express = require('express');
const likeController = require('../controllers/like.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema } = require('../models/like.model');
const router = express.Router();

router.get('/all/article/:articleId', likeController.getAllArticleLikes);
router.post('/', validateRequestBody(createSchema), likeController.createLike);
router.put('/toggle', validateRequestBody(createSchema), likeController.toggleLike);
router.delete('/:articleId', likeController.deleteLike);
router.delete('/', likeController.deleteAllLikes);

module.exports = router;
