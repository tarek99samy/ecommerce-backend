const express = require('express');
const settingsController = require('../controllers/settings.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const router = express.Router();

router.get('/all', settingsController.getAllSettings);
router.post('/', settingsController.createSettings);
router.put('/', settingsController.editSettings);
router.delete('/', settingsController.deleteSettings);

module.exports = router;
