const axios = require('axios');
const logger = require('../utils/logger');

class AuthMiddleware {

    /**
     * Middleware to verify the token by calling the Auth Service.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     * @param {Function} next - The next middleware function in the stack.
     */
    async verifyToken(req, res, next) {
        try {
            // Extract the Bearer token from the 'Authorization' header
            const authHeader = req.headers['authorization'];
            const userId = req.headers['user-id'];  // Assuming userId is passed from the frontend

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: "No Bearer token provided" });
            }

            if (!userId) {
                return res.status(400).json({ error: "User ID missing from request headers" });
            }

            // Extract the token part from the 'Bearer <token>' format
            const token = authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: "No token provided" });
            }

            // Make an HTTP request to the Auth Service to verify the token
            const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service-url/auth/verify-token';

            const response = await axios.post(authServiceUrl, {
                token,
                userId
            }, { timeout: 5000 });  // 5 second timeout for Auth Service response

            // Check if the token validation was successful
            if (response.status === 200 && response.data.isValid) {
                // Proceed to the next middleware/controller
                req.user = { userId };  // Add the userId to the request object
                next();
            } else {
                return res.status(401).json({ error: "Invalid or expired token" });
            }

        } catch (error) {
            if (error.response) {
                // HTTP error response from Auth Service
                logger.error(`Token Verification Error: ${error.response.data}`, { error: error.response.data });
                return res.status(401).json({ error: "Auth Service response: Token verification failed" });
            } else {
                // Network or internal error
                logger.error(`Token Verification Error: ${error.message}`, { error });
                return res.status(500).json({ error: "Internal server error during token verification" });
            }
        }
    }
}

module.exports = new AuthMiddleware();
