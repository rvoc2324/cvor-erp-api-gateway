// models/ValidationModel.js
const Joi = require('joi');

// Auth service validation schemas
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'A valid email address is required.',
        'any.required': 'Email is required.'
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long.',
        'any.required': 'Password is required.'
    })
});

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    mobile: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'Mobile number must be a 10-digit number.',
        'any.required': 'Mobile number is required.'
    }),
    userName: Joi.string().optional(),
    companyName: Joi.string().optional()
});

// OTP validation schema for MFA or verification routes
const otpSchema = Joi.object({
    otp: Joi.string().length(6).pattern(/^\d{6}$/).required().messages({
        'string.length': 'OTP must be exactly 6 digits.',
        'string.pattern.base': 'OTP must consist of only numeric digits.',
        'any.required': 'OTP is required.'
    })
});


// Profile request schema (Example for a request with URL params, which may not need body validation)
const profileSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'User ID is required.'
    })
});

// Blockchain service validation schemas
const blockchainRecordSchema = Joi.object({
    userId: Joi.string().required(),
    data: Joi.string().required(),
    signature: Joi.string().required()
});

// CRM service validation schemas
const crmCustomerSchema = Joi.object({
    customerId: Joi.string().required(),
    customerName: Joi.string().optional(),
    contactInfo: Joi.string().optional()
});

// Detau service validation schemas
const detauDataSchema = Joi.object({
    userId: Joi.string().required(),
    requestData: Joi.string().required()
});

// Verification service validation schemas
const verificationSchema = Joi.object({
    userId: Joi.string().required(),
    documentId: Joi.string().required(),
    documentType: Joi.string().valid('passport', 'id_card', 'driver_license').required()
});

// Encryption service validation schemas
const encryptionSchema = Joi.object({
    data: Joi.string().required().messages({
        'any.required': 'Data is required for encryption.'
    }),
    encryptionKey: Joi.string().required().messages({
        'any.required': 'Encryption key is required.'
    })
});

const decryptionSchema = Joi.object({
    encryptedData: Joi.string().required().messages({
        'any.required': 'Encrypted data is required for decryption.'
    }),
    decryptionKey: Joi.string().required().messages({
        'any.required': 'Decryption key is required.'
    })
});

module.exports = {
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
};



