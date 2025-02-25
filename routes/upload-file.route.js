const express = require('express');
const { upload } = require('../middlewares/fileHandler');
const checkCache = require('../middlewares/cache.middleware');
const uploadFileController = require('../controllers/upload-file.controller');
const router = express.Router();

router.post('/product/:id', upload.array('media'), checkCache, uploadFileController.uploadProductMedia);
router.delete('/product/:id', checkCache, uploadFileController.deleteProductMedia);
router.post('/paidad/:id', upload.single('image'), uploadFileController.uploadPaidAdImage);
router.delete('/paidad/:id', uploadFileController.deletePaidAdImage);
router.post('/article/:id', upload.single('image'), uploadFileController.uploadArticleImage);
router.delete('/article/:id', uploadFileController.deleteArticleImage);
router.post('/adpackage/:id', upload.single('icon'), uploadFileController.uploadAdPackageImage);
router.delete('/adpackage/:id', uploadFileController.deleteAdPackageImage);
router.post('/user/:id', upload.single('icon'), uploadFileController.uploadUserIcon);
router.delete('/user/:id', uploadFileController.deleteUserIcon);
router.post('/category/:id', upload.single('icon'), uploadFileController.uploadCategoryIcon);
router.delete('/category/:id', uploadFileController.deleteCategoryIcon);
router.post('/subcategory/:id', upload.single('icon'), uploadFileController.uploadSubCategoryIcon);
router.delete('/subcategory/:id', uploadFileController.deleteSubCategoryIcon);
router.post('/thirdcategory/:id', upload.single('icon'), uploadFileController.uploadThirdCategoryIcon);
router.delete('/thirdcategory/:id', uploadFileController.deleteThirdCategoryIcon);

module.exports = router;
