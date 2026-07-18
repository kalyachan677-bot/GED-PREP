// ============================================================================
// GED Prep Platform — Application Error Classes
// ============================================================================
// Structured error types so the global error handler can return appropriate
// HTTP status codes and messages. Every error thrown in route handlers
// should use one of these classes (or a plain Error which defaults to 500).
// ============================================================================

class AppError extends Error {
  /**
   * @param {string} message  - Human-readable message
   * @param {number} statusCode - HTTP status code (400-599)
   * @param {object} [details] - Optional extra data sent in response body
   */
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // distinguishes known errors from unexpected crashes

    Error.captureStackTrace(this, this.constructor);
  }
}

// ---------------------------------------------------------------------------
// 4xx Client Errors
// ---------------------------------------------------------------------------
class BadRequestError extends AppError {
  constructor(message = 'Bad request', details = null) {
    super(message, 400, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

class ValidationError extends AppError {
  /**
   * @param {object} errors - Field-level errors, e.g. { email: 'Invalid format', name: 'Required' }
   */
  constructor(errors) {
    super('Validation failed', 422, errors);
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429);
  }
}

// ---------------------------------------------------------------------------
// 5xx Server Errors
// ---------------------------------------------------------------------------
class InternalError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500);
    this.isOperational = false;
  }
}

class ServiceUnavailableError extends AppError {
  constructor(service = 'Service') {
    super(`${service} is currently unavailable`, 503);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalError,
  ServiceUnavailableError,
};