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

module.exports = {
  corsMiddleware,
  requestLogger,
  rateLimiter,
  validate,
  errorHandler,
  notFoundHandler,
};