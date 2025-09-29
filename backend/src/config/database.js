const mongoose = require('mongoose');
const { getMongoConnectionOptions } = require('../utils/serverless');

// Global flag to track connection state across serverless invocations
let isConnected = false;

class DatabaseConnection {
    constructor() {
        // Remove instance-based connection tracking for serverless compatibility
    }

    /**
     * Connect to MongoDB using the connection string from environment variables
     * Optimized for serverless environments (Vercel)
     */
    async connect() {
        // Check if we already have a working connection
        if (mongoose.connection.readyState === 1) {
            isConnected = true;
            return Promise.resolve();
        }

        // If connection is in progress, wait for it
        if (mongoose.connection.readyState === 2) {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Connection timeout - took too long to connect'));
                }, 10000);
                
                mongoose.connection.once('connected', () => {
                    clearTimeout(timeout);
                    isConnected = true;
                    resolve();
                });
                
                mongoose.connection.once('error', (error) => {
                    clearTimeout(timeout);
                    isConnected = false;
                    reject(error);
                });
            });
        }

        try {
            // Check if DATABASE_URL is configured
            if (!process.env.DATABASE_URL) {
                throw new Error('DATABASE_URL not configured');
            }

            console.log('📁 Creating MongoDB connection for serverless...');
            
            // Simplified connection options for Vercel
            const options = {
                maxPoolSize: 1,
                serverSelectionTimeoutMS: 8000,
                socketTimeoutMS: 8000,
                connectTimeoutMS: 8000,
                // Critical: Don't buffer commands in serverless
                bufferCommands: false
            };

            await mongoose.connect(process.env.DATABASE_URL, options);
            isConnected = true;
            console.log('✅ MongoDB connected for serverless');

            // Minimal event handlers for serverless
            this.setupEventHandlers();

        } catch (error) {
            console.error('❌ MongoDB connection failed:', error.message);
            isConnected = false;
            throw error;
        }
    }

    /**
     * Setup event handlers for MongoDB connection
     * Minimal logging for serverless environments
     */
    setupEventHandlers() {
        // Only set up handlers once to avoid duplicate listeners
        if (!mongoose.connection.listenerCount('connected')) {
            mongoose.connection.on('connected', () => {
                console.log('📁 MongoDB connection established');
                isConnected = true;
            });

            mongoose.connection.on('error', (error) => {
                console.error('❌ MongoDB connection error:', error.message);
                isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('📁 MongoDB connection closed');
                isConnected = false;
            });

            // Handle application termination gracefully
            process.on('SIGINT', async () => {
                await this.disconnect();
                process.exit(0);
            });
        }
    }

    /**
     * Disconnect from MongoDB
     * Optimized for serverless - let Vercel handle connection lifecycle
     */
    async disconnect() {
        try {
            if (mongoose.connection.readyState === 1) {
                await mongoose.connection.close();
                console.log('📁 MongoDB connection closed gracefully');
            }
            isConnected = false;
        } catch (error) {
            console.error('❌ Error closing MongoDB connection:', error.message);
        }
    }

    /**
     * Get connection status
     */
    getConnectionStatus() {
        return {
            isConnected: isConnected,
            readyState: mongoose.connection.readyState,
            readyStateText: this.getReadyStateText(mongoose.connection.readyState),
            host: mongoose.connection.host,
            name: mongoose.connection.name
        };
    }

    /**
     * Convert mongoose ready state to readable text
     */
    getReadyStateText(state) {
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        return states[state] || 'unknown';
    }

    /**
     * Health check for the database connection
     */
    async healthCheck() {
        try {
            const adminDb = mongoose.connection.db.admin();
            const result = await adminDb.ping();
            return {
                status: 'healthy',
                connected: this.isConnected,
                ping: result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                connected: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

// Create singleton instance
const databaseConnection = new DatabaseConnection();

module.exports = databaseConnection;