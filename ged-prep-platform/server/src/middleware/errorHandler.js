// ============================================================================
// GED Prep Platform — Global Error Handler Middleware
// ============================================================================
// Catches all errors (thrown or passed via next(err)) and returns a
// consistent JSON response. Operational errors return their own statusCode;
// unexpected errors return 500 with no internal details leaked.
// ============================================================================

const { config } = require('../config');
const { error: sendError } = require('../utils/response');
const { AppError } = require('../utils/errors');

function errorHandler(err, req, res, _next) {
  // Default values
  let statusCode = 500;
  let message = 'Internal server error';
  let details = null;

  if (err instanceof AppError) {
    // Known operational error — safe to expose
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.name === 'SyntaxError' && err.type === 'entity.parse.failed') {
    // Malformed JSON body
    statusCode = 400;
    message = 'Request body contains invalid JSON';
  } else if (err.code === '23505') {
    // PostgreSQL unique violation
    statusCode = 409;
    message = 'A record with this value already exists';
    // Try to extract the column from the constraint name
    const match = err.detail?.match(/Key \((\w+)\)=/);
    if (match) {
      details = { field: match[1], constraint: err.constraint };
    }
  } else if (err.code === '23503') {
    // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Referenced record does not exist';
  } else if (err.code === '22P02') {
    // PostgreSQL invalid text representation (e.g. bad UUID)
    statusCode = 400;
    message = 'Invalid parameter format';
  } else {
    // Unexpected error — log full details but don't leak to client
    statusCode = 500;
    message = config.isDev ? err.message : 'Internal server error';

    if (config.isDev) {
      details = {
        stack: err.stack,
        name: err.name,
      };
    }
  }

  // Log server errors (5xx)
  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.path} → ${statusCode} ${message}`);
    if (!config.isDev) {
      console.error(err.stack);
    }
  }

  return sendError(res, message, statusCode, details);
}

// Also handle 404 for unmatched routes
function notFoundHandler(req, res) {
  return sendError(res, `Cannot ${req.method} ${req.path}`, 404);
}

module.exports = { errorHandler, notFoundHandler };