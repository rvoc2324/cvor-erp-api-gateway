const axios = require('axios');
const Logger = require('../utils/Logger'); // Import a custom Logger for structured logging

class VerificationServiceIntegration {
    // Base URL for the Verification Service, configured dynamically based on environment (development, production, etc.)
    static verificationServiceBaseUrl = process.env.VERIFICATION_SERVICE_URL || 'http://verification-service/api';

    /**
     * Verify user identity or data
     * @param {Object} verificationPayload - The data payload to be verified (e.g., userID, document, or other verification details)
     * @returns {Promise<Object>} - The verification result or an error message
     */
    static async verifyUserData(verificationPayload) {
        try {
            Logger.info(`VerificationServiceIntegration: verifyUserData - Initiating verification request at ${new Date().toISOString()}`);

            // Send POST request to Verification Service for identity or data verification
            const response = await axios.post(`${this.verificationServiceBaseUrl}/verify`, verificationPayload);

            Logger.info(`VerificationServiceIntegration: verifyUserData - Verification successful at ${new Date().toISOString()}`);

            // Return verification result if request is successful
            return response.data;
        } catch (error) {
            Logger.error(`VerificationServiceIntegration: verifyUserData - Verification failed at ${new Date().toISOString()}`);
            return this.handleError(error, 'verifyUserData');
        }
    }

    /**
     * Handle error responses and log appropriately.
     * @param {Object} error - Axios error object
     * @param {string} methodName - The method name where the error occurred
     * @returns {Error} - Custom error message based on the error type
     */
    static handleError(error, methodName) {
        if (error.response) {
            Logger.error(`VerificationServiceIntegration: ${methodName} - Received error response with status ${error.response.status} at ${new Date().toISOString()}`);

            // Handle specific error responses
            switch (error.response.status) {
                case 400:
                    return new Error('Invalid verification data provided.');
                case 404:
                    return new Error('Verification data not found.');
                case 422:
                    return new Error('Verification process failed due to invalid input.');
                default:
                    return new Error('Failed to process the verification request.');
            }
        } else {
            // Handle network or unexpected errors
            Logger.error(`VerificationServiceIntegration: ${methodName} - Network or unexpected error: ${error.message} at ${new Date().toISOString()}`);
            return new Error('Unable to reach Verification service.');
        }
    }
}

module.exports = VerificationServiceIntegration;
