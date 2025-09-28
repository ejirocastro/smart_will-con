const bcrypt = require('bcryptjs');
const UserModel = require('./UserSchema');

class User {
    /**
     * Find a user by their email address
     * @param {string} email - User's email address
     * @returns {Object|null} User object or null if not found
     */
    static async findByEmail(email) {
        try {
            const user = await UserModel.findOne({ email }).lean();
            return user || null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            return null;
        }
    }

    /**
     * Find a user by their wallet address
     * @param {string} walletAddress - Wallet address to search for
     * @returns {Object|null} User object or null if not found
     */
    static async findByWalletAddress(walletAddress) {
        try {
            const user = await UserModel.findOne({ walletAddress }).lean();
            return user || null;
        } catch (error) {
            console.error('Error finding user by wallet address:', error);
            return null;
        }
    }

    /**
     * Find a user by their unique ID
     * @param {string} id - User's unique identifier
     * @returns {Object|null} User object or null if not found
     */
    static async findById(id) {
        try {
            const user = await UserModel.findById(id).lean();
            return user ? this.sanitizeUser(user) : null;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            return null;
        }
    }

    /**
     * Create a new user account for email-based authentication
     * @param {Object} userData - User registration data
     * @returns {Object} Sanitized user object (without password)
     */
    static async createEmailUser(userData) {
        try {
            // Check if user already exists
            const existingUser = await this.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            // Create user object
            const newUser = new UserModel({
                email: userData.email,
                password: hashedPassword,
                role: userData.role,
                name: userData.name || 'New User',
                emailVerified: true,
                authMethod: 'email',
                verifiedAt: new Date(),
                profile: {
                    name: userData.name || 'New User'
                }
            });

            const savedUser = await newUser.save();
            console.log(`✅ Email user created in MongoDB: ${userData.email}`);
            
            return this.sanitizeUser(savedUser.toObject());
        } catch (error) {
            console.error('Error creating email user:', error);
            throw error;
        }
    }

    /**
     * Create new user with wallet authentication
     * @param {Object} userData - User data including wallet information
     * @returns {Object} Created user object
     */
    static async create(userData) {
        try {
            // For email users, use the specific email method
            if (userData.email && userData.password) {
                return this.createEmailUser(userData);
            }

            // Check if user exists by email (if provided)
            if (userData.email) {
                const existingUser = await this.findByEmail(userData.email);
                if (existingUser) {
                    throw new Error('User with this email already exists');
                }
            }

            // Check if user exists by wallet address (if provided)
            if (userData.walletAddress) {
                const existingWalletUser = await this.findByWalletAddress(userData.walletAddress);
                if (existingWalletUser) {
                    throw new Error('User with this wallet address already exists');
                }
            }

            // Create new user object for MongoDB
            const userDoc = {
                role: userData.role || 'owner',
                name: userData.name || userData.profile?.name || `User ${userData.walletAddress?.substring(0, 8)}...`,
                authMethod: userData.authMethod || 'wallet',
                emailVerified: userData.emailVerified || true,
                profile: {
                    name: userData.name || userData.profile?.name || `User ${userData.walletAddress?.substring(0, 8)}...`,
                    avatar: userData.profile?.avatar || null
                }
            };

            // Add wallet-specific fields
            if (userData.walletAddress) {
                userDoc.walletAddress = userData.walletAddress;
                userDoc.publicKey = userData.publicKey || '';
                userDoc.walletType = userData.walletType || 'stacks';
            }

            // Add email-specific fields
            if (userData.email) {
                userDoc.email = userData.email;
            }

            // Hash password if provided
            if (userData.password) {
                userDoc.password = await bcrypt.hash(userData.password, 10);
            }

            const newUser = new UserModel(userDoc);
            const savedUser = await newUser.save();
            
            console.log(`✅ User created in MongoDB:`, {
                id: savedUser._id,
                walletAddress: savedUser.walletAddress,
                email: savedUser.email,
                authMethod: savedUser.authMethod
            });
            
            return this.sanitizeUser(savedUser.toObject());
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * Validate a user's password against the stored hash
     * @param {string} plainPassword - Password entered by user
     * @param {string} hashedPassword - Stored hashed password
     * @returns {boolean} True if passwords match
     */
    static async validatePassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error('Error validating password:', error);
            return false;
        }
    }

    /**
     * Remove sensitive data (password) from user object before sending to client
     * @param {Object} user - Complete user object
     * @returns {Object} User object without password field
     */
    static sanitizeUser(user) {
        if (!user) return null;
        
        const { password, __v, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    /**
     * Connect wallet to existing user account
     * @param {string} userId - User ID to update
     * @param {Object} walletData - Wallet information to add
     * @returns {Object} Updated user object
     */
    static async connectWallet(userId, walletData) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {
                    walletAddress: walletData.walletAddress,
                    publicKey: walletData.publicKey,
                    walletType: walletData.walletType,
                    authMethod: 'hybrid' // User now has both email and wallet
                },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                throw new Error('User not found');
            }

            console.log(`✅ Wallet connected to user ${userId} in MongoDB`);
            return this.sanitizeUser(updatedUser.toObject());
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
    }

    /**
     * Update user's last login timestamp
     * @param {string} userId - User ID
     * @returns {boolean} Success status
     */
    static async updateLastLogin(userId) {
        try {
            const result = await UserModel.findByIdAndUpdate(
                userId,
                { lastLogin: new Date() },
                { new: true }
            );

            return !!result;
        } catch (error) {
            console.error('Error updating last login:', error);
            return false;
        }
    }

    /**
     * Get all users without sensitive data (for admin purposes)
     * @returns {Array} Array of sanitized user objects
     */
    static async getAllUsers() {
        try {
            const users = await UserModel.find({}).lean();
            return users.map(user => this.sanitizeUser(user));
        } catch (error) {
            console.error('Error getting all users:', error);
            return [];
        }
    }

    /**
     * Check if a user's email is verified
     * @param {string} email - User's email address
     * @returns {boolean} True if email is verified
     */
    static async isEmailVerified(email) {
        try {
            const user = await this.findByEmail(email);
            return user ? user.emailVerified === true : false;
        } catch (error) {
            console.error('Error checking email verification:', error);
            return false;
        }
    }

    /**
     * Initialize default demo users (for development)
     */
    static async initializeDemoUsers() {
        try {
            const existingOwner = await this.findByEmail('owner@example.com');
            if (existingOwner) {
                console.log('📝 Demo users already exist in MongoDB');
                return;
            }

            // Create demo users
            const demoUsers = [
                {
                    email: 'owner@example.com',
                    password: 'password123',
                    role: 'owner',
                    name: 'John Owner'
                },
                {
                    email: 'heir@example.com',
                    password: 'password123',
                    role: 'heir',
                    name: 'Sarah Heir'
                },
                {
                    email: 'verifier@example.com',
                    password: 'password123',
                    role: 'verifier',
                    name: 'Mike Verifier'
                }
            ];

            for (const userData of demoUsers) {
                await this.createEmailUser(userData);
            }

            console.log('✅ Demo users created in MongoDB');
        } catch (error) {
            console.error('Error initializing demo users:', error);
        }
    }
}

module.exports = User;