/**
 * Database Connection Helper for Serverless Functions
 * Provides safe database connection with timeout handling
 */

const databaseConnection = require('../config/database');

/**
 * Ensure database connection with timeout handling
 * Optimized for Vercel serverless functions
 */
async function ensureDBConnection() {
    try {
        const isVercel = process.env.VERCEL;
        const timeout = isVercel ? 6000 : 10000; // Shorter timeout for Vercel
        
        const connectionPromise = databaseConnection.connect();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`DB connection timeout after ${timeout}ms`)), timeout)
        );
        
        await Promise.race([connectionPromise, timeoutPromise]);
        return { success: true };
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return { 
            success: false, 
            error: error.message,
            isTimeout: error.message.includes('timeout')
        };
    }
}

/**
 * Middleware factory for routes that need database access
 * Usage: router.post('/endpoint', withDB, async (req, res) => {...})
 */
function withDB(req, res, next) {
    ensureDBConnection().then(result => {
        if (result.success) {
            next();
        } else {
            const statusCode = result.isTimeout ? 504 : 503;
            res.status(statusCode).json({
                error: 'Database connection failed',
                message: result.isTimeout 
                    ? 'Service is starting up. Please try again in a moment.'
                    : 'Service temporarily unavailable. Please try again.',
                retry: true,
                retryAfter: result.isTimeout ? 10 : 5 // seconds
            });
        }
    }).catch(error => {
        console.error('❌ Database middleware error:', error);
        res.status(503).json({
            error: 'Database connection error',
            message: 'Service temporarily unavailable.',
            retry: true
        });
    });
}

/**
 * Direct connection function for use in route handlers
 */
async function connectDB() {
    const result = await ensureDBConnection();
    if (!result.success) {
        const error = new Error('Database connection failed');
        error.statusCode = result.isTimeout ? 504 : 503;
        error.details = result;
        throw error;
    }
}

module.exports = {
    ensureDBConnection,
    withDB,
    connectDB
};