const express = require('express');
const countryController = require('../controllers/country.controller');
const { validateRequestBody, validateRequestHeaders } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/country.model');
const { verifyToken } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/all', countryController.getAllCountries);
router.get('/:id', countryController.getCountryById);
router.post('/', verifyToken, validateRequestHeaders, validateRequestBody(createSchema), countryController.createCountry);
router.put('/:id', verifyToken, validateRequestHeaders, validateRequestBody(editSchema), countryController.editCountry);
router.delete('/:id', verifyToken, validateRequestHeaders, countryController.deleteCountry);

module.exports = router;
