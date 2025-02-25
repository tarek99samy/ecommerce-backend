const express = require('express');
const productFeedbackController = require('../controllers/product-feedback.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/product-feedback.model');
const router = express.Router();

router.get('/all/ad/:adId', productFeedbackController.getAllProductFeedbacksByAdId);
router.get('/all', productFeedbackController.getAllProductFeedbacks);
router.post('/', validateRequestBody(createSchema), productFeedbackController.createProductFeedback);
router.put('/:id', validateRequestBody(editSchema), productFeedbackController.editProductFeedback);
router.delete('/:id', productFeedbackController.deleteProductFeedback);

module.exports = router;
