// ============================================================================
// GED Prep Platform — Route Index
// ============================================================================
// Mounts all route modules under /api.
// As new loops add routes, register them here.
// ============================================================================

const express = require('express');
const healthRoutes = require('./health');

const router = express.Router();

// ---------------------------------------------------------------------------
// Public routes (no auth required)
// ---------------------------------------------------------------------------
router.use(healthRoutes);

// ---------------------------------------------------------------------------
// Protected routes (auth required — added in Loop 3)
// ---------------------------------------------------------------------------
// router.use('/auth', require('./auth'));
// router.use('/subjects', require('./subjects'));
// router.use('/quiz', require('./quiz'));
// ... etc.

module.exports = router;