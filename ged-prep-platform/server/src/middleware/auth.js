// ============================================================================
// GED Prep Platform — Auth Middleware
// ============================================================================
// requireAuth: Verifies JWT and attaches req.user
// requireRole: Checks that req.user.role is in the allowed list
// ============================================================================

const { UnauthorizedError, ForbiddenError } = require('../utils/errors');
const { extractToken, verifyToken } = require('../utils/auth');

/**
 * Middleware: Require valid JWT in Authorization header.
 * Attaches req.user = { userId, email, role }
 */
function requireAuth(req, res, next) {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return next(new UnauthorizedError('Missing or invalid Authorization header'));
  }

  try {
    const decoded = verifyToken(token);
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expired, please sign in again'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token'));
    }
    return next(new UnauthorizedError('Authentication failed'));
  }
}

/**
 * Middleware factory: Require specific role(s).
 * Must be used AFTER requireAuth.
 *
 * @param  {...string} allowedRoles - Roles that are permitted
 * @returns {function} Express middleware
 *
 * Usage: router.delete('/users/:id', requireAuth, requireRole('admin'), handler)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Role '${req.user.role}' is not authorized`));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };