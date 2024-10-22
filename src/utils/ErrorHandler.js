const Logger = require('./logger');  // Assuming a custom logger utility is already implemented

// Custom Error class for better error handling
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.isOperational = true; // Mark operational errors for easier identification
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Handles error responses for service controllers.
 * Logs the error and returns a structured response.
 * 
 * @param {Object} error - The error object (could be an Axios error or any other error).
 * @param {String} methodName - The method name where the error occurred.
 * @param {Object} res - The response object to send the error message.
 * @returns {Object} - The formatted error response.
 */
function handleError(error, methodName, res) {
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred.';

    // Check if the error is an Axios error with a response from the server
    if (error.response) {
        statusCode = error.response.status;
        errorMessage = error.response.data.message || 'Error in external service.';
        Logger.error({
            message: `Error in ${methodName}: ${errorMessage}`,
            statusCode: statusCode,
            details: error.response.data,
            stack: error.stack
        });
    }
    // Check if the error was due to no response from the external service
    else if (error.request) {
        statusCode = 503;
        errorMessage = 'Service unavailable. Please try again later.';
        Logger.error({
            message: `Error in ${methodName}: No response from external service.`,
            statusCode: statusCode,
            request: error.request,
            stack: error.stack
        });
    }
    // Handle any other errors
    else {
        errorMessage = error.message;
        Logger.error({
            message: `Error in ${methodName}: ${errorMessage}`,
            statusCode: statusCode,
            stack: error.stack
        });
    }

    // Send structured error response
    return res.status(statusCode).json({
        status: 'error',
        message: errorMessage
    });
}

// Export both the AppError class and the errorHandler utility
module.exports = {
    errorHandler: {
        handleError,  // Add handleError method for structured error handling in controllers
    },
    AppError
};
