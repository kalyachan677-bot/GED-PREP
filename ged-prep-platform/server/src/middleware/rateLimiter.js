// ============================================================================
// GED Prep Platform — Rate Limiting Middleware
// ============================================================================
// Global rate limiter applied to all API routes.
// Returns standard error response when limit is exceeded.
// ============================================================================

const rateLimit = require('express-rate-limit');
const { config } = require('../config');
const { error: sendError } = require('../utils/response');

const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true, // Send RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: null, // We handle the response ourselves
  handler: (req, res) => {
    sendError(
      res,
      'Too many requests, please try again later',
      429,
      {
        retryAfterMs: config.rateLimit.windowMs,
        limit: config.rateLimit.max,
      }
    );
  },
  // Use client IP (behind proxy)
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
});

module.exports = rateLimiter;