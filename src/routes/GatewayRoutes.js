const express = require('express');
const GatewayController = require('../controllers/GatewayController');
const authMiddleware = require('../middleware/AuthMiddleware');
const validate = require('../middleware/ValidationMiddleware');
const bruteForceProtectionMiddleware = require('../middleware/BruteForceProtectionMiddleware');

// Importing schemas from ValidationModel
const {
    loginSchema,
    otpSchema,
    registerSchema,
    profileSchema,
    blockchainRecordSchema,
    crmCustomerSchema,
    detauDataSchema,
    verificationSchema,
    encryptionSchema,
    decryptionSchema
} = require('../models/ValidationModel');

const router = express.Router();

// Auth Service Routes
router.post(
    '/auth/login',
    bruteForceProtectionMiddleware.loginRateLimit,   // Apply brute force protection for login attempts
    validate(loginSchema),
    GatewayController.handleAuthRequest
);

router.post(
    '/auth/register',
    validate(registerSchema),
    GatewayController.handleAuthRequest
);

router.post(
    '/auth/verify-otp',
    bruteForceProtectionMiddleware.otpormfaprotectionMiddleware,  // Apply brute force protection for OTP/MFA attempts
    validate(otpSchema),
    GatewayController.handleAuthRequest // Assuming the existence of this controller for OTP
);

router.get(
    '/auth/profile/:id',
    authMiddleware,
    validate(profileSchema),
    GatewayController.handleAuthRequest
);

router.post(
    '/auth/logout',
    authmiddleware,
    GatewayController.handleAuthRequest // Assuming the existence of this controller for OTP
);

// Blockchain Service Routes
router.post(
    '/blockchain/record',
    authMiddleware,
    validate(blockchainRecordSchema),
    GatewayController.handleBlockchainRequest
);

// CRM Service Routes
router.get(
    '/crm/customer/:id',
    authMiddleware,
    GatewayController.handleCRMRequest
);

router.post(
    '/crm/customer',
    authMiddleware,
    validate(crmCustomerSchema),
    GatewayController.handleCRMRequest
);

// Detau Service Routes
router.get(
    '/detau/data/:id',
    authMiddleware,
    GatewayController.handleDetauRequest
);

router.post(
    '/detau/data',
    authMiddleware,
    validate(detauDataSchema),
    GatewayController.handleDetauRequest
);

// Verification Service Routes
router.post(
    '/verification/verify',
    authMiddleware,
    validate(verificationSchema),
    GatewayController.handleVerificationRequest
);

// Encryption Service Routes
router.post(
    '/encryption/encrypt',
    authMiddleware,
    validate(encryptionSchema),
    GatewayController.handleEncryptionRequest
);

router.post(
    '/encryption/decrypt',
    authMiddleware,
    validate(decryptionSchema),
    GatewayController.handleEncryptionRequest
);

// Health Check Route (General for the Gateway)
router.get('/health', GatewayController.healthCheck);

module.exports = router;
