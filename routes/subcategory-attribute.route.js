const express = require('express');
const subcategoryAttributeController = require('../controllers/subcategory-attribute.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/subcategory-attribute.model');
const router = express.Router();

router.get('/all/subcategory/:subcategoryId', subcategoryAttributeController.getAllSubcategoryAttributesBySubcategoryId);
router.get('/all', subcategoryAttributeController.getAllSubcategoryAttributes);
router.get('/:id', subcategoryAttributeController.getSubcategoryAttributeById);
router.post('/', validateRequestBody(createSchema), subcategoryAttributeController.createSubcategoryAttribute);
router.put('/:id', validateRequestBody(editSchema), subcategoryAttributeController.editSubcategoryAttribute);
router.delete('/:id', subcategoryAttributeController.deleteSubcategoryAttribute);

module.exports = router;
