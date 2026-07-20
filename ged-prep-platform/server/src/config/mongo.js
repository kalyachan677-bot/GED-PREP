// ============================================================================
// GED Prep Platform — MongoDB Connection
// ============================================================================
// Wraps the existing Mongoose connection from database/mongodb/connection.js
// and also provides direct access to the Mongoose instance for model registration.
// ============================================================================

const mongoose = require('mongoose');
const { config } = require('../config');

function connectMongo() {
  return mongoose.connect(config.mongoUri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
    .then(() => {
      const state = mongoose.connection.readyState;
      const stateNames = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
      console.log(`[MongoDB] Connected to: ${config.mongoUri} (${stateNames[state]})`);
      return mongoose;
    })
    .catch((err) => {
      console.error('[MongoDB] Connection failed:', err.message);
      throw err;
    });
}

async function closeMongo() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed');
  }
}

module.exports = { connectMongo, closeMongo, mongoose };