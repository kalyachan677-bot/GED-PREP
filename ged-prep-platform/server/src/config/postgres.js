// ============================================================================
// GED Prep Platform — PostgreSQL Connection Pool
// ============================================================================
// Single shared pool used across all route handlers via `db.query()`.
// The pool is created once at startup and gracefully closed on shutdown.
// ============================================================================

const { Pool } = require('pg');
const { config } = require('../config');

let pool = null;

function connectPostgres() {
  pool = new Pool({
    host: config.pg.host,
    port: config.pg.port,
    database: config.pg.database,
    user: config.pg.user,
    password: config.pg.password,
    min: config.pg.poolMin,
    max: config.pg.poolMax,
    // Wait 5s before giving up on acquiring a connection
    connectionTimeoutMillis: 5000,
    // Kill idle connections after 30min
    idleTimeoutMillis: 30000,
    // Allow the app to exit even if there are active connections
    allowExitOnIdle: false,
  });

  // Listen for pool-level errors (e.g., connection to DB lost)
  pool.on('error', (err) => {
    console.error('[PostgreSQL] Unhandled pool error:', err.message);
  });

  // Verify connectivity with a simple query
  return pool.query('SELECT NOW() AS connected_at, current_database() AS db, version() AS pg_version')
    .then((result) => {
      const row = result.rows[0];
      console.log(`[PostgreSQL] Connected to "${row.db}" (version: ${row.pg_version.split(',')[0]})`);
      return pool;
    })
    .catch((err) => {
      console.error('[PostgreSQL] Connection failed:', err.message);
      throw err;
    });
}

async function closePostgres() {
  if (pool) {
    try {
      await pool.end();
      console.log('[PostgreSQL] Pool closed');
    } catch (err) {
      console.error('[PostgreSQL] Error closing pool:', err.message);
    }
  }
}

function getPool() {
  if (!pool) {
    throw new Error('PostgreSQL pool not initialized. Call connectPostgres() first.');
  }
  return pool;
}

module.exports = { connectPostgres, closePostgres, getPool };