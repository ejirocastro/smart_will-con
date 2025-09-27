const express = require('express');
const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const emailService = require('../services/emailService');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Login endpoint - only allows login if email is verified
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation - ensure both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }

        // Find user in database by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid email or password' 
            });
        }

        // REQUIREMENT: Check if email is verified before allowing login
        if (!user.emailVerified) {
            return res.status(403).json({ 
                error: 'Please verify your email address before logging in. Check your inbox for the verification code.' 
            });
        }

        // Validate password against stored hash
        const isValidPassword = await User.validatePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Invalid email or password' 
            });
        }

        // Generate JWT token for session authentication
        const token = generateToken(user);
        const sanitizedUser = User.sanitizeUser(user);

        res.json({
            message: 'Login successful',
            user: sanitizedUser,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed',
            message: error.message 
        });
    }
});

// Signup endpoint (now with email verification)
router.post('/signup', async (req, res) => {
    try {
        const { email, password, role, name } = req.body;

        // Validation
        if (!email || !password || !role) {
            return res.status(400).json({ 
                error: 'Email, password, and role are required' 
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Please enter a valid email address' 
            });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long' 
            });
        }

        // Role validation
        const validRoles = ['owner', 'heir', 'verifier'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                error: 'Invalid role. Must be one of: owner, heir, verifier' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ 
                error: 'An account with this email already exists' 
            });
        }

        // Check if there's already a pending verification for this email
        if (EmailVerification.hasPendingVerification(email)) {
            return res.status(400).json({ 
                error: 'A verification email has already been sent. Please check your inbox or wait before requesting a new one.' 
            });
        }

        // Generate 6-digit verification code and store user data temporarily
        const userData = { email, password, role, name };
        const verificationCode = EmailVerification.generateVerificationCode(email, userData);

        // Send verification email with 6-digit code
        const emailResult = await emailService.sendVerificationEmail(email, verificationCode);

        if (!emailResult.success) {
            return res.status(500).json({ 
                error: 'Failed to send verification email',
                message: emailResult.error 
            });
        }

        res.status(200).json({
            message: 'Verification code sent! Please check your email and enter the 6-digit code to complete your registration.',
            email: email,
            requiresVerification: true,
            codeExpiry: '15 minutes',
            previewUrl: emailResult.previewUrl, // For development only
            devNote: process.env.NODE_ENV !== 'production' ? 'Check the backend console for the verification code' : undefined
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            error: 'Account creation failed',
            message: error.message 
        });
    }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
    try {
        res.json({
            user: req.user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            error: 'Failed to get user profile' 
        });
    }
});

// Logout endpoint (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Logout successful. Please remove the token from client storage.' 
    });
});

// REQUIREMENT: Email verification endpoint - submit 6-digit code to verify
router.post('/verify-email', async (req, res) => {
    try {
        const { code, email } = req.body;

        // Input validation - ensure both code and email are provided
        if (!code || !email) {
            return res.status(400).json({ 
                error: 'Verification code and email are required' 
            });
        }

        // Validate code format (must be 6 digits)
        if (!/^\d{6}$/.test(code)) {
            return res.status(400).json({ 
                error: 'Verification code must be exactly 6 digits' 
            });
        }

        // Verify the 6-digit code
        const verification = EmailVerification.verifyCode(code);
        
        if (!verification) {
            return res.status(400).json({ 
                error: 'Invalid or expired verification code. Please request a new one.' 
            });
        }

        // Ensure the code belongs to the provided email
        if (verification.email !== email) {
            return res.status(400).json({ 
                error: 'Verification code does not match the provided email' 
            });
        }

        // Create the user account now that email is verified
        const newUser = await User.create(verification.userData);

        // Generate JWT authentication token for immediate login
        const authToken = generateToken(newUser);

        // Send welcome email to confirm account creation
        await emailService.sendWelcomeEmail(newUser.email, newUser.name);

        // Clean up verification code from storage
        EmailVerification.removeCode(code);

        res.json({
            message: 'Email verified successfully! Your account has been created and you are now logged in.',
            user: newUser,
            token: authToken
        });

    } catch (error) {
        console.error('Email verification error:', error);
        
        if (error.message === 'User with this email already exists') {
            return res.status(409).json({ 
                error: 'An account with this email already exists' 
            });
        }

        res.status(500).json({ 
            error: 'Email verification failed',
            message: error.message 
        });
    }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                error: 'Email is required' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ 
                error: 'An account with this email already exists and is verified' 
            });
        }

        // Check if there's a pending verification
        const pendingVerification = EmailVerification.findByEmail(email);
        if (!pendingVerification) {
            return res.status(404).json({ 
                error: 'No pending verification found for this email' 
            });
        }

        // Generate new 6-digit code
        const newCode = EmailVerification.generateVerificationCode(email, pendingVerification.userData);

        // Send verification email with new code
        const emailResult = await emailService.sendVerificationEmail(email, newCode);

        if (!emailResult.success) {
            return res.status(500).json({ 
                error: 'Failed to send verification email',
                message: emailResult.error 
            });
        }

        res.json({
            message: 'Verification email resent successfully!',
            email: email,
            previewUrl: emailResult.previewUrl // For development only
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ 
            error: 'Failed to resend verification email',
            message: error.message 
        });
    }
});

// Refresh token endpoint
router.post('/refresh', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const newToken = generateToken(user);
        res.json({
            message: 'Token refreshed successfully',
            token: newToken
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ 
            error: 'Token refresh failed' 
        });
    }
});

module.exports = router;