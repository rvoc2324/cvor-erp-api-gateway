// src/config.js

const dotenv = require('dotenv');

// Load environment variables from .env file for local deployment
dotenv.config();

//For production use, Azure App config for non sensitive config parameterss
//For sensitive data like keys etc., use Azure key vault

module.exports = {

    // Brute force protection config
    MAX_FAILED_ATTEMPTS: 5, // For OTP/MFA - Max allowed failed attempts
    LOCK_TIME: 30 * 60 * 1000, // Lock duration: 30 minutes
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // Rate limit window: 15 minutes
    RATE_LIMIT_ATTEMPTS: 5, // OTP/MFA - Max attempts within rate limit window
    LOGIN_RATE_LIMIT_WINDOW: 60 * 1000, // 1-minute window for login rate limiting
    LOGIN_RATE_LIMIT_ATTEMPTS: 10, // Max login attempts in 1 minute
};
