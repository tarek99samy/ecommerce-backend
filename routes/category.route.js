const express = require('express');
const categoryController = require('../controllers/category.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/category.model');
const router = express.Router();

router.get('/all/children', categoryController.getAllCategoriesChildren);
router.get('/all', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', validateRequestBody(createSchema), categoryController.createCategory);
router.put('/:id', validateRequestBody(editSchema), categoryController.editCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
