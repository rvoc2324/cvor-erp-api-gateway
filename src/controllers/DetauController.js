// src/controllers/DetauController.js

const axios = require('axios');
const Logger = require('../utils/logger'); // Import a custom Logger for structured logging
const { errorHandler } = require('../utils/errorHandler');

// Base URL for the Detau Service, configured dynamically based on environment
const detauServiceBaseUrl = process.env.DETAU_SERVICE_URL || 'http://detau-service/api';

/**
 * Fetch Detau data by ID
 * @param {string} dataId - The data ID to retrieve information for
 * @returns {Promise<Object>} - The fetched Detau data or an error message
 */
async function fetchDetauData(dataId) {
    try {
        Logger.info(`DetauController: Fetching data for Detau ID: ${dataId} at ${new Date().toISOString()}`);

        // Send GET request to Detau service for retrieving data by ID
        const response = await axios.get(`${detauServiceBaseUrl}/data/${dataId}`);

        Logger.info(`DetauController: Successfully fetched data for Detau ID: ${dataId} at ${new Date().toISOString()}`);

        // Return the data if request is successful
        return response.data;
    } catch (error) {
        Logger.error(`DetauController: Failed to fetch data for Detau ID: ${dataId} at ${new Date().toISOString()}`);
        return errorHandler.handleError(error, 'fetchDetauData');
    }
}

/**
 * Create or update Detau data in the Detau Service
 * @param {Object} dataPayload - The Detau data payload to be created/updated
 * @returns {Promise<Object>} - The success message or error message
 */
async function createOrUpdateDetauData(dataPayload) {
    try {
        Logger.info(`DetauController: Creating/Updating data in Detau service at ${new Date().toISOString()}`);

        // Send POST request to Detau service for creating/updating data
        const response = await axios.post(`${detauServiceBaseUrl}/data`, dataPayload);

        Logger.info(`DetauController: Successfully created/updated data in Detau service at ${new Date().toISOString()}`);

        // Return the success message if operation is successful
        return response.data;
    } catch (error) {
        Logger.error(`DetauController: Failed to create/update data in Detau service at ${new Date().toISOString()}`);
        return errorHandler.handleError(error, 'createOrUpdateDetauData');
    }
}

// Export the controller methods
module.exports = {
    fetchDetauData,
    createOrUpdateDetauData,
};
