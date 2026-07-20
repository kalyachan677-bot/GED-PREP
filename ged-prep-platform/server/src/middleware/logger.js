// ============================================================================
// GED Prep Platform — Request Logging Middleware
// ============================================================================
// Logs every request with method, path, status, and response time.
// Uses morgan in 'dev' format for development, compact JSON for production.
// ============================================================================

const morgan = require('morgan');
const { config } = require('../config');

// Custom token: request ID (for tracing)
morgan.token('request-id', (req) => {
  return req.headers['x-request-id'] || '-';
});

const requestLogger = morgan((tokens, req, res) => {
  if (config.isDev) {
    // Dev: colored, easy to read
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res), 'ms',
      '-',
      tokens['request-id'](req, res),
    ].join(' ');
  }

  // Production: structured JSON (one line per request)
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number(tokens.status(req, res)),
    responseTimeMs: Number(tokens['response-time'](req, res)),
    contentLength: tokens.res(req, res, 'content-length'),
    requestId: tokens['request-id'](req, res),
    userAgent: tokens['user-agent'](req, res),
  });
}, {
  // Skip logging for health check in production to reduce noise
  skip: (req) => config.env === 'production' && req.path === '/api/health',
});

module.exports = requestLogger;