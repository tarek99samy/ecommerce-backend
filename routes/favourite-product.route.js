const express = require('express');
const favouriteProductController = require('../controllers/favourite-product.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/favourite-product.model');
const checkCache = require('../middlewares/cache.middleware');
const router = express.Router();

router.get('/all/user', favouriteProductController.getAllFavouriteProductsByUserId);
router.get('/all', favouriteProductController.getAllFavouriteProducts);
router.post('/', validateRequestBody(createSchema), checkCache, favouriteProductController.createFavouriteProduct);
router.put('/toggle', validateRequestBody(createSchema), checkCache, favouriteProductController.toggleFavouriteProduct);
router.put('/:id', validateRequestBody(editSchema), checkCache, favouriteProductController.editFavouriteProduct);
router.delete('/product/:productId', checkCache, favouriteProductController.deleteFavouriteProductByUserIdAndProductId);
router.delete('/', checkCache, favouriteProductController.deleteFavouriteProductByUserId);

module.exports = router;
