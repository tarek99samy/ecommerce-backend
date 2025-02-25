const express = require('express');
const userSuspensionController = require('../controllers/user-suspension.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/user-suspension.model');
const router = express.Router();

router.get('/user', userSuspensionController.getUserSuspensionByUserId);
router.get('/all', userSuspensionController.getAllUserSuspensions);
router.get('/:id', userSuspensionController.getUserSuspensionById);
router.post('/', validateRequestBody(createSchema), userSuspensionController.createUserSuspension);
router.put('/:id', validateRequestBody(editSchema), userSuspensionController.editUserSuspension);
router.delete('/:id', userSuspensionController.deleteUserSuspension);

module.exports = router;
