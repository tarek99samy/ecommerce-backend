const express = require('express');
const thirdcategoryController = require('../controllers/thirdcategory.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/thirdcategory.model');
const router = express.Router();

router.get('/all', thirdcategoryController.getAllThirdcategories);
router.get('/:id', thirdcategoryController.getThirdcategoryById);
router.post('/', validateRequestBody(createSchema), thirdcategoryController.createThirdcategory);
router.put('/:id', validateRequestBody(editSchema), thirdcategoryController.editThirdcategory);
router.delete('/:id', thirdcategoryController.deleteThirdcategory);

module.exports = router;
