// src/controllers/EncryptionController.js

const axios = require('axios');
const Logger = require('../utils/logger'); // Import a custom Logger for structured logging
const { errorHandler } = require('../utils/errorHandler');

// Base URL for the Encryption Service, configurable for different environments
const encryptionServiceBaseUrl = process.env.ENCRYPTION_SERVICE_URL || 'http://encryption-service/api';

/**
 * Encrypt data
 * @param {Object} data - The data to be encrypted
 * @returns {Promise<Object>} - The encrypted data or an error message
 */
async function encryptData(data) {
    try {
        Logger.info(`EncryptionController: Sending encryption request at ${new Date().toISOString()}`);

        // Send POST request to Encryption Service for encrypting data
        const response = await axios.post(`${encryptionServiceBaseUrl}/encrypt`, data);

        Logger.info(`EncryptionController: Encryption request successful at ${new Date().toISOString()}`);

        // Return encrypted data if request is successful
        return response.data;
    } catch (error) {
        Logger.error(`EncryptionController: Failed to encrypt data at ${new Date().toISOString()}`);
        return errorHandler.handleError(error, 'encryptData');
    }
}

/**
 * Decrypt data
 * @param {Object} encryptedData - The data to be decrypted
 * @returns {Promise<Object>} - The decrypted data or an error message
 */
async function decryptData(encryptedData) {
    try {
        Logger.info(`EncryptionController: Sending decryption request at ${new Date().toISOString()}`);

        // Send POST request to Encryption Service for decrypting data
        const response = await axios.post(`${encryptionServiceBaseUrl}/decrypt`, encryptedData);

        Logger.info(`EncryptionController: Decryption request successful at ${new Date().toISOString()}`);

        // Return decrypted data if request is successful
        return response.data;
    } catch (error) {
        Logger.error(`EncryptionController: Failed to decrypt data at ${new Date().toISOString()}`);
        return errorHandler.handleError(error, 'decryptData');
    }
}

// Export the controller methods
module.exports = {
    encryptData,
    decryptData,
};
