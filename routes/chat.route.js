const express = require('express');
const chatController = require('../controllers/chat.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema } = require('../models/chat.model');
const router = express.Router();

router.get('/all/user', chatController.getAllChatsByUserId);
router.get('/all', chatController.getAllChats);
router.get('/:senderId/:receiverId/:productId', chatController.getChatBetweenTwoUsersOnProduct);
router.post('/', validateRequestBody(createSchema), chatController.createChat);
router.delete('/:id', chatController.deleteChat);

module.exports = router;
