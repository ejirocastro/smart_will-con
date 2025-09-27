/**
 * Test script to verify email verification functionality
 * Run this with: node test-email-verification.js
 */

const EmailVerification = require('./src/models/EmailVerification');
const emailService = require('./src/services/emailService');

async function testEmailVerification() {
    console.log('\n🧪 Testing Email Verification System');
    console.log('='.repeat(50));

    try {
        // Test 1: Generate verification code
        console.log('\n1. Testing code generation...');
        const testEmail = 'test@example.com';
        const testUserData = {
            email: testEmail,
            password: 'testpassword123',
            role: 'owner',
            name: 'Test User'
        };

        const verificationCode = EmailVerification.generateVerificationCode(testEmail, testUserData);
        console.log(`✅ Generated verification code: ${verificationCode}`);

        // Test 2: Send verification email
        console.log('\n2. Testing email sending...');
        const emailResult = await emailService.sendVerificationEmail(testEmail, verificationCode);
        
        if (emailResult.success) {
            console.log('✅ Email sent successfully');
            if (emailResult.previewUrl) {
                console.log(`📧 Preview URL: ${emailResult.previewUrl}`);
            }
        } else {
            console.log(`❌ Email failed: ${emailResult.error}`);
        }

        // Test 3: Verify the code
        console.log('\n3. Testing code verification...');
        const verification = EmailVerification.verifyCode(verificationCode);
        
        if (verification) {
            console.log('✅ Code verification successful');
            console.log(`📧 Email: ${verification.email}`);
            console.log(`👤 User: ${verification.userData.name}`);
        } else {
            console.log('❌ Code verification failed');
        }

        // Test 4: Test invalid code
        console.log('\n4. Testing invalid code...');
        const invalidVerification = EmailVerification.verifyCode('999999');
        
        if (!invalidVerification) {
            console.log('✅ Invalid code correctly rejected');
        } else {
            console.log('❌ Invalid code incorrectly accepted');
        }

        console.log('\n🎉 Email verification system test completed!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
    }
}

// Run the test
testEmailVerification();
