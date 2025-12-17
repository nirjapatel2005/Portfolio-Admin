# Environment Configuration Guide

This document explains how environment mode (development/production) is configured and used throughout the application.

## Overview

The application uses centralized environment configuration files to manage development and production modes consistently across the codebase.

## Configuration Files

### Backend Configuration
**Location:** `Portfolio-Cms-backend/backend/src/config/env.js`

This file exports:
- `isDevelopment` - Boolean indicating if running in development mode
- `isProduction` - Boolean indicating if running in production mode
- `config` - Object containing all environment variables and settings

**Usage:**
```javascript
import { isDevelopment, config } from "../config/env.js";

if (isDevelopment) {
  console.log("Development mode");
}
```

### Frontend Configuration
**Location:** `Portfolio-Admin/admin-panel/src/config/env.js`

This file exports:
- `isDevelopment` - Boolean indicating if running in development mode
- `isProduction` - Boolean indicating if running in production mode
- `config` - Object containing all environment variables and settings

**Usage:**
```javascript
import { isDevelopment, config } from "../config/env.js";

if (isDevelopment) {
  console.log("Development mode");
}
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development  # or 'production'
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_PANEL_URL=http://localhost:5173
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

**Note:** Vite automatically sets `import.meta.env.MODE` based on the build command:
- `npm run dev` → `development`
- `npm run build` → `production`

## Key Differences Between Modes

### Development Mode
- Detailed error messages in API responses
- Console logging enabled
- Reset tokens shown in forgot password flow
- More permissive CORS settings
- Debug information displayed

### Production Mode
- Generic error messages (no stack traces)
- Minimal console logging
- Reset tokens sent via email only
- Strict CORS validation
- No debug information

## Files Using Environment Configuration

### Backend
- `src/controllers/authController.js` - Error details, reset token handling
- `src/app.js` - CORS configuration
- `src/utils/socket.js` - Socket.io CORS and logging
- `src/config/db.js` - Database connection logging
- `server.js` - Server startup logging

### Frontend
- `src/pages/ForgotPassword.jsx` - Reset token display
- `src/services/api.js` - API base URL
- `src/context/SocketContext.jsx` - Socket connection logging

## Setting Environment Mode

### Backend
Set `NODE_ENV` environment variable:
```bash
# Development
NODE_ENV=development npm run dev

# Production
NODE_ENV=production npm start
```

### Frontend
Vite automatically detects mode based on command:
```bash
# Development (sets MODE=development)
npm run dev

# Production (sets MODE=production)
npm run build
```

## Best Practices

1. **Always use the config files** - Don't directly check `process.env.NODE_ENV` or `import.meta.env.MODE`
2. **Conditional logging** - Use `isDevelopment` to wrap console.log statements
3. **Error handling** - Show detailed errors only in development
4. **Security** - Never expose sensitive information in production mode
5. **Testing** - Test both development and production modes before deployment

