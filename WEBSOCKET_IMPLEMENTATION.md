# WebSocket Implementation for Real-Time Dashboard Updates

## Overview

The Portfolio Admin Panel now uses WebSocket (Socket.io) to automatically update dashboard counts in real-time without requiring page refreshes. When data is created, updated, or deleted in the backend, all connected clients receive instant updates.

## Architecture

### Backend (Portfolio-Cms-backend)

1. **Socket.io Server Setup** (`src/utils/socket.js`)
   - Initializes Socket.io server with CORS configuration
   - Handles client connections and disconnections
   - Provides utility functions to emit count updates

2. **Server Integration** (`server.js`)
   - Creates HTTP server from Express app
   - Initializes Socket.io on the HTTP server
   - Listens on the same port as the REST API

3. **Event Emission**
   - `crudFactory.js`: Emits count updates after create, update, and delete operations
   - `projectController.js`: Emits count updates when projects are created
   - `blogController.js`: Emits count updates when blogs are created
   - All CRUD operations automatically emit `count-update` events

### Frontend (Portfolio-Admin)

1. **Socket Context** (`src/context/SocketContext.jsx`)
   - Manages Socket.io client connection
   - Provides `useSocket` hook for components
   - Handles connection status and reconnection logic

2. **Dashboard Integration** (`src/pages/Dashboard.jsx`)
   - Listens to `count-update` events from the server
   - Automatically updates stat cards when counts change
   - Shows connection status indicator

## How It Works

### Event Flow

1. **User Action**: Admin creates/updates/deletes a project, blog, skill, or testimonial
2. **Backend Processing**: Controller processes the request and saves to database
3. **Count Calculation**: Backend calculates new count using `Model.countDocuments()`
4. **Event Emission**: Backend emits `count-update` event with model name and count
5. **Client Reception**: All connected clients receive the event
6. **UI Update**: Dashboard automatically updates the corresponding stat card

### Event Structure

```javascript
// Backend emits:
{
  model: "project", // or "blog", "skill", "testimonial"
  count: 15
}

// Frontend receives and updates the matching stat card
```

## Features

### Real-Time Updates
- ✅ Automatic count updates when data changes
- ✅ No page refresh required
- ✅ Works across multiple browser tabs/windows
- ✅ Connection status indicator

### Connection Management
- ✅ Automatic reconnection on disconnect
- ✅ Connection status shown in UI
- ✅ Graceful error handling

### Supported Models
- Projects (`project`)
- Blog Posts (`blog`)
- Skills (`skill`)
- Testimonials (`testimonial`)

## Usage

### Starting the Backend

```bash
cd Portfolio-Cms-backend/backend
npm run dev
```

The Socket.io server will start automatically on the same port as the REST API (default: 5000).

### Starting the Frontend

```bash
cd Portfolio-Admin/admin-panel
npm run dev
```

The Socket.io client will automatically connect to the backend.

### Testing Real-Time Updates

1. Open the Dashboard in your browser
2. Open another browser tab/window with the same Dashboard
3. Create, update, or delete a project, blog, skill, or testimonial
4. Watch both tabs update automatically without refresh

## Configuration

### Backend CORS

Socket.io CORS is configured in `src/utils/socket.js` to allow:
- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Alternative Vite port)
- `http://localhost:3001` (Legacy)
- Environment variable origins (`ADMIN_PANEL_URL`, `FRONTEND_URL`)

### Frontend Connection

The Socket.io client connects to the API base URL:
- Default: `http://localhost:5000`
- Configurable via `VITE_API_BASE_URL` environment variable

## Troubleshooting

### Connection Issues

1. **Socket not connecting**
   - Check that backend is running
   - Verify CORS configuration includes your frontend URL
   - Check browser console for connection errors

2. **Updates not appearing**
   - Verify Socket.io is installed on both backend and frontend
   - Check browser console for socket events
   - Ensure you're authenticated (socket connects after login)

3. **Counts not updating**
   - Verify the model name mapping in `socket.js`
   - Check backend console for emitted events
   - Ensure CRUD operations are calling `emitCountUpdate`

## Future Enhancements

Potential improvements:
- Add real-time updates for other models (Experience, Services)
- Implement optimistic UI updates
- Add notification system for data changes
- Support for real-time collaboration features

