const bcrypt = require('bcryptjs');

// In-memory user storage for development (replace with database in production)
// Each user object contains: id, email, password (hashed), role, name, emailVerified, createdAt
let users = [
    {
        id: '1',
        email: 'owner@example.com',
        password: '$2b$10$tcXpcyjSZ.qjvXb0sLo7AuB26Ou70Xz5R3WjGXhmnRd5a0QuJkM6q', // password123
        role: 'owner',
        name: 'John Owner',
        emailVerified: true,    // Demo accounts are pre-verified
        createdAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString()
    },
    {
        id: '2',
        email: 'heir@example.com',
        password: '$2b$10$tcXpcyjSZ.qjvXb0sLo7AuB26Ou70Xz5R3WjGXhmnRd5a0QuJkM6q', // password123
        role: 'heir',
        name: 'Sarah Heir',
        emailVerified: true,    // Demo accounts are pre-verified
        createdAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString()
    },
    {
        id: '3',
        email: 'verifier@example.com',
        password: '$2b$10$tcXpcyjSZ.qjvXb0sLo7AuB26Ou70Xz5R3WjGXhmnRd5a0QuJkM6q', // password123
        role: 'verifier',
        name: 'Mike Verifier',
        emailVerified: true,    // Demo accounts are pre-verified
        createdAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString()
    }
];

class User {
    /**
     * Find a user by their email address
     * @param {string} email - User's email address
     * @returns {Object|null} User object or null if not found
     */
    static async findByEmail(email) {
        return users.find(user => user.email === email) || null;
    }

    /**
     * Find a user by their unique ID
     * @param {string} id - User's unique identifier
     * @returns {Object|null} User object or null if not found
     */
    static async findById(id) {
        return users.find(user => user.id === id) || null;
    }

    /**
     * Create a new user account (called after email verification)
     * @param {Object} userData - User registration data
     * @param {string} userData.email - User's email
     * @param {string} userData.password - User's password (will be hashed)
     * @param {string} userData.role - User's role (owner/heir/verifier)
     * @param {string} userData.name - User's full name
     * @returns {Object} Sanitized user object (without password)
     */
    static async create(userData) {
        // Check if user already exists to prevent duplicates
        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash the password for security (never store plain text passwords)
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Create new user object with all required fields
        const newUser = {
            id: Date.now().toString(),              // Generate unique ID
            email: userData.email,
            password: hashedPassword,               // Store hashed password
            role: userData.role,
            name: userData.name || 'New User',
            emailVerified: true,                    // Mark as verified since this is called after verification
            createdAt: new Date().toISOString(),
            verifiedAt: new Date().toISOString()    // Record when email was verified
        };

        // Add to users array (in production, this would be database insert)
        users.push(newUser);
        
        // Return user data without sensitive information
        return this.sanitizeUser(newUser);
    }

    /**
     * Validate a user's password against the stored hash
     * @param {string} plainPassword - Password entered by user
     * @param {string} hashedPassword - Stored hashed password
     * @returns {boolean} True if passwords match
     */
    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Remove sensitive data (password) from user object before sending to client
     * @param {Object} user - Complete user object
     * @returns {Object} User object without password field
     */
    static sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    /**
     * Get all users without sensitive data (for admin purposes)
     * @returns {Array} Array of sanitized user objects
     */
    static async getAllUsers() {
        return users.map(user => this.sanitizeUser(user));
    }

    /**
     * Check if a user's email is verified
     * @param {string} email - User's email address
     * @returns {boolean} True if email is verified
     */
    static async isEmailVerified(email) {
        const user = await this.findByEmail(email);
        return user ? user.emailVerified === true : false;
    }
}

module.exports = User;