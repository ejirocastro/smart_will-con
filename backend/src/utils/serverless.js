/**
 * Serverless Environment Utilities
 * Optimizations specific to serverless platforms like Vercel
 */

/**
 * Check if running in serverless environment
 */
function isServerless() {
    return process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.FUNCTIONS_EMULATOR;
}

/**
 * Get optimal MongoDB connection settings for environment
 */
function getMongoConnectionOptions() {
    if (isServerless()) {
        return {
            // Serverless-optimized settings
            maxPoolSize: 1,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000,
            maxIdleTimeMS: 30000,
            connectTimeoutMS: 10000,
        };
    }

    return {
        // Traditional server settings
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
    };
}

/**
 * Warm up function for serverless environments
 * Call this early to establish connections
 */
async function warmUp() {
    if (isServerless()) {
        console.log('🔥 Serverless warm-up initiated');
        // Pre-establish database connection if needed
        const databaseConnection = require('../config/database');
        try {
            await databaseConnection.connect();
            console.log('🔥 Database connection warmed up');
        } catch (error) {
            console.error('❌ Warm-up failed:', error.message);
        }
    }
}

/**
 * Log environment information for debugging
 */
function logEnvironmentInfo() {
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🏢 Platform: ${isServerless() ? 'Serverless' : 'Traditional Server'}`);
    
    if (process.env.VERCEL) {
        console.log('⚡ Running on Vercel');
        console.log(`📍 Region: ${process.env.VERCEL_REGION || 'unknown'}`);
    }
    
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
        console.log('⚡ Running on AWS Lambda');
        console.log(`📍 Region: ${process.env.AWS_REGION || 'unknown'}`);
    }
}

module.exports = {
    isServerless,
    getMongoConnectionOptions,
    warmUp,
    logEnvironmentInfo
};