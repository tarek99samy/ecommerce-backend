const express = require('express');
const adpackageController = require('../controllers/adpackage.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/adpackage.model');
const router = express.Router();

router.get('/all/active', adpackageController.getAllActiveAdpackages);
router.get('/all', adpackageController.getAllAdpackages);
router.get('/:id', adpackageController.getAdpackageById);
router.post('/', validateRequestBody(createSchema), adpackageController.createAdpackage);
router.put('/:id', validateRequestBody(editSchema), adpackageController.editAdpackage);
router.delete('/:id', adpackageController.deleteAdpackage);

module.exports = router;
