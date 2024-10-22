const express = require('express');
const router = express.Router();

// Basic Health Check Route
router.get('/health', (req, res) => res.status(200).json({ status: 'Gateway is healthy' }));

// Additional health checks can be added here if needed, such as checking external services
// Example: checkDatabaseHealth, checkCacheHealth, etc.

// Export the router
module.exports = router;
