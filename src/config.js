// src/config.js

const dotenv = require('dotenv');

// Load environment variables from .env file for local deployment
dotenv.config();

//For production use, Azure App config for non sensitive config parameterss
//For sensitive data like keys etc., use Azure key vault

module.exports = {

    //OTP process config
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    SMTP_HOST: process.env.SMTP_HOST, 
    SMTP_PORT: process.env.SMTP_PORT, 
    SMTP_MAIL: process.env.SMTP_MAIL, // Your email address
    SMTP_APP_PASS: process.env.SMTP_APP_PASS, // Your email password or app-specific password

    //Token config
    tokenExpiry: 3600000, // 1 hour in milliseconds

    //Encryption config
    ENCRYPTION_ALGORITHM: 'aes-256-cbc', // Use AES with CBC mode

    //Azure config
    AZURE_KEY_VAULT_URI: process.env.AZURE_KEY_VAULT_URI, // Key Vault URI from environment variables

    // Brute force protection config
    MAX_FAILED_ATTEMPTS: 5, // For OTP/MFA - Max allowed failed attempts
    LOCK_TIME: 30 * 60 * 1000, // Lock duration: 30 minutes
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // Rate limit window: 15 minutes
    RATE_LIMIT_ATTEMPTS: 5, // OTP/MFA - Max attempts within rate limit window
    LOGIN_RATE_LIMIT_WINDOW: 60 * 1000, // 1-minute window for login rate limiting
    LOGIN_RATE_LIMIT_ATTEMPTS: 10, // Max login attempts in 1 minute
};
