// Quick script to check what users are in MongoDB
require('dotenv').config();
const databaseConnection = require('./src/config/database');
const UserModel = require('./src/models/UserSchema');

async function checkUsers() {
    try {
        await databaseConnection.connect();
        
        // Get all users from MongoDB
        const users = await UserModel.find({}).lean();
        console.log(`📊 Total users in MongoDB: ${users.length}`);
        
        console.log('\n👥 Users in MongoDB:');
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. User ID: ${user._id}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Email: ${user.email || 'None'}`);
            console.log(`   Wallet: ${user.walletAddress || 'None'}`);
            console.log(`   Auth Method: ${user.authMethod}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Created: ${user.createdAt}`);
        });
        
        // Check specifically for wallet users
        const walletUsers = await UserModel.find({ authMethod: 'wallet' }).lean();
        console.log(`\n💰 Wallet users in MongoDB: ${walletUsers.length}`);
        
        if (walletUsers.length > 0) {
            console.log('\n💰 Wallet users details:');
            walletUsers.forEach((user, index) => {
                console.log(`\n${index + 1}. Wallet User:`);
                console.log(`   ID: ${user._id}`);
                console.log(`   Name: ${user.name}`);
                console.log(`   Wallet Address: ${user.walletAddress}`);
                console.log(`   Public Key: ${user.publicKey}`);
                console.log(`   Wallet Type: ${user.walletType}`);
                console.log(`   Auth Method: ${user.authMethod}`);
                console.log(`   Created: ${user.createdAt}`);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkUsers();