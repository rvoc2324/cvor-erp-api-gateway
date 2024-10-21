const AuthServiceIntegration = require('../integration/AuthServiceIntegration');
const BlockchainServiceIntegration = require('../integration/BlockchainServiceIntegration');
const CRMServiceIntegration = require('../integration/CRMServiceIntegration');
const DetauServiceIntegration = require('../integration/DetauServiceIntegration');
const EncryptionServiceIntegration = require('../integration/EncryptionServiceIntegration');
const VerificationServiceIntegration = require('../integration/VerificationServiceIntegration');
const Logger = require('../utils/Logger');

class GatewayController {

    // Auth service request handler
    static async handleAuthRequest(req, res) {
        try {
            const { originalUrl } = req;
            let result;

            // Log the action and the time, not the sensitive data
            Logger.info(`Auth Request initiated at ${new Date().toISOString()} for: ${originalUrl}`);

            if (originalUrl.includes('/login')) {
                result = await AuthServiceIntegration.login(req.body);
                Logger.info(`Login request processed at ${new Date().toISOString()}`);
            } else if (originalUrl.includes('/register')) {
                result = await AuthServiceIntegration.register(req.body);
                Logger.info(`Registration request processed at ${new Date().toISOString()}`);
            } else if (originalUrl.includes('/profile')) {
                const { id } = req.params;
                result = await AuthServiceIntegration.getProfile(id);
                Logger.info(`Profile fetch request processed at ${new Date().toISOString()} for user ID: ${id}`);
            } else if (originalUrl.includes('/logout')) {
                const { id } = req.params;
                result = await AuthServiceIntegration.logout(id);
                Logger.info(`Account successfully logged out at ${new Date().toISOString()} for user ID: ${id}`);
            }

            // Success response
            return res.status(result.status).json(result.data);

        } catch (error) {
            Logger.error('Auth Service Error occurred at', new Date().toISOString());

            // Handle specific errors
            if (error.message === 'User not found') {
                return res.status(404).json({ message: 'User not found. Please check your credentials or register.' });
            } else if (error.message === 'Invalid email or password') {
                return res.status(401).json({ message: 'Incorrect password. Please try again.' });
            } else if (error.message === 'Unauthorized access') {
                return res.status(403).json({ message: 'You are not authorized to perform this action.' });
            }

            // General error response
            res.status(500).json({ message: 'An internal error occurred in the Auth service.' });
        }
    }

    // Blockchain service request handler
    static async handleBlockchainRequest(req, res) {
        try {
            Logger.info(`Blockchain record creation initiated at ${new Date().toISOString()}`);

            const result = await BlockchainServiceIntegration.createRecord(req.body);

            return res.status(result.status).json(result.data);

        } catch (error) {
            Logger.error(`Blockchain Service Error at ${new Date().toISOString()}`, error.message);

            // Handle specific Blockchain-related errors
            if (error.message === 'Blockchain validation failed') {
                return res.status(400).json({ message: 'Blockchain validation failed. Please check the data provided.' });
            }

            res.status(500).json({ message: 'An internal error occurred in the Blockchain service.' });
        }
    }

    // CRM service request handler
    static async handleCRMRequest(req, res) {
        try {
            const { originalUrl, params } = req;
            let result;

            Logger.info(`CRM Request initiated at ${new Date().toISOString()} for ${originalUrl}`);

            if (originalUrl.includes('/customer/:id')) {
                result = await CRMServiceIntegration.getCustomer(params.id);
                Logger.info(`Fetching customer details for ID: ${params.id} at ${new Date().toISOString()}`);
            } else {
                result = await CRMServiceIntegration.createCustomer(req.body);
                Logger.info(`Creating new customer at ${new Date().toISOString()}`);
            }

            return res.status(result.status).json(result.data);

        } catch (error) {
            Logger.error(`CRM Service Error at ${new Date().toISOString()}`, error.message);

            // Handle specific CRM-related errors
            if (error.message === 'Customer not found') {
                return res.status(404).json({ message: 'Customer not found. Please verify the ID.' });
            } else if (error.message === 'Invalid customer data') {
                return res.status(400).json({ message: 'Invalid customer data. Please check the input.' });
            }

            res.status(500).json({ message: 'An internal error occurred in the CRM service.' });
        }
    }

    // Detau service request handler
    static async handleDetauRequest(req, res) {
        try {
            const { originalUrl, params } = req;
            let result;

            Logger.info(`Detau Service Request initiated at ${new Date().toISOString()} for ${originalUrl}`);

            if (originalUrl.includes('/data/:id')) {
                result = await DetauServiceIntegration.getData(params.id);
                Logger.info(`Fetching data for ID: ${params.id} at ${new Date().toISOString()}`);
            } else {
                result = await DetauServiceIntegration.createData(req.body);
                Logger.info(`Creating new data entry at ${new Date().toISOString()}`);
            }

            return res.status(result.status).json(result.data);

        } catch (error) {
            Logger.error(`Detau Service Error at ${new Date().toISOString()}`, error.message);

            // Handle specific Detau-related errors
            if (error.message === 'Data not found') {
                return res.status(404).json({ message: 'Requested data not found.' });
            } else if (error.message === 'Invalid data submission') {
                return res.status(400).json({ message: 'Invalid data submitted. Please check the input format.' });
            }

            res.status(500).json({ message: 'An internal error occurred in the Detau service.' });
        }
    }

    // Encryption service request handler
    static async handleEncryptionRequest(req, res) {
        try {
            const { originalUrl } = req;
            let result;

            Logger.info(`Encryption Service Request initiated at ${new Date().toISOString()} for ${originalUrl}`);

            if (originalUrl.includes('/encrypt')) {
                result = await EncryptionServiceIntegration.encryptData(req.body);
                Logger.info(`Data encryption processed at ${new Date().toISOString()}`);
            } else {
                result = await EncryptionServiceIntegration.decryptData(req.body);
                Logger.info(`Data decryption processed at ${new Date().toISOString()}`);
            }

            return res.status(result.status).json(result.data);

        } catch (error) {
            Logger.error(`Encryption Service Error at ${new Date().toISOString()}`, error.message);

            // Handle specific Encryption-related errors
            if (error.message === 'Encryption failed') {
                return res.status(400).json({ message: 'Data encryption failed. Please ensure valid data is provided.' });
            } else if (error.message === 'Decryption failed') {
                return res.status(400).json({ message: 'Data decryption failed. Ensure that the correct keys are used.' });
            }

            res.status(500).json({ message: 'An internal error occurred in the Encryption service.' });
        }
    }

    // Verification service request handler
    static async handleVerificationRequest(req, res) {
        try {
            Logger.info(`Verification request initiated at ${new Date().toISOString()}`);

            const result = await VerificationServiceIntegration.verify(req.body);

            return res.status(result.status).json(result.data);

        } catch (error) {
            Logger.error(`Verification Service Error at ${new Date().toISOString()}`, error.message);

            // Handle specific Verification-related errors
            if (error.message === 'Verification failed') {
                return res.status(400).json({ message: 'Verification failed. Please ensure the provided data is correct.' });
            }

            res.status(500).json({ message: 'An internal error occurred in the Verification service.' });
        }
    }

    // Health check route handler
    static async healthCheck(req, res) {
        Logger.info(`Health check at ${new Date().toISOString()}`);
        res.status(200).json({ message: 'API Gateway is up and running.' });
    }
}

module.exports = GatewayController;
