const express = require('express');
const savedSearchController = require('../controllers/saved-search.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { createSchema, editSchema } = require('../models/saved-search.model');
const router = express.Router();

router.get('/all/user', savedSearchController.getAllSavedSearchesByUserId);
router.get('/all', savedSearchController.getAllSavedSearches);
router.get('/:id', savedSearchController.getSavedSearchById);
router.post('/', validateRequestBody(createSchema), savedSearchController.createSavedSearch);
router.put('/:id', validateRequestBody(editSchema), savedSearchController.editSavedSearch);
router.delete('/:id', savedSearchController.deleteSavedSearch);

module.exports = router;
