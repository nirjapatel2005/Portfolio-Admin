# Portfolio Admin Panel - Backend Connection Guide

This guide explains how the Portfolio Admin Panel is connected to the Portfolio CMS Backend.

## Overview

The admin panel is now fully connected to the backend API. All authentication and CRUD operations are handled through API calls.

## Configuration

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Portfolio-Cms-backend/backend
   ```

2. Make sure your `.env` file is configured with:
   - `PORT` (default: 5000)
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (for media uploads)

3. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Admin Panel Setup

1. Navigate to the admin panel directory:
   ```bash
   cd Portfolio-Admin/admin-panel
   ```

2. (Optional) Create a `.env` file to configure the API URL:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```
   
   If not set, it defaults to `http://localhost:5000`

3. Install dependencies (if not already done):
   ```bash
   npm install
   ```

4. Start the admin panel:
   ```bash
   npm run dev
   ```

   The admin panel will run on `http://localhost:5173` (Vite default)

## API Services

All API services are located in `src/services/`:

- **api.js** - Axios instance with authentication headers
- **authServices.js** - Authentication (login, getCurrentUser)
- **projectService.js** - Project CRUD operations
- **skillService.js** - Skill CRUD operations
- **blogService.js** - Blog CRUD operations
- **experienceService.js** - Experience CRUD operations
- **testimonialService.js** - Testimonial CRUD operations
- **serviceService.js** - Service CRUD operations
- **aboutService.js** - About section (get/update)
- **mediaService.js** - Media file uploads

## Authentication

The authentication flow:

1. User logs in through the Login page
2. Credentials are sent to `/auth/login`
3. Backend returns a JWT token
4. Token is stored in `localStorage` as `adminToken`
5. All subsequent API requests include the token in the `Authorization` header
6. If token expires or is invalid, user is redirected to login

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Alternative Vite port)
- `http://localhost:3001` (Legacy)
- Any origin in development mode

## Usage Example

```javascript
import { projectService } from '../services';

// Get all projects
const projects = await projectService.getAll();

// Create a project
const newProject = await projectService.create({
  title: "My Project",
  description: "Project description",
  // ... other fields
});

// Update a project
await projectService.update(projectId, updatedData);

// Delete a project
await projectService.delete(projectId);
```

## Testing the Connection

1. Start both backend and admin panel
2. Navigate to the login page
3. Use admin credentials (create admin user using the seed script if needed)
4. After login, you should be able to access all dashboard features

## Troubleshooting

### CORS Errors
- Make sure the backend CORS configuration includes your admin panel URL
- Check that both servers are running

### Authentication Errors
- Verify the JWT_SECRET is set in backend `.env`
- Check that the token is being stored in localStorage
- Clear localStorage and try logging in again

### API Connection Errors
- Verify the backend is running on the correct port
- Check the `VITE_API_BASE_URL` in admin panel `.env`
- Check browser console for detailed error messages



