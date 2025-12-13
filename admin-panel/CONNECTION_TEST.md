# Frontend-Backend Connection Test Guide

## Connection Status Check

### ✅ Configuration Summary

**Frontend (Admin Panel):**
- Base URL: `http://localhost:5000` (default) or from `VITE_API_BASE_URL`
- Port: Usually `5173` (Vite default)
- API Instance: `src/services/api.js`

**Backend (CMS Backend):**
- Base URL: `http://localhost:5000` (default) or from `PORT` env var
- CORS: Configured to allow `localhost:5173`, `localhost:5174`, `localhost:3001`

### ✅ Route Mapping Verification

| Frontend Endpoint | Backend Route | Status |
|------------------|---------------|--------|
| `POST /auth/login` | `POST /auth/login` | ✅ Match |
| `GET /admin/me` | `GET /admin/me` | ✅ Match |
| `GET /api/projects` | `GET /api/projects` | ✅ Match |
| `GET /api/blogs` | `GET /api/blogs` | ✅ Match |
| `GET /api/skills` | `GET /api/skills` | ✅ Match |
| `GET /api/experience` | `GET /api/experience` | ✅ Match |
| `GET /api/testimonials` | `GET /api/testimonials` | ✅ Match |
| `GET /api/services` | `GET /api/services` | ✅ Match |
| `GET /api/about` | `GET /api/about` | ✅ Match |
| `POST /api/upload` | `POST /api/upload` | ✅ Match |

### 🔍 Connection Test Steps

1. **Check Backend is Running:**
   ```bash
   # In backend directory
   cd Portfolio-Cms-backend/backend
   npm run dev
   # Should see: "Server running at http://localhost:5000"
   # Should see: "MongoDB Connected"
   ```

2. **Check Frontend is Running:**
   ```bash
   # In admin panel directory
   cd Portfolio-Admin/admin-panel
   npm run dev
   # Should see: "Local: http://localhost:5173"
   ```

3. **Test Backend Health:**
   Open browser: `http://localhost:5000`
   Expected: "Portfolio CMS Backend Running..."

4. **Test CORS Connection:**
   Open browser console on admin panel (F12)
   Run this in console:
   ```javascript
   fetch('http://localhost:5000/')
     .then(r => r.text())
     .then(console.log)
     .catch(console.error)
   ```
   Expected: "Portfolio CMS Backend Running..."

5. **Test Login Endpoint:**
   In browser console:
   ```javascript
   fetch('http://localhost:5000/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'test@test.com', password: 'test' })
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error)
   ```
   Expected: Either success with token or error message

### ⚠️ Common Issues

1. **CORS Errors:**
   - Check backend CORS allows your frontend port
   - Backend allows: `localhost:5173`, `localhost:5174`, `localhost:3001`
   - If using different port, add it to `allowedOrigins` in `backend/src/app.js`

2. **Connection Refused:**
   - Backend not running
   - Wrong port (check `PORT` env var or default 5000)
   - Firewall blocking connection

3. **404 Not Found:**
   - Route mismatch between frontend and backend
   - Check route paths match exactly

4. **401 Unauthorized:**
   - Token expired (clear localStorage: `localStorage.removeItem('adminToken')`)
   - Invalid credentials
   - JWT_SECRET not set in backend `.env`

### 🔧 Quick Fixes

**Clear Expired Token:**
```javascript
// In browser console
localStorage.removeItem('adminToken')
location.reload()
```

**Check API Base URL:**
```javascript
// In browser console
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000')
```

**Test API Connection:**
```javascript
// In browser console
import('./src/services/api.js').then(api => {
  api.default.get('/').then(r => console.log('✅ Connected:', r.data))
    .catch(e => console.error('❌ Connection failed:', e))
})
```

### 📝 Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (.env - optional):**
```
VITE_API_BASE_URL=http://localhost:5000
```

