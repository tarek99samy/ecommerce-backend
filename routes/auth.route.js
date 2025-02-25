const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateRequestBody } = require('../middlewares/validation.middleware');
const { loginWithEmailSchema, loginWithPhoneSchema, registerSchema, resetPasswordSchema } = require('../models/user.model');
const router = express.Router();

router.post('/login/byEmail', validateRequestBody(loginWithEmailSchema), authController.loginWithEmail);
router.post('/login', validateRequestBody(loginWithPhoneSchema), authController.loginWithPhone);
router.post('/register', validateRequestBody(registerSchema), authController.register);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', validateRequestBody(resetPasswordSchema), authController.resetPassword);

module.exports = router;
