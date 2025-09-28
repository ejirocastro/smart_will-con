const mongoose = require('mongoose');

// Define the User schema for MongoDB
const userSchema = new mongoose.Schema({
    // Email-based authentication fields
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values for wallet-only users
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: false // Not required for wallet-only users
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date
    },
    
    // Wallet-based authentication fields
    walletAddress: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values for email-only users
        uppercase: true,
        trim: true
    },
    publicKey: {
        type: String,
        required: false
    },
    walletType: {
        type: String,
        enum: ['stacks', 'bitcoin', 'ethereum'],
        default: 'stacks'
    },
    
    // Common user fields
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['owner', 'heir', 'verifier'],
        required: true,
        default: 'owner'
    },
    authMethod: {
        type: String,
        enum: ['email', 'wallet', 'hybrid'],
        required: true,
        default: 'email'
    },
    
    // Profile information
    profile: {
        name: String,
        avatar: String,
        bio: String
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: 'users' // Specify collection name
});

// Indexes for better performance (email and walletAddress already have unique indexes from schema)
userSchema.index({ authMethod: 1 });
userSchema.index({ role: 1 });

// Ensure either email or walletAddress is provided
userSchema.pre('save', function(next) {
    if (!this.email && !this.walletAddress) {
        next(new Error('Either email or wallet address is required'));
    } else {
        next();
    }
});

// Virtual for user ID (to maintain compatibility)
userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised
userSchema.set('toJSON', {
    virtuals: true
});

// Create and export the model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;