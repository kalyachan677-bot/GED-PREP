// ============================================================================
// GED Prep Platform — Auth Middleware
// ============================================================================
// authenticate:  Extracts JWT from Authorization header and attaches user to req
// authorize:     Checks if authenticated user has the required role(s)
// ============================================================================

const { verifyToken } = require('../utils/jwt');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

/**
 * Middleware: Authenticate request via JWT.
 * Reads "Authorization: Bearer <token>" header, verifies the token,
 * and attaches decoded payload to `req.user`.
 *
 * After this middleware:
 *   req.user = { sub (user id), email, role, type, iat, exp }
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid Authorization header'));
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return next(new UnauthorizedError('Empty token'));
  }

  try {
    const decoded = verifyToken(token, 'access');
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expired — please log in again'));
    }
    return next(new UnauthorizedError('Invalid token'));
  }
}

/**
 * Factory: Create a role-authorization middleware.
 * Must be used AFTER `authenticate`.
 *
 * Usage:
 *   router.get('/admin', authenticate, authorize('admin'), handler);
 *   router.get('/staff', authenticate, authorize('admin', 'instructor'), handler);
 *
 * @param  {...string} allowedRoles - Roles that are permitted
 * @returns {function} Express middleware
 */
function authorize(...allowedRoles) {
  if (allowedRoles.length === 0) {
    throw new Error('authorize() requires at least one role');
  }

  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Role "${req.user.role}" is not permitted`));
    }

    next();
  };
}

/**
 * Optional auth — tries to decode the token but doesn't reject if missing.
 * Attaches `req.user` if token is valid, otherwise `req.user = null`.
 * Useful for endpoints that work for both authenticated and anonymous users.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    req.user = verifyToken(token, 'access');
  } catch {
    req.user = null;
  }

  next();
}

module.exports = { authenticate, authorize, optionalAuth };