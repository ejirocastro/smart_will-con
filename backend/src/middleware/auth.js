const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT secret key - should be changed in production and stored securely
const JWT_SECRET = process.env.JWT_SECRET || 'smartwill-secret-key-change-in-production';

/**
 * Generate JWT token for authenticated sessions
 * @param {Object} user - User object containing id, email, and role
 * @returns {string} JWT token valid for 24 hours
 */
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            emailVerified: user.emailVerified, // Include verification status
            name: user.name
        },
        JWT_SECRET,
        { expiresIn: '24h' }  // Token expires in 24 hours for security
    );
};

/**
 * Middleware to verify JWT token and authenticate requests
 * Expects token in Authorization header as "Bearer <token>"
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateToken = async (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        // Verify and decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find the user to ensure they still exist
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid token - user not found' });
        }

        // Add sanitized user data to request object for use in subsequent middleware
        req.user = User.sanitizeUser(user);
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(403).json({ error: 'Invalid token' });
    }
};

/**
 * Middleware factory for role-based authorization
 * Checks if authenticated user has required role(s)
 * @param {string|Array} roles - Required role(s) for access
 * @returns {Function} Express middleware function
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        // Ensure user is authenticated first
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Convert single role to array for consistent processing
        const userRoles = Array.isArray(roles) ? roles : [roles];
        
        // Check if user's role is in the allowed roles
        if (!userRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

module.exports = {
    generateToken,
    authenticateToken,
    requireRole
};