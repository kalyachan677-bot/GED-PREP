// ============================================================================
// GED Prep Platform — Route Index
// ============================================================================
// Mounts all route modules under /api.
// As new loops add routes, register them here.
// ============================================================================

const express = require('express');
const healthRoutes = require('./health');
const authRoutes = require('./auth');

const router = express.Router();

// ---------------------------------------------------------------------------
// Public routes (no auth required)
// ---------------------------------------------------------------------------
router.use(healthRoutes);

// ---------------------------------------------------------------------------
// Auth routes (public register/login, protected me)
// ---------------------------------------------------------------------------
router.use('/auth', authRoutes);

// ---------------------------------------------------------------------------
// Protected routes (auth required — added in future loops)
// ---------------------------------------------------------------------------
// router.use('/subjects', require('./subjects'));
// router.use('/quiz', require('./quiz'));
// ... etc.

module.exports = router;