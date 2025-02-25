const express = require('express');
const adController = require('../controllers/ad.controller');
const { validateRequestBody, validateRequestHeaders } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/ad.model');
const checkCache = require('../middlewares/cache.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/all/active', verifyToken, validateRequestHeaders, checkCache, adController.getAllActiveAds);
router.get('/all/user', checkCache, adController.getAllAdsByUserId);
router.get('/all', verifyToken, validateRequestHeaders, checkCache, adController.getAllAds);
router.get('/:id', verifyToken, validateRequestHeaders, adController.getAdById);
router.post('/', verifyToken, validateRequestHeaders, validateRequestBody(createSchema), checkCache, adController.createAd);
router.put('/:id', verifyToken, validateRequestHeaders, validateRequestBody(editSchema), checkCache, adController.editAd);
router.delete('/:id', verifyToken, validateRequestHeaders, checkCache, adController.deleteAd);

module.exports = router;
