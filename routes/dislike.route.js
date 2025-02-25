const express = require('express');
const dislikeController = require('../controllers/dislike.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema } = require('../models/dislike.model');
const router = express.Router();

router.get('/all/articleId/:articleId', dislikeController.getAllArticleDislikes);
router.post('/', validateRequestBody(createSchema), dislikeController.createDislike);
router.put('/toggle', validateRequestBody(createSchema), dislikeController.toggleDislike);
router.delete('/:articleId', dislikeController.deleteDislike);
router.delete('/', dislikeController.deleteAllDislikes);

module.exports = router;
