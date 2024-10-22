// src/index.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const gatewayRoutes = require('./routes/gatewayRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { errorHandler } = require('./utils/errorHandler');
const { logger } = require('./utils/logger');
const securityHeadersMiddleware = require('./middleware/SecurityHeadersMiddleware');

const app = express();

// Use health routes
app.use(healthRoutes);

// Global Middlewares
app.use(cors()); // Enable CORS for cross-origin requests
app.use(helmet()); // Add security headers
app.use(express.json()); // Parse JSON requests
app.use(morgan('combined', { stream: logger.stream })); // HTTP request logging

// Rate Limiting (can be customized further per service route)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});

// Apply global middlewares (security and rate limiting)
app.use(securityHeadersMiddleware); // Security headers middleware
app.use(limiter); // Apply rate limiting globally

// Gateway Routes
app.use('/', gatewayRoutes); // Prefix all routes with `/api`

// Error Handler Middleware (Should be at the end)
app.use(errorHandler); // Handle any uncaught errors

// Server Listening Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`API Gateway running on port ${PORT}`);
});
