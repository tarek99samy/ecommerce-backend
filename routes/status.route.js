const express = require('express');
const statusController = require('../controllers/status.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/status.model');
const router = express.Router();

router.get('/all', statusController.getAllStatuses);
router.get('/:id', statusController.getStatusById);
router.post('/', validateRequestBody(createSchema), statusController.createStatus);
router.put('/:id', validateRequestBody(editSchema), statusController.editStatus);
router.delete('/:id', statusController.deleteStatus);

module.exports = router;
