const express = require('express');
const userAdPackageController = require('../controllers/user-adpackage.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema, createManySchema } = require('../models/user-adpackage.model');
const router = express.Router();

router.get('/all/adpackage/:adpackageId', userAdPackageController.getAllUserAdpackagesByAdpackageId);
router.get('/all/user', userAdPackageController.getAllUserAdpackagesByUserId);
router.get('/all', userAdPackageController.getAllUserAdpackages);
router.get('/:id', userAdPackageController.getUserAdpackageById);
router.post('/many', validateRequestBody(createManySchema), userAdPackageController.createManyUserAdpackages);
router.post('/', validateRequestBody(createSchema), userAdPackageController.createUserAdpackage);
router.put('/:id', validateRequestBody(editSchema), userAdPackageController.editUserAdpackage);
router.delete('/:id', userAdPackageController.deleteUserAdpackage);

module.exports = router;
