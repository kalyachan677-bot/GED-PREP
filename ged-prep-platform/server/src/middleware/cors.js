// ============================================================================
// GED Prep Platform — CORS Middleware
// ============================================================================
// Configures CORS with the allowed origin from config.
// In development, allows credentials and common methods/headers.
// ============================================================================

const cors = require('cors');
const { config } = require('../config');

const corsMiddleware = cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id', 'X-RateLimit-Remaining'],
  maxAge: 86400, // preflight cache for 24h
});

module.exports = corsMiddleware;