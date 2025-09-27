const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import the email service
const emailService = require('./src/services/emailService');

async function testRealEmail() {
    console.log('🧪 Testing Real Email Delivery with EJS Templates');
    console.log('='.repeat(60));
    
    try {
        // Test verification email
        console.log('\n📧 Testing Verification Email...');
        const verificationResult = await emailService.sendVerificationEmail(
            'awenayeriejiro@gmail.com', // Your email
            '123456' // Test code
        );
        
        console.log('Verification Email Result:', verificationResult);
        
        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test welcome email
        console.log('\n📧 Testing Welcome Email...');
        const welcomeResult = await emailService.sendWelcomeEmail(
            'awenayeriejiro@gmail.com', // Your email
            'Test User' // Test name
        );
        
        console.log('Welcome Email Result:', welcomeResult);
        
        console.log('\n✅ Email testing completed!');
        console.log('📧 Check your email inbox for both emails');
        
    } catch (error) {
        console.error('❌ Email test failed:', error);
    }
}

// Run the test
testRealEmail();