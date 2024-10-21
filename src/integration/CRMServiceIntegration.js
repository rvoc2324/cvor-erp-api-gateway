const axios = require('axios');
const Logger = require('../utils/Logger');  // Import the logger

class CRMServiceIntegration {
    // Base URL for the CRM Service. It is dynamic based on environment (development, production, etc.)
    static crmServiceBaseUrl = process.env.CRM_SERVICE_URL || 'http://crm-service/api';

    /**
     * Fetch customer data from CRM service by customer ID
     * @param {string} customerId - The customer ID to retrieve data for
     * @returns {Promise<Object>} - The customer data or an error message
     */
    static async fetchCustomerData(customerId) {
        try {
            Logger.info(`CRMServiceIntegration: Fetching customer data for customer ID: ${customerId} at ${new Date().toISOString()}`);

            // Send GET request to CRM service to fetch customer data by ID
            const response = await axios.get(`${this.crmServiceBaseUrl}/customer/${customerId}`);

            // Log successful response
            Logger.info(`CRMServiceIntegration: Successfully fetched customer data for customer ID: ${customerId} at ${new Date().toISOString()}`);

            // Return the customer data if successful
            return response.data;
        } catch (error) {
            Logger.error(`CRMServiceIntegration: Failed to fetch customer data for customer ID: ${customerId} at ${new Date().toISOString()}`);
            return this.handleError(error, 'fetchCustomerData');
        }
    }

    /**
     * Create or update customer data in the CRM service
     * @param {Object} customerData - The customer data to be created/updated
     * @returns {Promise<Object>} - The success message or error message
     */
    static async createOrUpdateCustomer(customerData) {
        try {
            Logger.info(`CRMServiceIntegration: Creating/Updating customer data at ${new Date().toISOString()}`);

            // Send POST request to CRM service to create/update customer data
            const response = await axios.post(`${this.crmServiceBaseUrl}/customer`, customerData);

            // Log successful response
            Logger.info(`CRMServiceIntegration: Successfully created/updated customer data at ${new Date().toISOString()}`);

            // Return the success message if operation is successful
            return response.data;
        } catch (error) {
            Logger.error(`CRMServiceIntegration: Failed to create/update customer data at ${new Date().toISOString()}`);
            return this.handleError(error, 'createOrUpdateCustomer');
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
            Logger.error(`CRMServiceIntegration: ${methodName} received error response with status ${error.response.status} at ${new Date().toISOString()}`);

            // Handle specific error responses
            switch (error.response.status) {
                case 404:
                    return new Error('Customer not found.');
                case 400:
                    return new Error('Invalid customer ID format.');
                case 409:
                    return new Error('Customer with this ID or details already exists.');
                default:
                    return new Error('Failed to fetch customer data.');
            }
        } else {
            // Handle network or unexpected errors
            Logger.error(`CRMServiceIntegration: ${methodName} encountered an unexpected error: ${error.message} at ${new Date().toISOString()}`);
            return new Error('Unable to reach CRM service.');
        }
    }
}

module.exports = CRMServiceIntegration;
