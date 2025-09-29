/**
 * Vercel-Optimized Email Service
 * Handles email sending with fallbacks for serverless environments
 */

const nodemailer = require('nodemailer');

class VercelEmailService {
    constructor() {
        this.transporter = null;
        this.initialized = false;
    }

    /**
     * Setup email transporter optimized for Vercel
     */
    setupTransporter() {
        if (this.initialized) {
            return;
        }

        try {
            // Use more aggressive timeouts for Vercel
            this.transporter = nodemailer.createTransporter({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                },
                // Vercel-specific optimizations
                connectionTimeout: 10000, // 10 seconds
                greetingTimeout: 10000,   // 10 seconds
                socketTimeout: 10000,     // 10 seconds
                pool: false,              // Don't use connection pooling in serverless
                maxConnections: 1,        // Single connection
                rateDelta: 20000,         // Rate limiting
                rateLimit: 5,             // Max 5 emails per rateDelta
                secure: true,             // Use SSL
                requireTLS: true,         // Require TLS
                // Additional Vercel networking options
                tls: {
                    rejectUnauthorized: false, // Allow self-signed certificates if needed
                    ciphers: 'SSLv3'
                }
            });

            this.initialized = true;
            console.log('📧 Vercel email service configured with aggressive timeouts');
        } catch (error) {
            console.error('❌ Failed to setup Vercel email service:', error.message);
            throw error;
        }
    }

    /**
     * Send verification email with aggressive timeout handling
     */
    async sendVerificationEmail(email, code) {
        this.setupTransporter();

        console.log(`📧 Vercel: Sending verification email to ${email}`);
        console.log(`🔢 Verification code: ${code}`);

        const mailOptions = {
            from: process.env.EMAIL_FROM || '"SmartWill" <noreply@smartwill.com>',
            to: email,
            subject: '🛡️ Your SmartWill Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #3b82f6;">SmartWill Email Verification</h2>
                    <p>Your verification code is:</p>
                    <div style="background: #1f2937; color: #60a5fa; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 4px; margin: 20px 0; border-radius: 8px;">
                        <strong>${code}</strong>
                    </div>
                    <p>This code will expire in 15 minutes.</p>
                    <p>If you didn't create a SmartWill account, please ignore this email.</p>
                </div>
            `,
            text: `
SmartWill Email Verification

Your verification code is: ${code}

Enter this code to verify your email and complete registration.
This code expires in 15 minutes.

If you didn't create a SmartWill account, please ignore this email.
            `.trim()
        };

        try {
            // Very aggressive timeout for Vercel
            const result = await Promise.race([
                this.transporter.sendMail(mailOptions),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Vercel email timeout - 8 seconds')), 8000)
                )
            ]);

            console.log('✅ Vercel email sent successfully');
            return {
                success: true,
                messageId: result.messageId,
                message: 'Email sent via Vercel-optimized service'
            };

        } catch (error) {
            console.error('❌ Vercel email failed:', error.message);
            return {
                success: false,
                error: error.message,
                isVercelTimeout: error.message.includes('Vercel email timeout')
            };
        }
    }
}

module.exports = new VercelEmailService();