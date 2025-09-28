const { verifyMessageSignature } = require('@stacks/encryption');
const crypto = require('crypto');

/**
 * WalletService - Backend wallet authentication and management
 * 
 * Handles:
 * - Challenge generation for wallet authentication
 * - Signature verification using Stacks encryption
 * - Wallet address validation
 * - Integration with existing user management
 */
class WalletService {
    constructor() {
        // Store active challenges (in production, use Redis or database)
        this.challenges = new Map();
        
        // Challenge expiration time (5 minutes)
        this.challengeExpirationMs = 5 * 60 * 1000;
    }

    /**
     * Generate a unique challenge for wallet authentication
     * @param {string} address - Wallet address
     * @param {string} type - Challenge type ('connection', 'payment', etc.)
     * @param {Object} options - Additional options (paymentId, amount, etc.)
     * @returns {Object} Challenge data
     */
    generateChallenge(address, type = 'connection', options = {}) {
        const timestamp = Date.now();
        const nonce = crypto.randomBytes(16).toString('hex');
        
        // Create challenge message
        let challengeMessage = `SmartWill Authentication\n`;
        challengeMessage += `Address: ${address}\n`;
        challengeMessage += `Type: ${type}\n`;
        challengeMessage += `Timestamp: ${timestamp}\n`;
        challengeMessage += `Nonce: ${nonce}`;
        
        // Add additional data for specific challenge types
        if (type === 'payment' && options.paymentId) {
            challengeMessage += `\nPayment ID: ${options.paymentId}`;
        }
        if (options.amount) {
            challengeMessage += `\nAmount: ${options.amount}`;
        }
        
        console.log('📋 Generated challenge message:');
        console.log('📋 Raw message:', JSON.stringify(challengeMessage));
        console.log('📋 Message preview:', challengeMessage);
        
        const challengeId = crypto.createHash('sha256')
            .update(`${address}-${timestamp}-${nonce}`)
            .digest('hex');
        
        const expiresAt = new Date(timestamp + this.challengeExpirationMs);
        
        // Store challenge
        this.challenges.set(challengeId, {
            message: challengeMessage,
            address,
            type,
            timestamp,
            expiresAt: expiresAt.toISOString(),
            used: false,
            ...options
        });
        
        // Clean up expired challenges
        this.cleanupExpiredChallenges();
        
        console.log(`📋 Generated challenge for ${address}:`, {
            challengeId: challengeId.substring(0, 8) + '...',
            type,
            expiresAt: expiresAt.toISOString()
        });
        
        return {
            challenge: challengeMessage,
            challengeId,
            expiresAt: expiresAt.toISOString()
        };
    }

    /**
     * Verify wallet signature against a challenge
     * @param {string} message - Original challenge message
     * @param {string} signature - Wallet signature
     * @param {string} publicKey - Public key from wallet
     * @param {string} address - Wallet address
     * @returns {Object} Verification result
     */
    verifySignature(message, signature, publicKey, address) {
        try {
            console.log('🔍 Verifying wallet signature...');
            console.log('📝 Message:', JSON.stringify(message));
            console.log('📝 Message type:', typeof message);
            console.log('📝 Message length:', message?.length);
            console.log('🔑 Public Key:', publicKey);
            console.log('🔑 Public Key type:', typeof publicKey);
            console.log('🔑 Public Key length:', publicKey?.length);
            console.log('📍 Address:', address);
            console.log('✍️ Signature:', signature);
            console.log('✍️ Signature type:', typeof signature);
            console.log('✍️ Signature length:', signature?.length);
            
            // Try different signature formats if the first one fails
            let isValid = false;
            let attemptedFormats = [];
            
            // Format 1: As received
            try {
                isValid = verifyMessageSignature({
                    message,
                    signature,
                    publicKey
                });
                attemptedFormats.push(`original(${signature?.substring(0, 10)}...)`);
                if (isValid) {
                    console.log('✅ Signature verified with original format');
                }
            } catch (e) {
                console.log('❌ Original format failed:', e.message);
                console.log('❌ Full error details:', e);
            }
            
            // Format 2: Add 0x prefix if missing
            if (!isValid && !signature.startsWith('0x')) {
                try {
                    const prefixedSig = '0x' + signature;
                    isValid = verifyMessageSignature({
                        message,
                        signature: prefixedSig,
                        publicKey
                    });
                    attemptedFormats.push(`prefixed(0x${signature?.substring(0, 8)}...)`);
                    if (isValid) {
                        console.log('✅ Signature verified with 0x prefix');
                    }
                } catch (e) {
                    console.log('❌ Prefixed format failed:', e.message);
                }
            }
            
            // Format 3: Remove 0x prefix if present
            if (!isValid && signature.startsWith('0x')) {
                try {
                    const unprefixedSig = signature.slice(2);
                    isValid = verifyMessageSignature({
                        message,
                        signature: unprefixedSig,
                        publicKey
                    });
                    attemptedFormats.push(`unprefixed(${signature?.substring(2, 10)}...)`);
                    if (isValid) {
                        console.log('✅ Signature verified without 0x prefix');
                    }
                } catch (e) {
                    console.log('❌ Unprefixed format failed:', e.message);
                }
            }
            
            console.log('🔄 Attempted signature formats:', attemptedFormats.join(', '));
            
            if (!isValid) {
                console.log('❌ All signature verification attempts failed');
                return {
                    success: false,
                    verified: false,
                    error: 'Invalid signature - tried multiple formats'
                };
            }
            
            console.log('✅ Signature verification successful');
            
            return {
                success: true,
                verified: true,
                address,
                publicKey
            };
            
        } catch (error) {
            console.error('❌ Signature verification error:', error);
            return {
                success: false,
                verified: false,
                error: error.message || 'Signature verification failed'
            };
        }
    }

