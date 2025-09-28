# SmartWill Deployment Guide

## Production URLs
- **Backend (Render)**: https://smart-will-con.onrender.com
- **Frontend (Vercel)**: TBD (will be assigned after deployment)

## Environment Configuration

### Backend (Render)
The backend is deployed on Render using the environment variables from `.env` file:
- MongoDB Atlas connection
- Gmail SMTP configuration
- JWT secrets

### Frontend (Vercel)
The frontend uses different environment variables per environment:

#### Development (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_ENV=development
```

#### Production (.env.production)
```
NEXT_PUBLIC_API_URL=https://smart-will-con.onrender.com
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_ENV=production
```

## Deployment Steps

### Backend Deployment (Render)
1. Backend is already deployed at: https://smart-will-con.onrender.com
2. Environment variables are configured in Render dashboard
3. Auto-deploys from main branch

### Frontend Deployment (Vercel)
1. Connect Vercel to your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Environment variables are automatically loaded from:
   - `.env.production` (for production builds)
   - `vercel.json` (backup configuration)

## API Endpoints
All API calls from frontend will use:
- **Development**: http://localhost:3001/api/*
- **Production**: https://smart-will-con.onrender.com/api/*

## CORS Configuration
Backend CORS is configured to allow:
- Local development: `localhost:3000`, `localhost:3002`
- Vercel domains: `*.vercel.app`
- Specific domain: `smart-will-con.vercel.app`

## Build Process
- Frontend: `npm run build` (Next.js static generation)
- Backend: `npm run build` (validates code and dependencies)

## Features Supported
- ✅ Email authentication with Gmail SMTP
- ✅ Wallet authentication with Stacks
- ✅ MongoDB user storage
- ✅ JWT token authentication
- ✅ Cross-origin requests (CORS)
- ✅ Environment-based configuration