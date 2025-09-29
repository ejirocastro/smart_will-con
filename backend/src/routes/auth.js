const express = require('express');
const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const emailService = require('../services/emailService');
const vercelEmailService = require('../services/vercelEmailService');
const walletService = require('../services/walletService');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { connectDB } = require('../utils/db-helper');
const { directConnect } = require('../utils/direct-connect');

const router = express.Router();

// Login endpoint - only allows login if email is verified
router.post('/login', async (req, res) => {
    try {
        // For Vercel, use direct connection to avoid timeout issues
        if (process.env.VERCEL) {
            await directConnect();
        } else {
            await connectDB();
        }
        
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
        
        // Handle database connection errors specifically
        if (error.statusCode && (error.statusCode === 503 || error.statusCode === 504)) {
            return res.status(error.statusCode).json({
                error: 'Service temporarily unavailable',
                message: 'Database connection failed. Please try again in a moment.',
                retry: true
            });
        }
        
        res.status(500).json({ 
            error: 'Login failed',
            message: error.message 
        });
    }
});

// Signup endpoint (now with email verification)
router.post('/signup', async (req, res) => {
    try {
        // For Vercel, use direct connection to avoid timeout issues
        if (process.env.VERCEL) {
            await directConnect();
        } else {
            await connectDB();
        }
        
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
        console.log('🔄 Starting email send process...');
        const startTime = Date.now();
        
        // Send verification email with 6-digit code
        let emailResult = { success: true, previewUrl: null };
        
        try {
            console.log('📧 Sending verification email via SMTP...');
            
            // Use Vercel-optimized email service for production
            if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
                console.log('📧 Using Vercel-optimized email service...');
                emailResult = await vercelEmailService.sendVerificationEmail(email, verificationCode);
            } else {
                console.log('📧 Using standard email service...');
                emailResult = await emailService.sendVerificationEmail(email, verificationCode);
            }
            
            const endTime = Date.now();
            console.log(`📧 Email process completed in ${endTime - startTime}ms`);

            if (!emailResult.success) {
                console.error('❌ Email sending failed:', emailResult.error);
            } else {
                console.log('✅ Verification email sent successfully to:', email);
            }
            
            // Always log code as backup for development/debugging
            console.log(`🔢 VERIFICATION CODE for ${email}: ${verificationCode}`);
            
        } catch (emailError) {
            const endTime = Date.now();
            console.error(`❌ Email error after ${endTime - startTime}ms:`, emailError.message);
            
            // On Vercel, continue anyway to prevent total failure
            if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
                console.log('🔢 EMAIL FAILED - VERIFICATION CODE for', email, ':', verificationCode);
                console.log('⚠️ Production: Continuing despite email error to prevent timeout');
                console.log('📧 Email will be sent asynchronously or user can use verification code from logs');
                emailResult = { success: true, previewUrl: null }; // Pretend success to continue flow
            } else {
                throw emailError; // Rethrow on local development
            }
        }

        // For production/Vercel, include verification code if email failed
        const response = {
            message: 'Verification code sent! Please check your email and enter the 6-digit code to complete your registration.',
            email: email,
            requiresVerification: true,
            codeExpiry: '15 minutes',
            previewUrl: emailResult.previewUrl, // For development only
        };

        // Add debug info for non-production or if email failed
        if (process.env.NODE_ENV !== 'production') {
            response.devNote = 'Check the backend console for the verification code';
        }

        // If we're on Vercel/production and email might have failed, provide fallback
        if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
            response.fallbackNote = 'If you don\'t receive the email, contact support with your email address for the verification code.';
            // Optional: In development/staging, you might want to include the code directly
            if (process.env.NODE_ENV === 'staging') {
                response.verificationCode = verificationCode; // Only for staging
            }
        }

        res.status(200).json(response);

    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle database connection errors specifically
        if (error.statusCode && (error.statusCode === 503 || error.statusCode === 504)) {
            return res.status(error.statusCode).json({
                error: 'Service temporarily unavailable',
                message: 'Database connection failed. Please try again in a moment.',
                retry: true
            });
        }
        
        res.status(500).json({ 
            error: 'Account creation failed',
            message: error.message 
        });
    }
});