    /**
     * Validate and process a challenge response
     * @param {string} message - Challenge message
     * @param {string} signature - Signature from wallet
     * @param {string} publicKey - Public key from wallet
     * @param {string} address - Wallet address
     * @returns {Object} Validation result
     */
    validateChallengeResponse(message, signature, publicKey, address) {
        try {
            // Find the challenge
            let challengeData = null;
            let challengeId = null;
            
            for (const [id, data] of this.challenges.entries()) {
                if (data.message === message && data.address === address) {
                    challengeData = data;
                    challengeId = id;
                    break;
                }
            }
            
            if (!challengeData) {
                return {
                    success: false,
                    error: 'Challenge not found or expired'
                };
            }
            
            // Check if challenge is expired
            if (new Date() > new Date(challengeData.expiresAt)) {
                this.challenges.delete(challengeId);
                return {
                    success: false,
                    error: 'Challenge has expired'
                };
            }
            
            // Check if challenge was already used
            if (challengeData.used) {
                return {
                    success: false,
                    error: 'Challenge has already been used'
                };
            }
            
            // Verify the signature
            const verificationResult = this.verifySignature(message, signature, publicKey, address);
            
            if (!verificationResult.success) {
                return verificationResult;
            }
            
            // Mark challenge as used
            challengeData.used = true;
            
            console.log('✅ Challenge validation successful');
            
            return {
                success: true,
                verified: true,
                challengeData,
                address,
                publicKey
            };
            
        } catch (error) {
            console.error('❌ Challenge validation error:', error);
            return {
                success: false,
                error: error.message || 'Challenge validation failed'
            };
        }
    }

    /**
     * Clean up expired challenges
     */
    cleanupExpiredChallenges() {
        const now = new Date();
        const expired = [];
        
        for (const [id, data] of this.challenges.entries()) {
            if (now > new Date(data.expiresAt)) {
                expired.push(id);
            }
        }
        
        expired.forEach(id => this.challenges.delete(id));
        
        if (expired.length > 0) {
            console.log(`🧹 Cleaned up ${expired.length} expired challenges`);
        }
    }

    /**
     * Validate Stacks address format
     * @param {string} address - Stacks address to validate
     * @returns {boolean} Whether address is valid
     */
    isValidStacksAddress(address) {
        console.log('🔍 Backend validating address:', address);
        console.log('🔍 Address type:', typeof address);
        console.log('🔍 Address length:', address?.length);
        
        if (!address || typeof address !== 'string') {
            console.log('❌ Address is not a valid string');
            return false;
        }
        
        // Must start with SP (mainnet) or ST (testnet)
        if (!address.startsWith('SP') && !address.startsWith('ST')) {
            console.log('❌ Address does not start with SP or ST');
            return false;
        }
        
        // Stacks addresses are typically 41 characters for both SP and ST
        // SP: mainnet addresses, ST: testnet addresses
        if (address.length !== 41) {
            console.log(`❌ Address length ${address.length} does not match expected 41`);
            return false;
        }
        
        // Check the rest is valid base58-like (allowing 0 but not O, I, l)
        const addressPart = address.substring(2);
        const expectedAddressLength = 39; // 41 total - 2 for SP/ST prefix
        const stacksBase58Regex = new RegExp(`^[0-9A-HJ-NP-Za-km-z]{${expectedAddressLength}}$`);
        const isValid = stacksBase58Regex.test(addressPart);
        
        console.log(`🔍 Address part: ${addressPart}`);
        console.log(`🔍 Expected length: ${expectedAddressLength}`);
        console.log(`🔍 Regex test result: ${isValid}`);
        
        return isValid;
    }

    /**
     * Get challenge statistics (for monitoring)
     */
    getChallengeStats() {
        const now = new Date();
        let active = 0;
        let expired = 0;
        let used = 0;
        
        for (const data of this.challenges.values()) {
            if (data.used) {
                used++;
            } else if (now > new Date(data.expiresAt)) {
                expired++;
            } else {
                active++;
            }
        }
        
        return {
            total: this.challenges.size,
            active,
            expired,
            used
        };
    }
}

// Create singleton instance
const walletService = new WalletService();
module.exports = walletService;