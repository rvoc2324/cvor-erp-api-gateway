// src/middleware/AuthMiddleware.js
const TokenService = require('../services/TokenService');
const CommonServiceIntegration = require('../services/CommonServiceIntegration');

class AuthMiddleware {

    /**
     * Middleware to verify the token and check the user's MFA status.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     * @param {Function} next - The next middleware function in the stack.
     */
    async verifyToken(req, res, next) {
        try {
            // Extract the Bearer token from the 'Authorization' header
            const authHeader = req.headers['authorization'];
            const userId = req.headers['user-id']; // Assuming userId is passed from the frontend

            if (!authHeader || !authHeader.startsWith('Bearer ') || !userId) {
                return res.status(401).json({ error: "No Bearer token or user ID provided" });
            }

            // Extract the token part from the 'Bearer <token>' format
            const token = authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: "No token provided" });
            }

            // Validate the token using the TokenService with userId
            const isValid = await TokenService.validateToken(token, userId);

            if (!isValid) {
                return res.status(401).json({ error: "Invalid token" });
            }

            // Proceed to the next middleware/controller
            req.user = { userId }; // Add the userId to the request object
            next();

        } catch (error) {
            await CommonServiceIntegration.logError('Token Verification Error', error);
            return res.status(500).json({ error: "Token verification failed" });
        }
    }
}

module.exports = new AuthMiddleware();
