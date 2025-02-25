const express = require('express');
const messageController = require('../controllers/message.controller');
const { upload } = require('../middlewares/fileHandler');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/message.model');
const router = express.Router();

router.get('/all/chat/:chatId', messageController.getAllMessagesByChatId);
router.get('/all', messageController.getAllMessages);
router.post('/', upload.single('media'), messageController.createMessage);
router.put('/:id', validateRequestBody(editSchema), messageController.editMessage);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
