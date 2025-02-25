const express = require('express');
const productAttributeController = require('../controllers/product-attribute.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema, createManySchema } = require('../models/product-attribute.model');
const router = express.Router();

router.get('/all/product/:productId', productAttributeController.getAllProductAttributesByProductId);
router.get('/all', productAttributeController.getAllProductAttributes);
router.post('/many', validateRequestBody(createManySchema), productAttributeController.createManyProductAttribute);
router.post('/', validateRequestBody(createSchema), productAttributeController.createProductAttribute);
router.put('/:id', validateRequestBody(editSchema), productAttributeController.editProductAttribute);
router.delete('/:id', productAttributeController.deleteProductAttribute);

module.exports = router;
