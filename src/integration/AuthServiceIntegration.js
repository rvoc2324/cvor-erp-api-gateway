const axios = require('axios');
const Logger = require('../utils/Logger');  // Import logger

class AuthServiceIntegration {
    // Base URL for the Auth service
    static authServiceBaseUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service/api';

    /**
     * Login request to the Auth service.
     * @param {Object} loginData - The login data (e.g., email, password).
     * @returns {Object} - Auth service response with status and data.
     */
    static async login(loginData) {
        try {
            Logger.info(`AuthServiceIntegration: Sending login request at ${new Date().toISOString()}`);
            const response = await axios.post(`${this.authServiceBaseUrl}/login`, loginData);

            // Log successful response
            Logger.info(`AuthServiceIntegration: Login request successful at ${new Date().toISOString()}`);

            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            Logger.error(`AuthServiceIntegration: Login request failed at ${new Date().toISOString()}`);
            return this.handleError(error);
        }
    }

    /**
     * Register request to the Auth service.
     * @param {Object} registrationData - The registration data (e.g., name, email, password).
     * @returns {Object} - Auth service response with status and data.
     */
    static async register(registrationData) {
        try {
            Logger.info(`AuthServiceIntegration: Sending register request at ${new Date().toISOString()}`);
            const response = await axios.post(`${this.authServiceBaseUrl}/register`, registrationData);

            // Log successful response
            Logger.info(`AuthServiceIntegration: Register request successful at ${new Date().toISOString()}`);

            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            Logger.error(`AuthServiceIntegration: Register request failed at ${new Date().toISOString()}`);
            return this.handleError(error);
        }
    }

    /**
     * Get user profile request from the Auth service.
     * @param {string} userId - The user ID for fetching profile data.
     * @returns {Object} - Auth service response with status and data.
     */
    static async getProfile(userId) {
        try {
            Logger.info(`AuthServiceIntegration: Fetching profile for user ID: ${userId} at ${new Date().toISOString()}`);
            const response = await axios.get(`${this.authServiceBaseUrl}/profile/${userId}`);

            // Log successful response
            Logger.info(`AuthServiceIntegration: Profile fetched successfully for user ID: ${userId} at ${new Date().toISOString()}`);

            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            Logger.error(`AuthServiceIntegration: Profile fetch failed for user ID: ${userId} at ${new Date().toISOString()}`);
            return this.handleError(error);
        }
    }

    /**
     * Handle common error responses from the Auth service.
     * @param {Object} error - Axios error object.
     * @returns {Object} - Error status and message.
     */
    static handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            const errorMessage = data?.message || 'An error occurred in the Auth service.';

            Logger.error(`AuthServiceIntegration: Auth service returned error status ${status} at ${new Date().toISOString()}`);

            return {
                status,
                data: { message: errorMessage },
            };
        } else if (error.request) {
            Logger.error(`AuthServiceIntegration: No response received from Auth service at ${new Date().toISOString()}`);

            return {
                status: 503,
                data: { message: 'Auth service is unavailable. Please try again later.' },
            };
        } else {
            Logger.error(`AuthServiceIntegration: Unexpected error occurred at ${new Date().toISOString()}: ${error.message}`);

            return {
                status: 500,
                data: { message: 'Internal error while communicating with the Auth service.' },
            };
        }
    }
}

module.exports = AuthServiceIntegration;
