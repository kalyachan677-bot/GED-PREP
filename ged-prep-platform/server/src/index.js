// ============================================================================
// GED Prep Platform — Express Server Entry Point
// ============================================================================
// Starts the HTTP server, connects to both databases, and sets up
// middleware + routes. Graceful shutdown on SIGINT/SIGTERM.
// ============================================================================

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');

const { config, validateConfig } = require('./config');
const { connectPostgres, closePostgres } = require('./config/postgres');
const { connectMongo, closeMongo } = require('./config/mongo');
const { corsMiddleware, requestLogger, rateLimiter, errorHandler, notFoundHandler } = require('./middleware');
const apiRoutes = require('./routes');

// ---------------------------------------------------------------------------
// Validate configuration
// ---------------------------------------------------------------------------
validateConfig();

// ---------------------------------------------------------------------------
// Create Express app
// ---------------------------------------------------------------------------
const app = express();

// ---------------------------------------------------------------------------
// Security headers (Helmet)
// ---------------------------------------------------------------------------
app.use(helmet({
  contentSecurityPolicy: false, // We'll configure CSP later when frontend is ready
  crossOriginEmbedderPolicy: false, // Allow embedding from other origins
}));

// ---------------------------------------------------------------------------
// Core middleware (order matters)
// ---------------------------------------------------------------------------
app.use(corsMiddleware);        // 1. CORS first
app.use(express.json({         // 2. Parse JSON bodies
  limit: '1mb',                //    Cap body size to prevent abuse
}));
app.use(requestLogger);        // 3. Log every request
app.use(rateLimiter);          // 4. Rate limiting

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use('/api', apiRoutes);

// ---------------------------------------------------------------------------
// 404 handler (must be after all routes)
// ---------------------------------------------------------------------------
app.use('/api', notFoundHandler);

// Also handle root path
app.get('/', (req, res) => {
  res.redirect('/api');
});

// ---------------------------------------------------------------------------
// Global error handler (must be last)
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const server = app.listen(config.port, config.host, () => {
  console.log(`\n========================================`);
  console.log(`  GED Prep Platform API`);
  console.log(`  Environment: ${config.env}`);
  console.log(`  Listening:   http://${config.host}:${config.port}`);
  console.log(`  API base:    http://${config.host}:${config.port}/api`);
  console.log(`========================================\n`);
});

// ---------------------------------------------------------------------------
// Connect databases after server is listening
// ---------------------------------------------------------------------------
async function startDatabases() {
  try {
    await connectPostgres();
  } catch (err) {
    console.error('[Startup] PostgreSQL connection failed — API will return 503 on health checks');
  }

  try {
    await connectMongo();
  } catch (err) {
    console.error('[Startup] MongoDB connection failed — API will return 503 on health checks');
  }
}

startDatabases();

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
async function shutdown(signal) {
  console.log(`\n[Shutdown] Received ${signal}. Shutting down gracefully...`);

  // Stop accepting new connections
  server.close(() => {
    console.log('[Shutdown] HTTP server closed');
  });

  // Close database connections
  await closePostgres();
  await closeMongo();

  console.log('[Shutdown] All connections closed. Exiting.');
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled promise rejection:', reason);
  shutdown('UNHANDLED_REJECTION');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err);
  shutdown('UNCAUGHT_EXCEPTION');
});

module.exports = { app, server };