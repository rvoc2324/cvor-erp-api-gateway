const axios = require('axios');
const Logger = require('../utils/Logger');  // Import the logger

class BlockchainServiceIntegration {
    // Base URL for the Blockchain service
    static blockchainServiceBaseUrl = process.env.BLOCKCHAIN_SERVICE_URL || 'http://blockchain-service/api';

    /**
     * Records data on the blockchain.
     * @param {Object} recordData - The data to be recorded on the blockchain.
     * @returns {Object} - Blockchain service response with status and data.
     */
    static async recordData(recordData) {
        try {
            Logger.info(`BlockchainServiceIntegration: Sending recordData request at ${new Date().toISOString()}`);
            const response = await axios.post(`${this.blockchainServiceBaseUrl}/record`, recordData);

            // Log successful response
            Logger.info(`BlockchainServiceIntegration: recordData request successful at ${new Date().toISOString()}`);

            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            Logger.error(`BlockchainServiceIntegration: recordData request failed at ${new Date().toISOString()}`);
            return this.handleError(error);
        }
    }

    /**
     * Retrieve a record from the blockchain by ID.
     * @param {string} recordId - The ID of the blockchain record to retrieve.
     * @returns {Object} - Blockchain service response with status and data.
     */
    static async getRecord(recordId) {
        try {
            Logger.info(`BlockchainServiceIntegration: Fetching record with ID: ${recordId} at ${new Date().toISOString()}`);
            const response = await axios.get(`${this.blockchainServiceBaseUrl}/record/${recordId}`);

            // Log successful response
            Logger.info(`BlockchainServiceIntegration: getRecord request successful for record ID: ${recordId} at ${new Date().toISOString()}`);

            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            Logger.error(`BlockchainServiceIntegration: getRecord request failed for record ID: ${recordId} at ${new Date().toISOString()}`);
            return this.handleError(error);
        }
    }

    /**
     * Retrieve transaction data from the blockchain by transaction hash.
     * @param {string} transactionHash - The transaction hash to retrieve data.
     * @returns {Object} - Blockchain service response with status and data.
     */
    static async getTransaction(transactionHash) {
        try {
            Logger.info(`BlockchainServiceIntegration: Fetching transaction with hash: ${transactionHash} at ${new Date().toISOString()}`);
            const response = await axios.get(`${this.blockchainServiceBaseUrl}/transaction/${transactionHash}`);

            // Log successful response
            Logger.info(`BlockchainServiceIntegration: getTransaction request successful for transaction hash: ${transactionHash} at ${new Date().toISOString()}`);

            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            Logger.error(`BlockchainServiceIntegration: getTransaction request failed for transaction hash: ${transactionHash} at ${new Date().toISOString()}`);
            return this.handleError(error);
        }
    }

    /**
     * Handle common error responses from the Blockchain service.
     * @param {Object} error - Axios error object.
     * @returns {Object} - Error status and message.
     */
    static handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            const errorMessage = data?.message || 'An error occurred in the Blockchain service.';

            Logger.error(`BlockchainServiceIntegration: Blockchain service returned error status ${status} at ${new Date().toISOString()}`);

            return {
                status,
                data: { message: errorMessage },
            };
        } else if (error.request) {
            Logger.error(`BlockchainServiceIntegration: No response received from the Blockchain service at ${new Date().toISOString()}`);

            return {
                status: 503,
                data: { message: 'Blockchain service is unavailable. Please try again later.' },
            };
        } else {
            Logger.error(`BlockchainServiceIntegration: Unexpected error occurred at ${new Date().toISOString()}: ${error.message}`);

            return {
                status: 500,
                data: { message: 'Internal error while communicating with the Blockchain service.' },
            };
        }
    }
}

module.exports = BlockchainServiceIntegration;
