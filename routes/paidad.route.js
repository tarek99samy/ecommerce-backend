const express = require('express');
const paidAdController = require('../controllers/paidad.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/paidad.model');
const router = express.Router();

router.get('/top', paidAdController.getAllTopPaidAds);
router.get('/all/category/:categoryId', paidAdController.getAllPaidAdsByCategoryId);
router.get('/all/premium', paidAdController.getAllPremiumPaidAds);
router.get('/all/active', paidAdController.getAllActivePaidAds);
router.get('/all', paidAdController.getAllPaidAds);
router.get('/random/category/:categoryId', paidAdController.getRandomPaidAdByCategoryId);
router.post('/', validateRequestBody(createSchema), paidAdController.createPaidAd);
router.put('/:id', validateRequestBody(editSchema), paidAdController.editPaidAd);
router.delete('/:id', paidAdController.deletePaidAd);

module.exports = router;
