// ============================================================================
// GED Prep Platform — Auth Routes
// ============================================================================
// POST /api/auth/register  — Create a new user account
// POST /api/auth/login     — Sign in and get JWT
// GET  /api/auth/me        — Get current user profile (protected)
// PUT  /api/auth/me        — Update current user profile (protected)
// ============================================================================

const express = require('express');
const router = express.Router();

const { getPool } = require('../config/postgres');
const { hashPassword, comparePassword, signToken } = require('../utils/auth');
const { success } = require('../utils/response');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { BadRequestError, ConflictError, UnauthorizedError } = require('../utils/errors');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Sanitize user row — remove password_hash before sending to client.
 */
function sanitizeUser(row) {
  if (!row) return null;
  const { password_hash, ...safe } = row;
  return safe;
}

/**
 * Build the JWT payload and token for a user row.
 */
function buildAuthResponse(row) {
  const user = sanitizeUser(row);
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  return { user, token };
}

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
const registerSchema = {
  body: {
    email: {
      type: 'string',
      required: true,
      validate: (v) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Invalid email format';
        return null;
      },
    },
    password: {
      type: 'string',
      required: true,
      validate: (v) => {
        if (v.length < 8) return 'Password must be at least 8 characters';
        return null;
      },
    },
    first_name: { type: 'string', required: true },
    last_name: { type: 'string', required: true },
  },
};

router.post('/register', validate(registerSchema), async (req, res, next) => {
  const { email, password, first_name, last_name, display_name, preferred_lang, timezone, target_ged_date } = req.body;

  try {
    const pool = getPool();

    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return next(new ConflictError('An account with this email already exists'));
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, display_name, preferred_lang, timezone, target_ged_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        email,
        password_hash,
        first_name,
        last_name,
        display_name || null,
        preferred_lang || 'en',
        timezone || 'UTC',
        target_ged_date || null,
      ]
    );

    const authResponse = buildAuthResponse(result.rows[0]);
    return success(res, authResponse, 201);

  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
const loginSchema = {
  body: {
    email: { type: 'string', required: true },
    password: { type: 'string', required: true },
  },
};

router.post('/login', validate(loginSchema), async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const pool = getPool();

    // Fetch user with password_hash (for comparison)
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND status = $2',
      [email, 'active']
    );

    if (result.rows.length === 0) {
      return next(new UnauthorizedError('Invalid email or password'));
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return next(new UnauthorizedError('Invalid email or password'));
    }

    const authResponse = buildAuthResponse(user);
    return success(res, authResponse);

  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/auth/me — Get current user profile
// ---------------------------------------------------------------------------
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const pool = getPool();

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return next(new UnauthorizedError('User not found'));
    }

    return success(res, sanitizeUser(result.rows[0]));

  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// PUT /api/auth/me — Update current user profile
// ---------------------------------------------------------------------------
const updateProfileSchema = {
  body: {
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    display_name: { type: 'string' },
    preferred_lang: { type: 'string' },
    timezone: { type: 'string' },
    target_ged_date: { type: 'string' },
    avatar_url: { type: 'string' },
  },
};

router.put('/me', requireAuth, validate(updateProfileSchema), async (req, res, next) => {
  // Collect only the fields that were provided
  const allowedFields = ['first_name', 'last_name', 'display_name', 'preferred_lang', 'timezone', 'target_ged_date', 'avatar_url'];
  const updates = {};
  const values = [];
  let paramIndex = 1;

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = `$${paramIndex}`;
      values.push(req.body[field]);
      paramIndex++;
    }
  }

  // Nothing to update
  if (Object.keys(updates).length === 0) {
    return next(new BadRequestError('No valid fields to update'));
  }

  // Add WHERE parameter
  values.push(req.user.userId);

  const setClauses = Object.entries(updates).map(([k, v]) => `${k} = ${v}`).join(', ');

  try {
    const pool = getPool();

    const result = await pool.query(
      `UPDATE users SET ${setClauses} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return next(new UnauthorizedError('User not found'));
    }

    return success(res, sanitizeUser(result.rows[0]));

  } catch (err) {
    next(err);
  }
});

module.exports = router;