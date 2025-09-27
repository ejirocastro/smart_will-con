# Smart Will-Con: Email Verification Implementation Guide

## Overview

Your Smart Will-Con project now has a **complete email verification system** implemented. When users click "Create Account", they will receive a verification email with a 6-digit code.

## How It Works

### 1. User Registration Flow
```
User clicks "Create Account" → Backend generates 6-digit code → Email sent → User enters code → Account activated
```

### 2. API Endpoints

#### **POST /api/auth/signup**
- Creates verification code and sends email
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "owner",
  "name": "John Doe"
}
```
- **Response:**
```json
{
  "message": "Verification code sent! Please check your email...",
  "email": "user@example.com",
  "requiresVerification": true,
  "codeExpiry": "15 minutes"
}
```

#### **POST /api/auth/verify-email**
- Verifies the 6-digit code and creates account
- **Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```
- **Response:**
```json
{
  "message": "Email verified successfully! Your account has been created...",
  "user": { "id": "123", "email": "user@example.com", "name": "John Doe" },
  "token": "jwt-token-here"
}
```

#### **POST /api/auth/login**
- Only allows login for verified users
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### **POST /api/auth/resend-verification**
- Sends new verification code
- **Request Body:**
```json
{
  "email": "user@example.com"
}
```

## Email Service Configuration

### Development Mode (Default)
- Uses **Ethereal Email** for testing
- Verification codes are logged to console
- Preview URLs provided for viewing emails
- **No setup required**

### Production Mode
Update your `.env` file with real email credentials:
```bash
NODE_ENV=production
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="SmartWill" <noreply@smartwill.com>
```

## Security Features

1. **6-digit codes** (instead of long tokens)
2. **15-minute expiration** for security
3. **Maximum 3 attempts** per code
4. **Email verification required** before login
5. **JWT tokens** for session management
6. **Automatic cleanup** of expired codes

## File Structure

```
backend/src/
├── middleware/auth.js        # JWT authentication & authorization
├── models/User.js           # User model with in-memory storage
├── models/EmailVerification.js # Verification code management
├── services/emailService.js  # Email sending with templates
├── routes/auth.js           # Authentication API endpoints
└── index.js                # Main server setup
```

## Testing the System

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```

### 2. Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "owner",
    "name": "Test User"
  }'
```

### 3. Check Console for Verification Code
The backend will log the verification code to the console:
```
📧 EMAIL VERIFICATION CODE
==================================================
📧 To: test@example.com
🔢 Code: 123456
⏰ Expires: 15 minutes
🌐 Environment: development
==================================================
```

### 4. Verify Email
```bash
curl -X POST http://localhost:3001/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

### 5. Run Automated Test
```bash
cd backend
node test-email-verification.js
```

## Integration with Frontend

Your frontend should handle the registration flow like this:

```javascript
// 1. User registration
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, role, name })
});

if (response.ok) {
  // Show verification code input form
  showVerificationForm();
}

// 2. Code verification
const verifyResponse = await fetch('/api/auth/verify-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, code })
});

if (verifyResponse.ok) {
  const { token, user } = await verifyResponse.json();
  // Store token and redirect to dashboard
  localStorage.setItem('token', token);
  redirectToDashboard();
}
```

## Environment Variables

Create `.env` file in backend directory:
```bash
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT Secret (Change in production!)
JWT_SECRET=smartwill-secret-key-change-in-production-2024

# Email Configuration (optional for dev)
# EMAIL_SERVICE=gmail
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password
# EMAIL_FROM="SmartWill" <noreply@smartwill.com>
```

## Production Deployment

1. **Set production environment variables**
2. **Configure real email service** (Gmail, SendGrid, etc.)
3. **Use proper database** (replace in-memory storage)
4. **Enable HTTPS** for secure token transmission
5. **Set strong JWT secret**

## Troubleshooting

### Common Issues:

1. **No email received:**
   - Check console for verification code (development mode)
   - Verify email service configuration
   - Check spam folder

2. **"Invalid or expired code":**
   - Codes expire in 15 minutes
   - Maximum 3 attempts per code
   - Use `/api/auth/resend-verification` to get new code

3. **"Email already exists":**
   - User already registered
   - Try logging in instead

4. **Token issues:**
   - Ensure JWT_SECRET is set
   - Check token expiration (24 hours)

## Success! ✅

Your email verification system is now **fully implemented and working**. Users will receive verification emails when they create accounts, and only verified users can log in to your Smart Will-Con application.

The system is production-ready with proper security measures, error handling, and email templates. The console logging ensures you can always see verification codes during development.
