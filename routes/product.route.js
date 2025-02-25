const express = require('express');
const productController = require('../controllers/product.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/product.model');
const checkCache = require('../middlewares/cache.middleware');
const router = express.Router();

router.get('/all/category/:categoryId', checkCache, productController.getAllProductsByCategoryId);
router.get('/all/subcategory/:subcategoryId', checkCache, productController.getAllProductsBySubcategoryId);
router.get('/all/thirdcategory/:thirdcategoryId', checkCache, productController.getAllProductsByThirdcategoryId);
router.get('/all/country/:countryId', checkCache, productController.getAllProductsByCountryId);
router.get('/all/city/:cityId', checkCache, productController.getAllProductsByCityId);
router.get('/all/area/:areaId', checkCache, productController.getAllProductsByAreaId);
router.get('/all/search', checkCache, productController.getAllProductsBySearch);
router.get('/all', checkCache, productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', validateRequestBody(createSchema), checkCache, productController.createProduct);
router.put('/:id', validateRequestBody(editSchema), checkCache, productController.editProduct);
router.delete('/:id', checkCache, productController.deleteProduct);

module.exports = router;
