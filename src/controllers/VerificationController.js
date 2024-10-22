// src/controllers/VerificationController.js

const axios = require('axios');
const Logger = require('../utils/Logger'); // Import a custom Logger for structured logging
const { errorHandler } = require('../utils/errorHandler'); // Import a custom error handler

// Base URL for the Verification Service, configurable for different environments
const verificationServiceBaseUrl = process.env.VERIFICATION_SERVICE_URL || 'http://verification-service/api';

/**
 * Verify user identity or data
 * @param {Object} verificationPayload - The data payload to be verified (e.g., userID, document, or other verification details)
 * @returns {Promise<Object>} - The verification result or an error message
 */
async function verifyUserData(verificationPayload) {
    try {
        Logger.info(`VerificationController: verifyUserData - Initiating verification request at ${new Date().toISOString()}`);

        // Send POST request to Verification Service for identity or data verification
        const response = await axios.post(`${verificationServiceBaseUrl}/verify`, verificationPayload);

        Logger.info(`VerificationController: verifyUserData - Verification successful at ${new Date().toISOString()}`);

        // Return verification result if request is successful
        return response.data;
    } catch (error) {
        Logger.error(`VerificationController: verifyUserData - Verification failed at ${new Date().toISOString()}`);
        return errorHandler.handleError(error, 'verifyUserData');
    }
}

// Export the controller methods
module.exports = {
    verifyUserData,
};
