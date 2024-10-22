const express = require('express');

const AuthController = require('../controllers/AuthController');  // Updated to use service-specific controllers
const BlockchainController = require('../controllers/BlockchainController');
const CRMController = require('../controllers/CRMController');
const DetauController = require('../controllers/DetauController');
const VerificationController = require('../controllers/VerificationController');
const EncryptionController = require('../controllers/EncryptionController');

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
} = require('../models/ValidationSchema');

const router = express.Router();

// Auth Service Routes
router.post(
    '/login',
    bruteForceProtectionMiddleware.loginRateLimit,   // Apply brute force protection for login attempts
    validate(loginSchema),
    AuthController.initiateLogin
);

router.post(
    '/register/individual',
    validate(registerSchema),
    AuthController.registerIndividual
);

router.post(
    '/register/enterprise',
    validate(registerSchema),
    AuthController.registerEnterprise
);

router.post(
    '/verify-otp',
    bruteForceProtectionMiddleware.otpormfaprotectionMiddleware,  // Apply brute force protection for OTP/MFA attempts
    validate(otpSchema),
    AuthController.verifyOTP
);

router.post(
    '/mfa',
    bruteForceProtectionMiddleware.otpormfaprotectionMiddleware,  // Apply brute force protection for OTP/MFA attempts
    validate(otpSchema),
    AuthController.setupMFA
);

router.post(
    '/profile/:id',
    authMiddleware,
    validate(profileSchema),
    AuthController.getProfile  // Add the appropriate method in AuthController if it doesn't exist
);

router.post(
    '/logout',
    authMiddleware,
    AuthController.logout
);

// Blockchain Service Routes
router.post(
    '/blockchain/record',
    authMiddleware,
    validate(blockchainRecordSchema),
    BlockchainController.createRecord
);

// CRM Service Routes
router.get(
    '/crm/customer/:id',
    authMiddleware,
    CRMController.getCustomer
);

router.post(
    '/crm/customer',
    authMiddleware,
    validate(crmCustomerSchema),
    CRMController.createCustomer
);

// Detau Service Routes
router.get(
    '/detau/data/:id',
    authMiddleware,
    DetauController.getData
);

router.post(
    '/detau/data',
    authMiddleware,
    validate(detauDataSchema),
    DetauController.saveData
);

// Verification Service Routes
router.post(
    '/verification/verify',
    authMiddleware,
    validate(verificationSchema),
    VerificationController.verifyUserData
);

// Encryption Service Routes
router.post(
    '/encryption/encrypt',
    authMiddleware,
    validate(encryptionSchema),
    EncryptionController.encryptData
);

router.post(
    '/encryption/decrypt',
    authMiddleware,
    validate(decryptionSchema),
    EncryptionController.decryptData
);

// Health Check Route (General for the Gateway)
router.get('/health', (req, res) => res.status(200).json({ status: 'Gateway is healthy' }));

module.exports = router;