// Debug endpoint for testing signup without email sending
router.post('/debug-signup', async (req, res) => {
    try {
        const { email, password, role, name } = req.body;
        
        console.log('🐛 DEBUG: Testing signup flow...');
        console.log('🐛 Input:', { email, role, name, hasPassword: !!password });

        // Basic validation
        if (!email || !password || !role) {
            return res.status(400).json({ 
                error: 'Email, password, and role are required' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ 
                error: 'An account with this email already exists' 
            });
        }

        console.log('🐛 DEBUG: Validation passed, returning mock success');
        
        res.status(200).json({
            message: 'DEBUG: Signup flow working - email sending skipped',
            email: email,
            requiresVerification: true,
            debug: true
        });

    } catch (error) {
        console.error('🐛 DEBUG Signup error:', error);
        res.status(500).json({ 
            error: 'Debug signup failed',
            message: error.message 
        });
    }
});

// Debug endpoint to clear verification codes (development only)
router.post('/debug-clear-verification', async (req, res) => {
    try {
        if (process.env.NODE_ENV !== 'development') {
            return res.status(403).json({ 
                error: 'This endpoint is only available in development mode' 
            });
        }

        const { email } = req.body;

        if (email) {
            // Clear specific email's verification code
            const verification = EmailVerification.findByEmail(email);
            if (verification) {
                EmailVerification.removeCode(verification.code);
                console.log(`🐛 DEBUG: Cleared verification code for ${email}`);
                res.json({ 
                    message: `Verification code cleared for ${email}`,
                    cleared: true 
                });
            } else {
                res.json({ 
                    message: `No pending verification found for ${email}`,
                    cleared: false 
                });
            }
        } else {
            // Clear all verification codes
            const allCodes = EmailVerification.getAllCodes();
            const count = allCodes.length;
            
            // Clear all codes
            allCodes.forEach(verification => {
                EmailVerification.removeCode(verification.code);
            });
            
            console.log(`🐛 DEBUG: Cleared ${count} verification codes`);
            res.json({ 
                message: `Cleared ${count} verification codes`,
                cleared: count 
            });
        }

    } catch (error) {
        console.error('🐛 DEBUG Clear verification error:', error);
        res.status(500).json({ 
            error: 'Failed to clear verification codes',
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
        // Ensure database connection first
        await connectDB();
        
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
        const newUser = await User.createEmailUser(verification.userData);

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

// =================================================================
// WALLET AUTHENTICATION ENDPOINTS
// =================================================================

// Generate challenge for wallet authentication
router.get('/wallet/challenge', async (req, res) => {
    try {
        const { address, type = 'connection', paymentId, amount } = req.query;

        // Validate required parameters
        if (!address) {
            return res.status(400).json({
                success: false,
                error: 'Wallet address is required'
            });
        }

        // Validate Stacks address format
        if (!walletService.isValidStacksAddress(address)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Stacks address format'
            });
        }

        // Generate challenge
        const challengeData = walletService.generateChallenge(address, type, {
            paymentId,
            amount: amount ? parseFloat(amount) : undefined
        });

        console.log(`📋 Challenge generated for ${address}`);

        res.json({
            success: true,
            challenge: challengeData.challenge,
            challengeId: challengeData.challengeId,
            expiresAt: challengeData.expiresAt
        });

    } catch (error) {
        console.error('Challenge generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate challenge'
        });
    }
});

// Register new user with wallet authentication (simplified)
router.post('/register/wallet', async (req, res) => {
    try {
        const {
            walletAddress,
            publicKey,
            walletType = 'stacks',
            authMethod = 'wallet'
        } = req.body;

        console.log('📥 Wallet registration request:', {
            walletAddress,
            walletType,
            authMethod,
            hasPublicKey: !!publicKey
        });

        // Validate required fields
        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                error: 'Wallet address is required'
            });
        }

        // Validate Stacks address format
        if (!walletService.isValidStacksAddress(walletAddress)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Stacks address format'
            });
        }

        // Check if user already exists with this wallet address
        const existingUser = await User.findByWalletAddress(walletAddress);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User with this wallet address already exists'
            });
        }

        // Create new user with wallet authentication
        const userData = {
            walletAddress,
            publicKey: publicKey || '', // Optional for simplified approach
            walletType,
            authMethod,
            emailVerified: true, // Wallet users are considered verified
            role: 'owner', // Default role
            name: `User ${walletAddress.substring(0, 8)}...`, // Default name
            createdAt: new Date(),
            profile: {
                name: `User ${walletAddress.substring(0, 8)}...`,
                avatar: null
            }
        };

        console.log('👤 Creating user with data:', {
            walletAddress: userData.walletAddress,
            role: userData.role,
            name: userData.name,
            authMethod: userData.authMethod
        });

        const user = await User.create(userData);
        
        // Generate JWT token
        const token = generateToken({
            userId: user._id || user.id,
            walletAddress: user.walletAddress,
            authMethod: 'wallet'
        });

        console.log(`✅ New user registered with wallet: ${walletAddress}`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully with wallet',
            user: {
                id: user._id || user.id,
                walletAddress: user.walletAddress,
                walletType: user.walletType,
                authMethod: user.authMethod,
                role: user.role,
                name: user.name,
                profile: user.profile,
                createdAt: user.createdAt
            },
            token
        });

    } catch (error) {
        console.error('Wallet registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed',
            details: error.message
        });
    }
});

// Login with wallet authentication (simplified)
router.post('/login/wallet', async (req, res) => {
    try {
        const {
            walletAddress,
            walletType = 'stacks'
        } = req.body;

        console.log('📥 Wallet login request:', {
            walletAddress,
            walletType
        });

        // Validate required fields
        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                error: 'Wallet address is required'
            });
        }

        // Find user by wallet address
        const user = await User.findByWalletAddress(walletAddress);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'No account found with this wallet address'
            });
        }

        // Update last login time
        await User.updateLastLogin(user._id || user.id);

        // Generate JWT token
        const token = generateToken({
            userId: user._id || user.id,
            walletAddress: user.walletAddress,
            authMethod: 'wallet'
        });

        console.log(`✅ User logged in with wallet: ${walletAddress}`);

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id || user.id,
                walletAddress: user.walletAddress,
                walletType: user.walletType,
                authMethod: user.authMethod,
                role: user.role,
                name: user.name,
                profile: user.profile,
                lastLogin: new Date()
            },
            token
        });

    } catch (error) {
        console.error('Wallet login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed',
            details: error.message
        });
    }
});

// Connect wallet to existing email-based account
router.post('/connect-wallet', authenticateToken, async (req, res) => {
    try {
        const {
            address,
            signature,
            message,
            publicKey,
            walletType = 'stacks'
        } = req.body;

        // Validate required fields
        if (!address || !signature || !message || !publicKey) {
            return res.status(400).json({
                success: false,
                error: 'Address, signature, message, and publicKey are required'
            });
        }

        // Verify signature and challenge
        const validation = walletService.validateChallengeResponse(
            message,
            signature,
            publicKey,
            address
        );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                error: validation.error || 'Signature verification failed'
            });
        }

        // Check if wallet is already connected to another account
        const existingWalletUser = await User.findByWalletAddress(address);
        if (existingWalletUser && existingWalletUser._id.toString() !== req.user.userId) {
            return res.status(409).json({
                success: false,
                error: 'This wallet is already connected to another account'
            });
        }

        // Update current user with wallet information
        const updatedUser = await User.connectWallet(req.user.userId, {
            walletAddress: address,
            publicKey,
            walletType
        });

        console.log(`✅ Wallet connected to user: ${req.user.userId}`);

        res.json({
            success: true,
            message: 'Wallet connected successfully',
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                walletAddress: updatedUser.walletAddress,
                walletType: updatedUser.walletType,
                authMethod: updatedUser.authMethod
            }
        });

    } catch (error) {
        console.error('Wallet connection error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to connect wallet'
        });
    }
});

// Verify wallet signature (for additional security checks)
router.post('/wallet/verify', async (req, res) => {
    try {
        const {
            address,
            signature,
            message,
            publicKey
        } = req.body;

        // Validate required fields
        if (!address || !signature || !message || !publicKey) {
            return res.status(400).json({
                success: false,
                error: 'Address, signature, message, and publicKey are required'
            });
        }

        // Verify signature
        const verification = walletService.verifySignature(message, signature, publicKey, address);

        res.json({
            success: verification.success,
            verified: verification.verified,
            error: verification.error
        });

    } catch (error) {
        console.error('Signature verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Verification failed'
        });
    }
});

// Get wallet service statistics (for monitoring)
router.get('/wallet/stats', authenticateToken, async (req, res) => {
    try {
        // Only allow admin users to see stats (you can implement admin check)
        const stats = walletService.getChallengeStats();
        
        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get stats'
        });
    }
});

module.exports = router;