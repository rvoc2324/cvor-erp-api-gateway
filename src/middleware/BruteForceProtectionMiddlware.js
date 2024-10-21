const BruteForceProtectionService = require('../services/BruteForceProtectionService');
const logger = require('../utils/logger'); // Use local logger

// Mild protection for login attempts
async function loginRateLimitMiddleware(req, res, next) {
    const identifier = req.body.email || req.body.mobile; // Using email/mobile as identifier
    const ip = req.ip;

    try {
        const protectionResult = await BruteForceProtectionService.loginRateLimitAttempt(identifier, ip);

        if (protectionResult.rateLimited) {
            logger.warn(`Rate limited: ${identifier}, IP: ${ip}`);
            return res.status(429).json({ message: 'Too many login attempts. Please try again later.' });
        }

        next(); // Proceed if login is allowed
    } catch (error) {
        logger.error('loginRateLimitMiddleware', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}

// Full brute-force protection for OTP/MFA attempts
async function otpormfaprotectionMiddleware(req, res, next) {
    const userId = req.body.userId; // Assuming userId is sent in the request body
    const isFailed = req.body.isFailed; // Define based on your authentication logic
    const ip = req.ip;

    try {
        const protectionResult = await BruteForceProtectionService.otpOrMfaAttempt(userId, isFailed, ip);

        if (protectionResult.locked) {
            logger.warn(`Account locked for user: ${userId}, IP: ${ip}`);
            return res.status(403).json({ message: 'Account is locked due to too many failed attempts' });
        }

        if (protectionResult.rateLimited) {
            logger.warn(`Rate limited for OTP/MFA: ${userId}, IP: ${ip}`);
            return res.status(429).json({ message: 'Too many OTP/MFA attempts. Please try again later.' });
        }

        next();
    } catch (error) {
        logger.error('otpormfaprotectionMiddleware', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}

module.exports = { loginRateLimitMiddleware, otpormfaprotectionMiddleware };
