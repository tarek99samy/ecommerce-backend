const express = require('express');
const userController = require('../controllers/user.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createUserSchema, editUserSchema } = require('../models/user.model');
const router = express.Router();

router.get('/all/country/:countryId', userController.getAllActiveUsersInCountry);
router.get('/phone/:phone', userController.getUserByPhone);
router.get('/all/active', userController.getAllActiveUsers);
router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', validateRequestBody(createUserSchema), userController.createUser);
router.put('/:id', validateRequestBody(editUserSchema), userController.editUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
