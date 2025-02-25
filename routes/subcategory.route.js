const express = require('express');
const subcategoryController = require('../controllers/subcategory.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/subcategory.model');
const router = express.Router();

router.get('/all/:categoryId', subcategoryController.getAllSubcategoriesByCategoryId);
router.get('/all', subcategoryController.getAllSubcategories);
router.get('/:id', subcategoryController.getSubcategoryById);
router.post('/', validateRequestBody(createSchema), subcategoryController.createSubcategory);
router.put('/:id', validateRequestBody(editSchema), subcategoryController.editSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;
