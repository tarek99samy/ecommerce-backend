const express = require('express');
const reportController = require('../controllers/report.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/report.model');
const router = express.Router();

router.get('/all', reportController.getAllReports);
router.get('/:id', reportController.getReportById);
router.post('/', validateRequestBody(createSchema), reportController.createReport);
router.put('/:id', validateRequestBody(editSchema), reportController.editReport);
router.delete('/:entityId/:entityType', reportController.deleteReport);
router.delete('/:id', reportController.deleteReportById);

module.exports = router;
