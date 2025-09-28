// Quick script to clear wallet users for testing
require('dotenv').config();
const databaseConnection = require('./src/config/database');
const UserModel = require('./src/models/UserSchema');

async function clearWalletUsers() {
    try {
        await databaseConnection.connect();
        
        // Find and remove all wallet users
        const result = await UserModel.deleteMany({ authMethod: 'wallet' });
        console.log(`✅ Removed ${result.deletedCount} wallet users from MongoDB`);
        
        // List remaining users
        const remainingUsers = await UserModel.find({}, 'email walletAddress authMethod name').lean();
        console.log('📝 Remaining users:');
        remainingUsers.forEach(user => {
            console.log(`  - ${user.name} (${user.email || user.walletAddress}) - ${user.authMethod}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

clearWalletUsers();