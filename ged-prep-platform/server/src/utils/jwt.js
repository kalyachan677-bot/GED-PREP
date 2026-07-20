// ============================================================================
// GED Prep Platform — JWT Utilities
// ============================================================================
// Handles token generation, verification, and decoding.
// Tokens include: user id, email, role, and an issued-at timestamp.
// ============================================================================

const jwt = require('jsonwebtoken');
const { config } = require('../config');

// ---------------------------------------------------------------------------
// Generate tokens
// ---------------------------------------------------------------------------

/**
 * Generate an access JWT for a user.
 * @param {object} user - { id (UUID string), email, role }
 * @returns {string} Signed JWT
 */
function generateAccessToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'ged-prep-api',
  });
}

/**
 * Generate a refresh JWT with a longer expiry.
 * @param {object} user - { id (UUID string) }
 * @returns {string} Signed refresh JWT
 */
function generateRefreshToken(user) {
  const payload = {
    sub: user.id,
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: '30d',
    issuer: 'ged-prep-api',
  });
}

// ---------------------------------------------------------------------------
// Verify token
// ---------------------------------------------------------------------------

/**
 * Verify and decode a JWT.
 * @param {string} token - The JWT string (without "Bearer " prefix)
 * @param {string} [expectedType] - If provided, rejects tokens with a different type
 * @returns {{ sub: string, email?: string, role?: string, type: string, iat: number, exp: number }}
 * @throws {UnauthorizedError} If token is invalid, expired, or wrong type
 */
function verifyToken(token, expectedType = null) {
  try {
    const decoded = jwt.verify(token, config.jwt.secret, {
      issuer: 'ged-prep-api',
    });

    // Reject tokens with unexpected type
    if (expectedType && decoded.type !== expectedType) {
      const err = new Error(`Expected token type "${expectedType}", got "${decoded.type}"`);
      err.name = 'TokenTypeError';
      throw err;
    }

    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const authErr = new Error('Token expired');
      authErr.name = 'TokenExpiredError';
      throw authErr;
    }
    if (err.name === 'JsonWebTokenError') {
      const authErr = new Error('Invalid token');
      authErr.name = 'JsonWebTokenError';
      throw authErr;
    }
    if (err.name === 'TokenTypeError') {
      throw err;
    }
    throw new Error('Token verification failed');
  }
}

/**
 * Decode a token without verification (for inspecting expiry etc.).
 * @param {string} token
 * @returns {object|null}
 */
function decodeTokenUnsafe(token) {
  try {
    return jwt.decode(token, { complete: false });
  } catch {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeTokenUnsafe,
};