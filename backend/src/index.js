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

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware - allow frontend to communicate with backend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Frontend URL
    credentials: true  // Allow cookies and credentials
}));

// JSON parsing middleware - parse incoming JSON requests
app.use(express.json());

// Authentication routes - all auth endpoints under /api/auth
app.use('/api/auth', authRoutes);

// Health check endpoint - verify server is running
app.get('/api/health', (_, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'SmartWill Backend'
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

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 SmartWill Backend running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📧 Email service: ${process.env.NODE_ENV === 'production' ? 'Production SMTP' : 'Ethereal Email (dev)'}`);
    console.log(`⚡ Health check: http://localhost:${PORT}/api/health`);
});