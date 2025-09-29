/**
 * Direct MongoDB Connection for Vercel
 * Bypasses complex connection management for critical operations
 */

const mongoose = require('mongoose');

// Cache connection status across invocations
let cachedConnection = null;

/**
 * Direct connection to MongoDB - optimized for Vercel serverless
 * This bypasses our complex connection management for critical operations
 */
async function directConnect() {
    // If we have a cached working connection, use it
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        console.log('🚀 Direct MongoDB connection for Vercel...');
        
        const options = {
            maxPoolSize: 1,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            bufferCommands: false,
            bufferMaxEntries: 0
        };

        // Direct mongoose connection
        await mongoose.connect(process.env.DATABASE_URL, options);
        
        cachedConnection = mongoose.connection;
        console.log('✅ Direct MongoDB connection established');
        
        return cachedConnection;
        
    } catch (error) {
        console.error('❌ Direct MongoDB connection failed:', error.message);
        cachedConnection = null;
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

/**
 * Check if we have a working direct connection
 */
function hasWorkingConnection() {
    return cachedConnection && mongoose.connection.readyState === 1;
}

module.exports = {
    directConnect,
    hasWorkingConnection
};