// ============================================================================
// GED Prep Platform — Health Check Route
// ============================================================================
// GET /api/health
// Returns server status, PostgreSQL and MongoDB connectivity, and uptime.
// Used by load balancers, monitoring, and developers to verify the API is up.
// ============================================================================

const express = require('express');
const { getPool } = require('../config/postgres');
const { mongoose } = require('../config/mongo');
const { success, error: sendError } = require('../utils/response');

const router = express.Router();

// ---------------------------------------------------------------------------
// GET /api/health — Full health check with DB connectivity
// ---------------------------------------------------------------------------
router.get('/health', async (req, res) => {
  const startTime = Date.now();
  const checks = {
    server: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    postgresql: null,
    mongodb: null,
  };

  let allHealthy = true;

  // PostgreSQL check
  try {
    const pool = getPool();
    const result = await pool.query('SELECT 1 AS ok');
    checks.postgresql = result.rows[0].ok === 1 ? 'ok' : 'degraded';
  } catch (err) {
    checks.postgresql = 'error';
    checks.pgError = config.isDev ? err.message : 'Connection failed';
    allHealthy = false;
  }

  // MongoDB check
  try {
    const state = mongoose.connection.readyState;
    if (state === 1) {
      checks.mongodb = 'ok';
    } else {
      const stateNames = { 0: 'disconnected', 2: 'connecting', 3: 'disconnecting' };
      checks.mongodb = 'error';
      checks.mongoError = config.isDev
        ? `State: ${stateNames[state] || state}`
        : 'Connection failed';
      allHealthy = false;
    }
  } catch (err) {
    checks.mongodb = 'error';
    checks.mongoError = config.isDev ? err.message : 'Connection failed';
    allHealthy = false;
  }

  checks.responseTimeMs = Date.now() - startTime;

  if (!allHealthy) {
    return sendError(res, 'Service degraded', 503, checks);
  }

  return success(res, checks, 200);
});

// ---------------------------------------------------------------------------
// GET /api/ — API info
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  return success(res, {
    name: 'GED Prep Platform API',
    version: '0.1.0',
    endpoints: {
      health: 'GET /api/health',
      // Future loops will add their routes here
    },
  });
});

// Import config for dev check
const { config } = require('../config');

module.exports = router;