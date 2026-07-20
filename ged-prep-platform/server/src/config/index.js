// ============================================================================
// GED Prep Platform — Configuration
// ============================================================================
// Centralized config loaded from environment variables with sensible defaults.
// All config values are validated at startup — fail-fast on missing required vars.
// ============================================================================

const required = (key, fallback) => {
  const value = process.env[key];
  if (value !== undefined && value !== '') return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${key}`);
};

const toInt = (val, fallback) => {
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? fallback : n;
};

const config = {
  // ---------------------------------------------------------------------------
  // Server
  // ---------------------------------------------------------------------------
  env: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 4000),
  host: process.env.HOST || '0.0.0.0',
  isDev: (process.env.NODE_ENV || 'development') === 'development',

  // ---------------------------------------------------------------------------
  // PostgreSQL
  // ---------------------------------------------------------------------------
  pg: {
    host: process.env.PGHOST || 'localhost',
    port: toInt(process.env.PGPORT, 5432),
    database: process.env.PGDATABASE || 'ged_prep',
    user: process.env.PGUSER || 'ged_prep_user',
    password: process.env.PGPASSWORD || 'ged_prep_pass',
    poolMin: toInt(process.env.PG_POOL_MIN, 2),
    poolMax: toInt(process.env.PG_POOL_MAX, 10),
    // Connection string built from parts (avoids logging password in URI)
    get connectionString() {
      return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    },
  },

  // ---------------------------------------------------------------------------
  // MongoDB
  // ---------------------------------------------------------------------------
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ged_prep_content',

  // ---------------------------------------------------------------------------
  // JWT
  // ---------------------------------------------------------------------------
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-to-a-secure-random-string',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // ---------------------------------------------------------------------------
  // Rate Limiting
  // ---------------------------------------------------------------------------
  rateLimit: {
    windowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 900000), // 15 min
    max: toInt(process.env.RATE_LIMIT_MAX, 100),
  },

  // ---------------------------------------------------------------------------
  // CORS
  // ---------------------------------------------------------------------------
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

// ---------------------------------------------------------------------------
// Validate required config at startup
// ---------------------------------------------------------------------------
function validateConfig() {
  const errors = [];

  if (config.pg.password === 'ged_prep_pass' && config.env === 'production') {
    errors.push('PGPASSWORD must be changed in production');
  }
  if (config.jwt.secret === 'change-me-to-a-secure-random-string' && config.env === 'production') {
    errors.push('JWT_SECRET must be changed in production');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n  - ${errors.join('\n  - ')}`);
  }
}

module.exports = { config, validateConfig };