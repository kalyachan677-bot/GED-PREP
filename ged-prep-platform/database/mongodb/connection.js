// ============================================================================
// GED Prep Platform — MongoDB Connection Setup
// ============================================================================
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ged_prep_content';

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('[MongoDB] Connected to:', MONGO_URI);
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = { connectMongo };