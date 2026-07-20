// ============================================================================
// GED Prep Platform — Auth Utilities
// ============================================================================
// JWT token creation/verification and password hashing.
// Uses bcryptjs (pure JS, no native deps) and jsonwebtoken.
// ============================================================================

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { config } = require('../config');

// ---------------------------------------------------------------------------
// Password
// ---------------------------------------------------------------------------
const SALT_ROUNDS = 12;

async function hashPassword(plainText) {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

async function comparePassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

// ---------------------------------------------------------------------------
// JWT
// ---------------------------------------------------------------------------
/**
 * Sign a JWT with user payload.
 * @param {object} payload  - { userId, email, role }
 * @returns {string} JWT token
 */
function signToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'ged-prep-api',
  });
}

/**
 * Verify a JWT and return the decoded payload.
 * Throws on invalid/expired token.
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret, {
    issuer: 'ged-prep-api',
  });
}

/**
 * Extract token from Authorization header.
 * Supports "Bearer <token>" format.
 * @param {string} authHeader - Value of req.headers.authorization
 * @returns {string|null} The token string, or null if missing/malformed
 */
function extractToken(authHeader) {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

module.exports = { hashPassword, comparePassword, signToken, verifyToken, extractToken };