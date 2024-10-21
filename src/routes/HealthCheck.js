// src/routes/AuthRoutes.js

const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middleware/AuthMiddleware');
const { initiateLoginSchema, otpSchema, mfaSetupSchema } = require('../models/ValidationSchema');
const validate = require('../middlewares/ValidationMiddleware');
const bruteForceProtectionMiddleware = require('../middlewares/BruteForceProtectionMiddleware');
const router = express.Router();

// Route for initiating login without password
router.post(
    '/login/initiate',
    bruteForceProtectionMiddleware.loginRateLimit, // Using login rate limit middleware
    validate(initiateLoginSchema),
    AuthController.initiateLogin
);

// Route for OTP verification with brute force protection
router.post(
    '/login/verify-otp',
    bruteForceProtectionMiddleware.otpormfaprotection, // Using OTP/MFA protection middleware
    validate(otpSchema),
    AuthController.verifyOTP
);

// Route for MFA setup after first login
router.post(
    '/mfa/setup',
    AuthMiddleware.verifyToken,
    validate(mfaSetupSchema),
    AuthController.setupMFA
);

// Route for logout
router.post('/logout', AuthMiddleware.verifyToken, AuthController.logout);

module.exports = router;
