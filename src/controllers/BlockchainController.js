const Logger = require('../utils/logger');
const axios = require('axios');
const { errorHandler } = require('../utils/errorHandler'); // Centralized error handler

class BlockchainServiceController {
    // Base URL for the Blockchain service
    static blockchainServiceBaseUrl = process.env.BLOCKCHAIN_SERVICE_URL || 'http://blockchain-service/api';

    /**
     * Records data on the blockchain.
     * @param {Object} req - The request object containing record data.
     * @param {Object} res - The response object.
     */
    static async recordData(req, res) {
        try {
            Logger.info(`BlockchainServiceController: Sending recordData request at ${new Date().toISOString()}`);
            const response = await axios.post(`${this.blockchainServiceBaseUrl}/record`, req.body);
            Logger.info(`BlockchainServiceController: recordData request successful at ${new Date().toISOString()}`);
            return res.status(response.status).json(response.data);
        } catch (error) {
            Logger.error(`BlockchainServiceController: recordData request failed at ${new Date().toISOString()}`);
            return errorHandler.handleError(error, 'recordData', res);
        }
    }

    /**
     * Retrieve a record from the blockchain by ID.
     * @param {Object} req - The request object containing record ID.
     * @param {Object} res - The response object.
     */
    static async getRecord(req, res) {
        try {
            const { id } = req.params;
            Logger.info(`BlockchainServiceController: Fetching record with ID: ${id} at ${new Date().toISOString()}`);
            const response = await axios.get(`${this.blockchainServiceBaseUrl}/record/${id}`);
            Logger.info(`BlockchainServiceController: getRecord request successful for record ID: ${id} at ${new Date().toISOString()}`);
            return res.status(response.status).json(response.data);
        } catch (error) {
            Logger.error(`BlockchainServiceController: getRecord request failed for record ID: ${id} at ${new Date().toISOString()}`);
            return errorHandler.handleError(error, 'getRecord', res);
        }
    }

    /**
     * Retrieve transaction data from the blockchain by transaction hash.
     * @param {Object} req - The request object containing transaction hash.
     * @param {Object} res - The response object.
     */
    static async getTransaction(req, res) {
        try {
            const { transactionHash } = req.params;
            Logger.info(`BlockchainServiceController: Fetching transaction with hash: ${transactionHash} at ${new Date().toISOString()}`);
            const response = await axios.get(`${this.blockchainServiceBaseUrl}/transaction/${transactionHash}`);
            Logger.info(`BlockchainServiceController: getTransaction request successful for transaction hash: ${transactionHash} at ${new Date().toISOString()}`);
            return res.status(response.status).json(response.data);
        } catch (error) {
            Logger.error(`BlockchainServiceController: getTransaction request failed for transaction hash: ${transactionHash} at ${new Date().toISOString()}`);
            return errorHandler.handleError(error, 'getTransaction', res);
        }
    }
}

module.exports = BlockchainServiceController;
