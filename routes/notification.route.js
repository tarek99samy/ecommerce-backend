const express = require('express');
const notificationController = require('../controllers/notification.controller');
const router = express.Router();

router.get('/all/user/:userId', notificationController.getAllNotificationsByUserId);
router.get('/all', notificationController.getAllNotifications);
router.get('/:id', notificationController.getNotificationById);
router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.editNotification);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
