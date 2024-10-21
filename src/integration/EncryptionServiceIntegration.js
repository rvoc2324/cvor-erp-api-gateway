const axios = require('axios');
const Logger = require('../utils/Logger'); // Import a custom Logger for structured logging

class EncryptionServiceIntegration {
    // Base URL for the Encryption Service, configurable for different environments
    static encryptionServiceBaseUrl = process.env.ENCRYPTION_SERVICE_URL || 'http://encryption-service/api';

    /**
     * Encrypt data
     * @param {Object} data - The data to be encrypted
     * @returns {Promise<Object>} - The encrypted data or an error message
     */
    static async encryptData(data) {
        try {
            Logger.info(`EncryptionServiceIntegration: Sending encryption request at ${new Date().toISOString()}`);

            // Send POST request to Encryption Service for encrypting data
            const response = await axios.post(`${this.encryptionServiceBaseUrl}/encrypt`, data);

            Logger.info(`EncryptionServiceIntegration: Encryption request successful at ${new Date().toISOString()}`);

            // Return encrypted data if request is successful
            return response.data;
        } catch (error) {
            Logger.error(`EncryptionServiceIntegration: Failed to encrypt data at ${new Date().toISOString()}`);
            return this.handleError(error, 'encryptData');
        }
    }

    /**
     * Decrypt data
     * @param {Object} encryptedData - The data to be decrypted
     * @returns {Promise<Object>} - The decrypted data or an error message
     */
    static async decryptData(encryptedData) {
        try {
            Logger.info(`EncryptionServiceIntegration: Sending decryption request at ${new Date().toISOString()}`);

            // Send POST request to Encryption Service for decrypting data
            const response = await axios.post(`${this.encryptionServiceBaseUrl}/decrypt`, encryptedData);

            Logger.info(`EncryptionServiceIntegration: Decryption request successful at ${new Date().toISOString()}`);

            // Return decrypted data if request is successful
            return response.data;
        } catch (error) {
            Logger.error(`EncryptionServiceIntegration: Failed to decrypt data at ${new Date().toISOString()}`);
            return this.handleError(error, 'decryptData');
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
            Logger.error(`EncryptionServiceIntegration: ${methodName} received error response with status ${error.response.status} at ${new Date().toISOString()}`);

            // Handle specific error responses
            switch (error.response.status) {
                case 400:
                    return new Error('Invalid data provided for encryption/decryption.');
                case 500:
                    return new Error('Encryption/Decryption service encountered an internal error.');
                default:
                    return new Error('Failed to process the encryption/decryption request.');
            }
        } else {
            // Handle network or unexpected errors
            Logger.error(`EncryptionServiceIntegration: ${methodName} encountered a network/unexpected error: ${error.message} at ${new Date().toISOString()}`);
            return new Error('Unable to reach the Encryption service.');
        }
    }
}

module.exports = EncryptionServiceIntegration;
