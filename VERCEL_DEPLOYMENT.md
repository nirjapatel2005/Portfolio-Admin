# Vercel Deployment Guide for Portfolio Admin Panel

## Quick Fix - Configure Vercel Settings

### Option 1: Using vercel.json (Recommended - Already Created)

The `vercel.json` file is already configured. Just make sure:

1. **Root Directory**: Leave empty (defaults to repo root)
2. Vercel will automatically use the `vercel.json` configuration

### Option 2: Manual Vercel Dashboard Configuration

If you prefer to configure in the dashboard:

1. Go to your Vercel project settings
2. Under "Build & Development Settings":
   - **Root Directory**: Set to `admin-panel`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Framework Preset**: Vite

### Option 3: Using Root package.json

The root `package.json` is configured to handle the build:

1. **Root Directory**: Leave empty (repo root)
2. **Build Command**: `npm run build`
3. **Output Directory**: `admin-panel/dist`

## Environment Variables Required:

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_BASE_URL=your_backend_api_url
VITE_SOCKET_URL=your_socket_url (usually same as API URL)
```

## Important Notes:

- The admin panel is a **Single Page Application (SPA)**, so all routes should redirect to `index.html`
- The `vercel.json` already includes the rewrite rule for this
- Make sure your backend API URL is set correctly in environment variables
- The build output will be in `admin-panel/dist/`

## Troubleshooting:

- If build fails, check that all environment variables are set
- Ensure Node.js version is 18+ (Vercel uses this by default)
- Check Vercel build logs for specific errors
- Make sure the `admin-panel/` directory structure is correct

