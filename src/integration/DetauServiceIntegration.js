const axios = require('axios');
const Logger = require('../utils/Logger'); // Import a custom Logger for structured logging

class DetauServiceIntegration {
    // Base URL for the Detau Service, configured dynamically based on environment (development, production, etc.)
    static detauServiceBaseUrl = process.env.DETAU_SERVICE_URL || 'http://detau-service/api';

    /**
     * Fetch Detau data by ID
     * @param {string} dataId - The data ID to retrieve information for
     * @returns {Promise<Object>} - The fetched Detau data or an error message
     */
    static async fetchDetauData(dataId) {
        try {
            Logger.info(`DetauServiceIntegration: Fetching data for Detau ID: ${dataId} at ${new Date().toISOString()}`);

            // Send GET request to Detau service for retrieving data by ID
            const response = await axios.get(`${this.detauServiceBaseUrl}/data/${dataId}`);

            Logger.info(`DetauServiceIntegration: Successfully fetched data for Detau ID: ${dataId} at ${new Date().toISOString()}`);

            // Return the data if request is successful
            return response.data;
        } catch (error) {
            Logger.error(`DetauServiceIntegration: Failed to fetch data for Detau ID: ${dataId} at ${new Date().toISOString()}`);
            return this.handleError(error, 'fetchDetauData');
        }
    }

    /**
     * Create or update Detau data in the Detau Service
     * @param {Object} dataPayload - The Detau data payload to be created/updated
     * @returns {Promise<Object>} - The success message or error message
     */
    static async createOrUpdateDetauData(dataPayload) {
        try {
            Logger.info(`DetauServiceIntegration: Creating/Updating data in Detau service at ${new Date().toISOString()}`);

            // Send POST request to Detau service for creating/updating data
            const response = await axios.post(`${this.detauServiceBaseUrl}/data`, dataPayload);

            Logger.info(`DetauServiceIntegration: Successfully created/updated data in Detau service at ${new Date().toISOString()}`);

            // Return the success message if operation is successful
            return response.data;
        } catch (error) {
            Logger.error(`DetauServiceIntegration: Failed to create/update data in Detau service at ${new Date().toISOString()}`);
            return this.handleError(error, 'createOrUpdateDetauData');
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
            Logger.error(`DetauServiceIntegration: ${methodName} received error response with status ${error.response.status} at ${new Date().toISOString()}`);

            // Handle specific error responses
            switch (error.response.status) {
                case 404:
                    return new Error('Detau data not found.');
                case 400:
                    return new Error('Invalid data ID format.');
                case 409:
                    return new Error('Data conflict: Detau record already exists.');
                default:
                    return new Error('Failed to fetch Detau data.');
            }
        } else {
            // Handle network or unexpected errors
            Logger.error(`DetauServiceIntegration: ${methodName} encountered an unexpected error: ${error.message} at ${new Date().toISOString()}`);
            return new Error('Unable to reach Detau service.');
        }
    }
}

module.exports = DetauServiceIntegration;
