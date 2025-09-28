const mongoose = require('mongoose');

class DatabaseConnection {
    constructor() {
        this.isConnected = false;
    }

    /**
     * Connect to MongoDB using the connection string from environment variables
     */
    async connect() {
        if (this.isConnected) {
            console.log('📁 Already connected to MongoDB');
            return;
        }

        try {
            // Check if DATABASE_URL is configured
            if (!process.env.DATABASE_URL) {
                console.warn('⚠️ DATABASE_URL not configured in environment variables');
                throw new Error('Database connection string not configured');
            }

            console.log('📁 Connecting to MongoDB...');
            
            // Connect to MongoDB with recommended options
            await mongoose.connect(process.env.DATABASE_URL, {
                // Connection pool settings
                maxPoolSize: 10, // Maintain up to 10 socket connections
                serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            });

            this.isConnected = true;
            console.log('✅ Successfully connected to MongoDB');
            console.log(`📁 Database: ${mongoose.connection.name}`);
            console.log(`📁 Host: ${mongoose.connection.host}`);

            // Handle connection events
            this.setupEventHandlers();

        } catch (error) {
            console.error('❌ MongoDB connection failed:', error.message);
            throw error;
        }
    }

    /**
     * Setup event handlers for MongoDB connection
     */
    setupEventHandlers() {
        mongoose.connection.on('connected', () => {
            console.log('📁 Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (error) => {
            console.error('❌ Mongoose connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('📁 Mongoose disconnected from MongoDB');
            this.isConnected = false;
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            await this.disconnect();
            process.exit(0);
        });
    }

    /**
     * Disconnect from MongoDB
     */
    async disconnect() {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.connection.close();
            this.isConnected = false;
            console.log('📁 Disconnected from MongoDB');
        } catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
        }
    }

    /**
     * Get connection status
     */
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        };
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