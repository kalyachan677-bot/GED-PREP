// ============================================================================
// GED Prep Platform — User Routes
// ============================================================================
// GET    /api/users/me           — Get own profile (alias for /auth/me)
// PUT    /api/users/me           — Update own profile (name, display_name, lang, tz, target_date)
// PUT    /api/users/me/password  — Change own password
// GET    /api/users/:id          — Get any user by ID (admin/instructor only)
//
// Note: All DB operations use the real PostgreSQL schema.
// ============================================================================

const express = require('express');
const { getPool } = require('../config/postgres');
const { hashPassword, comparePassword } = require('../utils/password');
const { success } = require('../utils/response');
const { BadRequestError, NotFoundError, UnauthorizedError, ServiceUnavailableError, ValidationError } = require('../utils/errors');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

function requireDb() {
  try {
    return getPool();
  } catch {
    throw new ServiceUnavailableError('Database is not available');
  }
}

function sanitizeUser(row) {
  const { password_hash, ...safe } = row;
  return safe;
}

// ---------------------------------------------------------------------------
// GET /api/users/me — Get own profile
// ---------------------------------------------------------------------------
router.get('/me', async (req, res, next) => {
  try {
    const pool = requireDb();
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, display_name,
              role, status, preferred_lang, timezone, target_ged_date,
              avatar_url, created_at, updated_at
       FROM users WHERE id = $1`,
      [req.user.sub]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User');
    }

    return success(res, { user: sanitizeUser(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// PUT /api/users/me — Update own profile
// ---------------------------------------------------------------------------
router.put('/me', validate({
  body: {
    first_name:    { type: 'string' },
    last_name:     { type: 'string' },
    display_name:  { type: 'string' },
    preferred_lang:{ type: 'string' },
    timezone:      { type: 'string' },
    target_ged_date: { type: 'string' }, // ISO date string
    avatar_url:    { type: 'string' },
  },
}), async (req, res, next) => {
  try {
    const pool = requireDb();
    const userId = req.user.sub;

    // Build SET clause dynamically from provided fields only
    const allowedFields = ['first_name', 'last_name', 'display_name', 'preferred_lang', 'timezone', 'avatar_url'];
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(req.body[field]);
        paramIndex++;
      }
    }

    // Handle target_ged_date separately (needs DATE cast)
    if (req.body.target_ged_date !== undefined) {
      const dateVal = req.body.target_ged_date;
      if (dateVal === null) {
        setClauses.push('target_ged_date = NULL');
      } else {
        setClauses.push(`target_ged_date = $${paramIndex}::DATE`);
        values.push(dateVal);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      throw new BadRequestError('No fields to update');
    }

    values.push(userId); // WHERE id = $N
    const sql = `
      UPDATE users
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, first_name, last_name, display_name,
                role, status, preferred_lang, timezone, target_ged_date,
                avatar_url, created_at, updated_at
    `;

    const result = await pool.query(sql, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('User');
    }

    return success(res, { user: sanitizeUser(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// PUT /api/users/me/password — Change own password
// ---------------------------------------------------------------------------
router.put('/me/password', validate({
  body: {
    current_password: { type: 'string', required: true },
    new_password:     { type: 'string', required: true },
  },
}), async (req, res, next) => {
  try {
    const pool = requireDb();
    const userId = req.user.sub;
    const { current_password, new_password } = req.body;

    // Validate new password strength
    if (new_password.length < 8) {
      throw new ValidationError({ new_password: 'Password must be at least 8 characters' });
    }

    // Get current hash
    const current = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (current.rows.length === 0) {
      throw new NotFoundError('User');
    }

    // Verify current password
    const match = await comparePassword(current_password, current.rows[0].password_hash);
    if (!match) {
      throw new BadRequestError('Current password is incorrect');
    }

    // Hash and update
    const newHash = await hashPassword(new_password);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newHash, userId]
    );

    return success(res, { message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/users/:id — Get any user by ID (admin/instructor only)
// ---------------------------------------------------------------------------
router.get('/:id', authorize('admin', 'instructor'), async (req, res, next) => {
  try {
    const pool = requireDb();
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, display_name,
              role, status, preferred_lang, timezone, target_ged_date,
              avatar_url, created_at, updated_at
       FROM users WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User');
    }

    return success(res, { user: sanitizeUser(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;