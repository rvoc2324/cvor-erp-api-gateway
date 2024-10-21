const CommonServiceIntegration = require('../services/CommonServiceIntegration');

/**
 * Middleware to enforce security headers on all HTTP responses.
 * This helps protect the application against common vulnerabilities such as cross-site scripting (XSS) and clickjacking.
 */
const SecurityHeadersMiddleware = async (req, res, next) => {
    try {
        // Content Security Policy (CSP): Prevents XSS attacks, allows external scripts/styles dynamically as needed
        res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'");

        // X-Frame-Options: Prevents clickjacking by disallowing embedding, but can allow trusted domains if needed
        res.setHeader("X-Frame-Options", "DENY");

        // X-Content-Type-Options: Prevents browsers from interpreting files as a different MIME type
        res.setHeader("X-Content-Type-Options", "nosniff");

        // Strict-Transport-Security (HSTS): Enforces HTTPS with 1-year max age and preloading
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

        // X-XSS-Protection: (Optional) Deprecated in modern browsers, can be removed
        res.setHeader("X-XSS-Protection", "1; mode=block");

        // Referrer-Policy: Controls referrer information sharing
        res.setHeader("Referrer-Policy", "no-referrer");

        // Permissions-Policy: Allows camera and microphone prompts only from the app, blocks geolocation
        res.setHeader("Permissions-Policy", "geolocation=(), microphone=(self), camera=(self)");

        // Log successful header enforcement
        await CommonServiceIntegration.logInfo('Security headers successfully applied to response');

        // Proceed to the next middleware
        next();
    } catch (error) {
        // Log any errors that occur during the security header application
        await CommonServiceIntegration.logError('SecurityHeadersMiddleware', error);
        // Pass the error to the next middleware for handling
        next(error);
    }
};

module.exports = SecurityHeadersMiddleware;
