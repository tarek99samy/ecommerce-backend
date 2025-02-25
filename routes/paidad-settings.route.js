const express = require('express');
const paidadSettingsController = require('../controllers/paidad-settings.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/paidad-settings.model');
const router = express.Router();

router.get('/all', paidadSettingsController.getAllPaidAdSettings);
router.get('/:id', paidadSettingsController.getPaidAdSettingsById);
router.post('/', validateRequestBody(createSchema), paidadSettingsController.createPaidAdSettings);
router.put('/:id', validateRequestBody(editSchema), paidadSettingsController.editPaidAdSettings);
router.delete('/:id', paidadSettingsController.deletePaidAdSettings);

module.exports = router;
