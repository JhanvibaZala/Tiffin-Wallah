
const dns = require('dns');

// Use public DNS resolvers for MongoDB Atlas SRV lookups
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is missing from backend/.env');
    }

    console.log('Connecting to MongoDB Atlas...');

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db.databaseName}`);

    return true;
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    return false;
  }
};

module.exports = connectDB;
