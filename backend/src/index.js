/**
 * SmartWill Backend Server
 * Express.js server providing authentication APIs with email verification
 * 
 * Features:
 * - User registration with 6-digit email verification codes
 * - JWT-based authentication and session management
 * - Email verification required before login
 * - Role-based access control (owner/heir/verifier)
 * - Nodemailer integration for email services
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const databaseConnection = require('./config/database');
const User = require('./models/User');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware - allow frontend to communicate with backend
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3002',  // Additional port for development
        'http://localhost:3001',  // Allow self-origin for health checks
        /\.vercel\.app$/,         // Allow all Vercel domains
        /\.netlify\.app$/,        // Allow Netlify domains (backup)
        'https://smart-will-con-bzm2.vercel.app',  // Specific production domain (without trailing slash)
        'https://smart-will-con.vercel.app'        // Alternative production domain
    ],
    credentials: true,  // Allow cookies and credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

// JSON parsing middleware - parse incoming JSON requests
app.use(express.json());

// Authentication routes - all auth endpoints under /api/auth
app.use('/api/auth', authRoutes);

// Root endpoint - basic API info
app.get('/', (_, res) => {
    res.json({ 
        service: 'SmartWill Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth/*'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint - verify server is running
app.get('/api/health', async (_, res) => {
    const dbHealth = await databaseConnection.healthCheck();
    const dbStatus = databaseConnection.getConnectionStatus();
    
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'SmartWill Backend',
        database: {
            ...dbHealth,
            connectionStatus: dbStatus
        }
    });
});

// CORS debug endpoint - help troubleshoot CORS issues
app.get('/api/cors-test', (req, res) => {
    res.json({
        message: 'CORS test successful',
        origin: req.headers.origin,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString(),
        headers: req.headers
    });
});

// Global error handling middleware - catch and handle all errors
app.use((err, _, res, __) => {
    console.error('Error occurred:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Initialize database connection and start the server
async function startServer() {
    try {
        // Connect to MongoDB
        await databaseConnection.connect();
        
        // Initialize demo users for development
        await User.initializeDemoUsers();
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 SmartWill Backend running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📧 Email service: Gmail SMTP configured`);
            console.log(`📁 Database: Connected to MongoDB`);
            console.log(`⚡ Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Start the application
startServer();