// middlewares/ValidationMiddleware.js
const Joi = require('joi');

/**
 * Central validation middleware
 * @param {Object} schema - Joi validation schema for the input
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
    return (req, res, next) => {
        const options = {
            abortEarly: false, // Return all errors, not just the first one
            allowUnknown: true, // Allow properties not defined in the schema
            stripUnknown: true  // Remove unknown properties from the request
        };

        const { error, value } = schema.validate(req.body, options);

        if (error) {
            const errorDetails = error.details.map(err => err.message); // Collect all error messages
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input',
                details: errorDetails
            });
        }

        req.body = value; // Use the sanitized values in the request
        next(); // Proceed to the next middleware or route handler
    };
};

module.exports = validate;
