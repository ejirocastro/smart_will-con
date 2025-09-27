# SmartWill Backend API

Express.js backend server for the SmartWill application providing authentication and user management.

## Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password encryption
- **Role-based Access** - Support for owner, heir, and verifier roles
- **CORS Configuration** - Configured for frontend integration
- **Error Handling** - Comprehensive error handling and validation

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Health Check

- `GET /api/health` - Server health status

## Environment Variables

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
```

## Demo Accounts

The backend includes pre-seeded demo accounts:

- **Owner**: owner@example.com / password123
- **Heir**: heir@example.com / password123  
- **Verifier**: verifier@example.com / password123

## Security Features

- JWT token expiration (24 hours)
- Password complexity validation
- Email format validation
- Role-based access control
- Secure password hashing with bcrypt

## Project Structure

```
src/
├── index.js           # Express app setup
├── models/
│   └── User.js        # User model and database operations
├── middleware/
│   └── auth.js        # JWT authentication middleware
└── routes/
    └── auth.js        # Authentication route handlers
```