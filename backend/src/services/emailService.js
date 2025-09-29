const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initialized = false;
    }

    /**
     * Setup email transporter based on environment
     */
    setupTransporter() {
        if (this.initialized) {
            return;
        }

        // Check if Gmail credentials are provided
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_SERVICE) {
            // Use Gmail SMTP when credentials are configured
            this.transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            console.log(`📧 Email service configured: ${process.env.EMAIL_SERVICE}`);
            console.log(`📧 Email user: ${process.env.EMAIL_USER}`);
            this.initialized = true;
        } else {
            console.error('❌ Email credentials not configured! Please set EMAIL_USER, EMAIL_PASSWORD, and EMAIL_SERVICE in your .env file');
            console.error('Current env values:');
            console.error(`EMAIL_SERVICE: ${process.env.EMAIL_SERVICE}`);
            console.error(`EMAIL_USER: ${process.env.EMAIL_USER}`);
            console.error(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '[SET]' : '[NOT SET]'}`);
            throw new Error('Email service not configured. Please check your environment variables.');
        }
    }

    /**
     * Ensure transporter is initialized before use
     */
    ensureInitialized() {
        if (!this.initialized) {
            this.setupTransporter();
        }
    }

    /**
     * Render email template using EJS
     * @param {string} templateName - Name of the template file (without .ejs extension)
     * @param {Object} data - Data to pass to the template
     * @returns {Promise<string>} Rendered HTML
     */
    async renderEmailTemplate(templateName, data) {
        const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.ejs`);
        try {
            const html = await ejs.renderFile(templatePath, data);
            return html;
        } catch (error) {
            console.error(`Error rendering email template ${templateName}:`, error);
            throw new Error(`Failed to render email template: ${templateName}`);
        }
    }

    /**
     * Send verification email with 6-digit code
     * @param {string} email - Recipient email address
     * @param {string} code - 6-digit verification code
     * @returns {Promise<Object>} email result with success status
     */
    async sendVerificationEmail(email, code) {
        this.ensureInitialized();
        
        console.log(`📧 Sending verification email to: ${email}`);
        console.log(`🔢 Verification code: ${code}`);

        // Only skip email sending if explicitly set to skip
        if (process.env.SKIP_EMAIL_SEND === 'true') {
            console.log('⚠️ SKIP_EMAIL_SEND=true: Skipping actual email send');
            console.log(`🔢 Verification code for ${email}: ${code}`);
            return {
                success: true,
                messageId: 'dev-mode-skipped',
                message: 'Email skipped due to SKIP_EMAIL_SEND flag'
            };
        }

        try {
            // Render the verification email template
            const htmlContent = await this.renderEmailTemplate('verification', {
                verificationCode: code,
                userEmail: email
            });

            // Configure email options
            const mailOptions = {
                from: process.env.EMAIL_FROM || '"SmartWill" <noreply@smartwill.com>',
                to: email,
                subject: '🛡️ Verify Your SmartWill Account - Code Inside',
                html: htmlContent,
                text: `
Welcome to SmartWill!

Your verification code is: ${code}

Enter this 6-digit code to verify your email address and activate your account.

This code will expire in 15 minutes for security.

If you didn't create a SmartWill account, please ignore this email.

Best regards,
The SmartWill Team
                `.trim()
            };

            // Add timeout to prevent hanging
            const result = await Promise.race([
                this.transporter.sendMail(mailOptions),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Email sending timeout - took longer than 30 seconds')), 30000)
                )
            ]);
            
            console.log('✅ Verification email sent successfully!');
            console.log(`📧 Message ID: ${result.messageId}`);

            return {
                success: true,
                messageId: result.messageId,
                message: 'Verification email sent successfully'
            };

        } catch (error) {
            console.error('❌ Email sending failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send welcome email after verification
     * @param {string} email - User email
     * @param {string} name - User name
     * @returns {Promise<Object>} email result
     */
    async sendWelcomeEmail(email, name) {
        this.ensureInitialized();
        
        console.log(`📧 Sending welcome email to: ${name} (${email})`);

        try {
            // Render the welcome email template
            const htmlContent = await this.renderEmailTemplate('welcome', {
                userName: name,
                userEmail: email,
                frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
            });

            const mailOptions = {
                from: process.env.EMAIL_FROM || '"SmartWill" <noreply@smartwill.com>',
                to: email,
                subject: '🎉 Welcome to SmartWill! Your Account is Active',
                html: htmlContent,
                text: `
Welcome to SmartWill, ${name}!

Your account has been successfully verified and is now active.

You can now start creating your digital will and securing your digital legacy.

Get started: ${process.env.FRONTEND_URL || 'http://localhost:3000'}

Best regards,
The SmartWill Team
                `.trim()
            };

            const result = await this.transporter.sendMail(mailOptions);
            
            console.log('✅ Welcome email sent successfully!');
            console.log(`📧 Message ID: ${result.messageId}`);

            return { 
                success: true, 
                messageId: result.messageId,
                message: 'Welcome email sent successfully'
            };

        } catch (error) {
            console.error('❌ Welcome email failed:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
}

// Create singleton instance
const emailService = new EmailService();
module.exports = emailService;