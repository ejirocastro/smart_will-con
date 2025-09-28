const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const databaseConnection = require('./src/config/database');

async function testDatabaseConnection() {
    console.log('🧪 Testing MongoDB Connection');
    console.log('='.repeat(50));
    
    try {
        console.log('\n📁 Attempting to connect to MongoDB...');
        await databaseConnection.connect();
        
        console.log('\n📊 Connection Status:');
        const status = databaseConnection.getConnectionStatus();
        console.log('- Connected:', status.isConnected);
        console.log('- Ready State:', status.readyState);
        console.log('- Host:', status.host);
        console.log('- Database:', status.name);
        
        console.log('\n🏥 Health Check:');
        const health = await databaseConnection.healthCheck();
        console.log('- Status:', health.status);
        console.log('- Ping Result:', health.ping);
        console.log('- Timestamp:', health.timestamp);
        
        console.log('\n✅ MongoDB connection test completed successfully!');
        
        // Disconnect after test
        await databaseConnection.disconnect();
        console.log('📁 Disconnected from MongoDB');
        
    } catch (error) {
        console.error('\n❌ MongoDB connection test failed:', error.message);
        
        if (error.message.includes('authentication')) {
            console.error('🔐 Authentication failed - check your username and password');
        } else if (error.message.includes('network')) {
            console.error('🌐 Network error - check your internet connection and cluster URL');
        } else if (error.message.includes('timeout')) {
            console.error('⏰ Connection timeout - check your network and cluster status');
        }
    }
}

// Run the test
testDatabaseConnection();