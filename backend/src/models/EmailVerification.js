const crypto = require('crypto');

// In-memory storage for email verification codes (replace with database later)
let verificationCodes = [];

class EmailVerification {
    /**
     * Generate a 6-digit verification code for email confirmation
     * @param {string} email - User email address
     * @param {Object} userData - User data to store temporarily until verification
     * @returns {string} 6-digit verification code
     */
    static generateVerificationCode(email, userData) {
        // Generate secure 6-digit numeric code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store verification data
        const verificationData = {
            code,           // 6-digit code instead of long token
            email,
            userData,       // Store user registration data temporarily
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry for security
            verified: false,
            attempts: 0     // Track verification attempts to prevent brute force
        };

        // Remove any existing codes for this email to prevent multiple active codes
        verificationCodes = verificationCodes.filter(v => v.email !== email);
        
        // Add new verification code
        verificationCodes.push(verificationData);
        
        return code;
    }

    /**
     * Find verification data by 6-digit code
     * @param {string} code - 6-digit verification code
     * @returns {Object|null} verification data or null
     */
    static findByCode(code) {
        return verificationCodes.find(v => v.code === code) || null;
    }

    /**
     * Find verification data by email address
     * @param {string} email - Email address
     * @returns {Object|null} verification data or null
     */
    static findByEmail(email) {
        return verificationCodes.find(v => v.email === email) || null;
    }

    /**
     * Verify a 6-digit code and mark as verified
     * @param {string} code - 6-digit verification code
     * @returns {Object|null} verification data if valid, null otherwise
     */
    static verifyCode(code) {
        const verification = this.findByCode(code);
        
        // Return null if code doesn't exist
        if (!verification) {
            return null;
        }

        // Check if code has expired (15 minutes)
        if (new Date() > verification.expiresAt) {
            // Remove expired code for security
            this.removeCode(code);
            return null;
        }

        // Increment attempt counter to prevent brute force attacks
        verification.attempts += 1;

        // Allow max 3 verification attempts per code
        if (verification.attempts > 3) {
            this.removeCode(code);
            return null;
        }

        // Mark as verified and record verification timestamp
        verification.verified = true;
        verification.verifiedAt = new Date();
        
        return verification;
    }

    /**
     * Remove a verification code from storage
     * @param {string} code - 6-digit code to remove
     */
    static removeCode(code) {
        verificationCodes = verificationCodes.filter(v => v.code !== code);
    }

    /**
     * Remove expired verification codes (cleanup function)
     * Automatically called periodically to prevent memory buildup
     */
    static cleanupExpiredCodes() {
        const now = new Date();
        verificationCodes = verificationCodes.filter(v => v.expiresAt > now);
    }

    /**
     * Check if email has a pending (unexpired, unverified) verification code
     * @param {string} email - Email address to check
     * @returns {boolean} true if has pending verification
     */
    static hasPendingVerification(email) {
        const verification = this.findByEmail(email);
        return verification && !verification.verified && new Date() < verification.expiresAt;
    }

    /**
     * Get all verification codes (for debugging purposes only)
     * @returns {Array} all verification codes
     */
    static getAllCodes() {
        return verificationCodes;
    }
}

// Automatically cleanup expired verification codes every 30 minutes
// This prevents memory buildup from expired codes
setInterval(() => {
    EmailVerification.cleanupExpiredCodes();
}, 30 * 60 * 1000);

module.exports = EmailVerification;