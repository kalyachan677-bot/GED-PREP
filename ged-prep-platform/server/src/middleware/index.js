// ============================================================================
// GED Prep Platform — Middleware Index
// ============================================================================
// Re-exports all middleware for convenient import.
// ============================================================================

const corsMiddleware = require('./cors');
const requestLogger = require('./logger');
const rateLimiter = require('./rateLimiter');
const validate = require('./validate');
const { errorHandler, notFoundHandler } = require('./errorHandler');
const { authenticate, authorize, optionalAuth } = require('./auth');

module.exports = {
  corsMiddleware,
  requestLogger,
  rateLimiter,
  validate,
  errorHandler,
  notFoundHandler,
  authenticate,
  authorize,
  optionalAuth,
};