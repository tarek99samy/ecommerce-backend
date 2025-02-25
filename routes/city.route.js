const express = require('express');
const cityController = require('../controllers/city.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/city.model');
const router = express.Router();

router.get('/all/country/:countryId', cityController.getAllCitiesInCountry);
router.get('/all', cityController.getAllCities);
router.get('/:id', cityController.getCityById);
router.post('/', validateRequestBody(createSchema), cityController.createCity);
router.put('/:id', validateRequestBody(editSchema), cityController.editCity);
router.delete('/:id', cityController.deleteCity);

module.exports = router;
