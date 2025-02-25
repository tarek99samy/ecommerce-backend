const express = require('express');
const areaController = require('../controllers/area.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/area.model');
const router = express.Router();

router.get('/all/country/:countryId', areaController.getAllAreasInCountry);
router.get('/all/city/:cityId', areaController.getAllAreasInCity);
router.get('/all', areaController.getAllAreas);
router.get('/:id', areaController.getAreaById);
router.post('/', validateRequestBody(createSchema), areaController.createArea);
router.put('/:id', validateRequestBody(editSchema), areaController.editArea);
router.delete('/:id', areaController.deleteArea);

module.exports = router;
