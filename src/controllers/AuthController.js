// src/controllers/AuthController.js

const axios = require('axios');
const Logger = require('../utils/logger'); // For structured logging
const { errorHandler } = require('../utils/errorHandler');

// Base URL for Auth Service, configured based on environment
const authServiceBaseUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service/api';

/**
 * Initiate login process without password
 * @param {Object} req - The incoming request object
 * @param {Object} res - The response object to send back data
 */
async function initiateLogin(req, res) {
    try {
        Logger.info(`AuthController: Initiating login at ${new Date().toISOString()}`);

        const response = await axios.post(`${authServiceBaseUrl}/login/initiate`, req.body);

        Logger.info(`AuthController: Login initiation successful at ${new Date().toISOString()}`);
        res.status(200).json(response.data);
    } catch (error) {
        Logger.error(`AuthController: Failed to initiate login at ${new Date().toISOString()}`);
        errorHandler.handleError(error, 'initiateLogin', res);
    }
}

/**
 * Verify OTP with brute force protection
 * @param {Object} req - The incoming request object
 * @param {Object} res - The response object to send back data
 */
async function verifyOTP(req, res) {
    try {
        Logger.info(`AuthController: Verifying OTP at ${new Date().toISOString()}`);

        const response = await axios.post(`${authServiceBaseUrl}/verify-otp`, req.body);

        Logger.info(`AuthController: OTP verification successful at ${new Date().toISOString()}`);
        res.status(200).json(response.data);
    } catch (error) {
        Logger.error(`AuthController: OTP verification failed at ${new Date().toISOString()}`);
        errorHandler.handleError(error, 'verifyOTP', res);
    }
}

/**
 * Setup MFA after first login
 * @param {Object} req - The incoming request object
 * @param {Object} res - The response object to send back data
 */
async function setupMFA(req, res) {
    try {
        Logger.info(`AuthController: Setting up MFA at ${new Date().toISOString()}`);

        const response = await axios.post(`${authServiceBaseUrl}/mfa/setup`, req.body);

        Logger.info(`AuthController: MFA setup successful at ${new Date().toISOString()}`);
        res.status(200).json(response.data);
    } catch (error) {
        Logger.error(`AuthController: MFA setup failed at ${new Date().toISOString()}`);
        errorHandler.handleError(error, 'setupMFA', res);
    }
}

/**
 * Register an enterprise user
 * @param {Object} req - The incoming request object
 * @param {Object} res - The response object to send back data
 */
async function registerEnterprise(req, res) {
    try {
        Logger.info(`AuthController: Registering enterprise user at ${new Date().toISOString()}`);

        const response = await axios.post(`${authServiceBaseUrl}/register/enterprise`, req.body);

        Logger.info(`AuthController: Enterprise registration successful at ${new Date().toISOString()}`);
        res.status(201).json(response.data);
    } catch (error) {
        Logger.error(`AuthController: Enterprise registration failed at ${new Date().toISOString()}`);
        errorHandler.handleError(error, 'registerEnterprise', res);
    }
}

/**
 * Register an individual user
 * @param {Object} req - The incoming request object
 * @param {Object} res - The response object to send back data
 */
async function registerIndividual(req, res) {
    try {
        Logger.info(`AuthController: Registering individual user at ${new Date().toISOString()}`);

        const response = await axios.post(`${authServiceBaseUrl}/register/individual`, req.body);

        Logger.info(`AuthController: Individual registration successful at ${new Date().toISOString()}`);
        res.status(201).json(response.data);
    } catch (error) {
        Logger.error(`AuthController: Individual registration failed at ${new Date().toISOString()}`);
        errorHandler.handleError(error, 'registerIndividual', res);
    }
}

/**
 * Logout user
 * @param {Object} req - The incoming request object
 * @param {Object} res - The response object to send back data
 */
async function logout(req, res) {
    try {
        Logger.info(`AuthController: Logging out user at ${new Date().toISOString()}`);

        const response = await axios.post(`${authServiceBaseUrl}/logout`, req.body);

        Logger.info(`AuthController: Logout successful at ${new Date().toISOString()}`);
        res.status(200).json(response.data);
    } catch (error) {
        Logger.error(`AuthController: Logout failed at ${new Date().toISOString()}`);
        errorHandler.handleError(error, 'logout', res);
    }
}


// Other methods (verify OTP, complete onboarding, logout) follow a similar pattern...

module.exports = {
    initiateLogin,
    verifyOTP,
    setupMFA,
    registerEnterprise,
    registerIndividual,
    logout,
    // Other methods as necessary
};
