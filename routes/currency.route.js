const express = require('express');
const currencyController = require('../controllers/currency.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/currency.model');
const router = express.Router();

router.get('/all', currencyController.getAllCurrencies);
router.get('/:id', currencyController.getCurrencyById);
router.post('/', validateRequestBody(createSchema), currencyController.createCurrency);
router.put('/:id', validateRequestBody(editSchema), currencyController.editCurrency);
router.delete('/:id', currencyController.deleteCurrency);

module.exports = router;
