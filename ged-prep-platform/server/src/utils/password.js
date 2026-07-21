// ============================================================================
// GED Prep Platform — Password Utilities
// ============================================================================
// Wraps bcryptjs for hashing and comparing passwords.
// Uses 12 salt rounds (good balance of security vs. speed).
// ============================================================================

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 * @param {string} plainText
 * @returns {Promise<string>} The hashed password
 */
async function hashPassword(plainText) {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a hash.
 * @param {string} plainText
 * @param {string} hash
 * @returns {Promise<boolean>} true if the password matches
 */
async function comparePassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

module.exports = { hashPassword, comparePassword };