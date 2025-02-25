const express = require('express');
const archiveController = require('../controllers/archive.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/archive.model');
const router = express.Router();

router.get('/all', archiveController.getAllArchives);
router.get('/:id', archiveController.getArchiveById);
router.post('/', validateRequestBody(createSchema), archiveController.createArchive);
router.put('/:id', validateRequestBody(editSchema), archiveController.editArchive);
router.delete('/:entityId/:entityType', archiveController.deleteArchive);
router.delete('/:id', archiveController.deleteArchiveById);

module.exports = router;
