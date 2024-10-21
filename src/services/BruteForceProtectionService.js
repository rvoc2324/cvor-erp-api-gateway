const BruteForceLog = require('../models/BruteForceLogSchema'); // Import the Mongoose schema
const config = require('../config');
const logger = require('../utils/logger'); // Use local logger

class BruteForceProtectionService {
    // Mild login rate-limiting function
    async loginRateLimitAttempt(identifier, ip) {
        const now = Date.now();
        let logEntry = await BruteForceLog.findOne({ userId: identifier, ip });

        if (!logEntry) {
            logEntry = new BruteForceLog({ userId: identifier, ip });
        }

        logEntry.failedAttempts += 1;
        logEntry.lastFailedAttempt = new Date();

        if (logEntry.failedAttempts > config.LOGIN_RATE_LIMIT_ATTEMPTS) {
            logEntry.locked = true;
            logEntry.lockUntil = new Date(now + config.LOCK_TIME); // Lock the account for a set duration
            await logEntry.save();
            logger.warn(`Login rate limit reached for user: ${identifier}, IP: ${ip}`);
            return { allowed: false, rateLimited: true };
        }

        await logEntry.save();
        return { allowed: true, rateLimited: false };
    }

    // Full brute-force protection for OTP/MFA
    async otpOrMfaAttempt(userId, isFailed, ip) {
        let logEntry = await BruteForceLog.findOne({ userId, ip });

        if (!logEntry) {
            logEntry = new BruteForceLog({ userId, ip });
        }

        const now = Date.now();

        // Check if account is locked
        if (logEntry.locked && logEntry.lockUntil > now) {
            return { allowed: false, locked: true, rateLimited: false };
        }

        if (isFailed) {
            logEntry.failedAttempts += 1;
            logEntry.lastFailedAttempt = new Date();

            // Lock account if the failed attempts exceed the limit
            if (logEntry.failedAttempts >= config.MAX_FAILED_ATTEMPTS) {
                logEntry.locked = true;
                logEntry.lockUntil = new Date(now + config.LOCK_TIME);
                await logEntry.save();
                logger.warn(`Account locked for user: ${userId}, IP: ${ip} due to failed OTP/MFA attempts.`);
                return { allowed: false, locked: true, rateLimited: false };
            }
        } else {
            // Reset failed attempts on success
            logEntry.failedAttempts = 0;
            logEntry.locked = false;
            logEntry.lockUntil = null;
        }

        await logEntry.save();
        return { allowed: true, locked: false, rateLimited: false };
    }
}

module.exports = new BruteForceProtectionService(); // Export as a singleton
