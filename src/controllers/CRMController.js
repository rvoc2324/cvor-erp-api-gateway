// src/controllers/CRMController.js

const axios = require('axios');
const Logger = require('../utils/logger');  // Import a custom Logger for structured logging
const { errorHandler } = require('../utils/errorHandler');

// Base URL for the CRM Service, configured dynamically based on environment
const crmServiceBaseUrl = process.env.CRM_SERVICE_URL || 'http://crm-service/api';

/**
 * Fetch customer data from CRM service by customer ID
 * @param {string} customerId - The customer ID to retrieve data for
 * @returns {Promise<Object>} - The customer data or an error message
 */
async function fetchCustomerData(customerId) {
    try {
        Logger.info(`CRMController: Fetching customer data for customer ID: ${customerId} at ${new Date().toISOString()}`);

        // Send GET request to CRM service to fetch customer data by ID
        const response = await axios.get(`${crmServiceBaseUrl}/customer/${customerId}`);

        Logger.info(`CRMController: Successfully fetched customer data for customer ID: ${customerId} at ${new Date().toISOString()}`);

        // Return the customer data if successful
        return response.data;
    } catch (error) {
        Logger.error(`CRMController: Failed to fetch customer data for customer ID: ${customerId} at ${new Date().toISOString()}`);
        return errorHandler.handleError(error, 'fetchCustomerData');
    }
}

/**
 * Create or update customer data in the CRM service
 * @param {Object} customerData - The customer data to be created/updated
 * @returns {Promise<Object>} - The success message or error message
 */
async function createOrUpdateCustomer(customerData) {
    try {
        Logger.info(`CRMController: Creating/Updating customer data at ${new Date().toISOString()}`);

        // Send POST request to CRM service to create/update customer data
        const response = await axios.post(`${crmServiceBaseUrl}/customer`, customerData);

        Logger.info(`CRMController: Successfully created/updated customer data at ${new Date().toISOString()}`);

        // Return the success message if operation is successful
        return response.data;
    } catch (error) {
        Logger.error(`CRMController: Failed to create/update customer data at ${new Date().toISOString()}`);
        return errorHandler.handleError(error, 'createOrUpdateCustomer');
    }
}

// Export the controller methods
module.exports = {
    fetchCustomerData,
    createOrUpdateCustomer,
};
