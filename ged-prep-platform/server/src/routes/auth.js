// ============================================================================
// GED Prep Platform — Auth Routes
// ============================================================================
// POST /api/auth/register   — Create a new user account
// POST /api/auth/login      — Login with email + password
// GET  /api/auth/me        — Get current user info (requires auth)
// POST /api/auth/refresh   — Refresh access token
//
// Note: All DB operations use the real PostgreSQL schema from 001_init_schema.sql.
//       When no DB is available, endpoints return 503 with a clear message.
// ============================================================================

const express = require('express');
const { getPool } = require('../config/postgres');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { success } = require('../utils/response');
const { BadRequestError, UnauthorizedError, ConflictError, ServiceUnavailableError, ValidationError } = require('../utils/errors');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Helper: check if PG is available
function requireDb() {
  try {
    return getPool();
  } catch {
    throw new ServiceUnavailableError('Database is not available');
  }
}

// Helper: sanitize user object (remove password_hash)
function sanitizeUser(row) {
  const { password_hash, ...safe } = row;
  return safe;
}

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
router.post('/register', validate({
  body: {
    email:      { type: 'string', required: true },
    password:   { type: 'string', required: true },
    first_name: { type: 'string', required: true },
    last_name:  { type: 'string', required: true },
    display_name: { type: 'string' },
  },
}), async (req, res, next) => {
  try {
    const pool = requireDb();
    const { email, password, first_name, last_name, display_name } = req.body;

    // Validate password strength
    if (password.length < 8) {
      throw new ValidationError({ password: 'Password must be at least 8 characters' });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, display_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, display_name, role, status, preferred_lang, timezone, target_ged_date, created_at`,
      [email.toLowerCase().trim(), password_hash, first_name.trim(), last_name.trim(), display_name?.trim() || null]
    );

    const user = result.rows[0];

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return success(res, {
      user: sanitizeUser(user),
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: 604800, // 7 days in seconds
      },
    }, 201);

  } catch (err) {
    // PostgreSQL unique violation on email
    if (err.code === '23505') {
      return next(new ConflictError('An account with this email already exists'));
    }
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
router.post('/login', validate({
  body: {
    email:    { type: 'string', required: true },
    password: { type: 'string', required: true },
  },
}), async (req, res, next) => {
  try {
    const pool = requireDb();
    const { email, password } = req.body;

    // Find user by email
    const result = await pool.query(
      `SELECT id, email, password_hash, first_name, last_name, display_name,
              role, status, preferred_lang, timezone, target_ged_date, created_at
       FROM users
       WHERE email = $1 AND status = 'active'`,
      [email.toLowerCase().trim()]
    );

    const user = result.rows[0];
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return success(res, {
      user: sanitizeUser(user),
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: 604800,
      },
    });

  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/auth/me — Get current authenticated user
// ---------------------------------------------------------------------------
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const pool = requireDb();
    const userId = req.user.sub;

    const result = await pool.query(
      `SELECT id, email, first_name, last_name, display_name,
              role, status, preferred_lang, timezone, target_ged_date, avatar_url, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    const user = result.rows[0];
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return success(res, { user: sanitizeUser(user) });

  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/auth/refresh — Get new access token from refresh token
// ---------------------------------------------------------------------------
router.post('/refresh', async (req, res, next) => {
  try {
    // Accept refresh_token from body or Authorization header
    let refreshToken = req.body?.refresh_token;

    if (!refreshToken) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        refreshToken = authHeader.slice(7).trim();
      }
    }

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, 'refresh');

    // Look up user to ensure they still exist and are active
    const pool = requireDb();
    const result = await pool.query(
      `SELECT id, email, role, status
       FROM users
       WHERE id = $1 AND status = 'active'`,
      [decoded.sub]
    );

    const user = result.rows[0];
    if (!user) {
      throw new UnauthorizedError('User not found or deactivated');
    }

    // Issue new access token (keep same refresh token)
    const newAccessToken = generateAccessToken(user);

    return success(res, {
      tokens: {
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: 604800,
      },
    });

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Refresh token expired — please log in again'));
    }
    next(err);
  }
});

module.exports = router;
