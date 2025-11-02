# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for an Inventory Management System (i-ims) with a React frontend and Express backend. The project includes a complete JWT-based authentication and authorization system with role-based access control (RBAC).

## Repository Structure

- **`frontend/`** - React + TypeScript + Vite application
- **`backend/`** - Express + TypeScript server

## Development Commands

### Frontend (from `frontend/` directory)

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript check + production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

### Backend (from `backend/` directory)

```bash
npm run dev        # Start development server with hot reload (tsx watch)
npm run build      # Compile TypeScript to dist/
npm start          # Run compiled production server
```

## Architecture

### Frontend Architecture

**Routing**: Uses React Router DOM with protected routes defined in `App.tsx`:
- `/login` - Public login page
- `/register` - Public registration page
- `/` - Dashboard (protected)
- `/dashboard` - Dashboard (protected)
- `/reports` - Reports (protected)
- `/alerts` - Alerts (protected)
- `/orders` - Orders (protected)
- `/inventory` - Inventory management (requires `inventory:read` permission)
- `/barcode-scanner` - Barcode scanner (requires `inventory:read` permission)
- `/roles` - Roles management (requires `role:manage` permission)
- `/users` - User management (requires `user:read` permission)
- `/settings` - Settings (protected)

**Layout System**: Three-part layout structure:
- `Layout.tsx` - Main layout wrapper combining Sidebar + Header + content
- `Sidebar.tsx` - Navigation sidebar
- `Header.tsx` - Top header bar with user profile, logout, and breadcrumbs

**Authentication System**:
- `AuthContext.tsx` - Global authentication state management
  - Manages user authentication state
  - Provides login/logout functions
  - Permission checking (`hasPermission`)
  - Role checking (`hasRole`)
  - Automatic user session persistence
- `authService.ts` - Authentication API service
  - User registration and login
  - Token management (access & refresh)
  - Automatic token refresh
  - Password change functionality
- `apiClient.ts` - Authenticated HTTP client
  - Automatically adds JWT tokens to requests
  - Handles token refresh on 401 errors
  - Redirects to login on auth failure

**Route Protection**:
- `ProtectedRoute.tsx` - Higher-order component for route guards
  - Checks authentication status
  - Validates required permissions
  - Validates required roles
  - Shows loading state during auth check
  - Displays 403 error for insufficient permissions

**Theme System**: Custom theme implementation using CSS variables and Tailwind:
- `ThemeContext.tsx` - Context provider managing light/dark theme state
- Persists theme to localStorage and respects system preferences
- Applies 'dark' class to document root for Tailwind dark mode

**Styling**:
- Tailwind CSS with custom color palette defined via CSS variables
- Custom colors: `text`, `background`, `primary`, `secondary`, `accent` (each with 50-950 shades)
- CSS variables allow dynamic theming without recompiling Tailwind
- Font: Plus Jakarta Sans

### Backend Architecture

**Server**: Express server on port 3001 with MongoDB integration
- CORS enabled for frontend communication
- MongoDB connection using Mongoose
- TypeScript compiled to `dist/` directory
- Environment variables managed via dotenv

**Database**: MongoDB (Atlas)
- User collection with authentication data
- Inventory collection
- Connection URI stored in `.env`

**Authentication System**:
- **JWT-based authentication** with dual-token strategy:
  - Access tokens: 15-minute expiry (for API requests)
  - Refresh tokens: 7-day expiry (for obtaining new access tokens)
- **Password security**: bcrypt hashing with 10 salt rounds
- **Token storage**: Refresh tokens stored in database for validation
- **Token invalidation**: Logout clears refresh token from database

**Authorization System (RBAC)**:
- **Three user roles**:
  - `admin`: Full access to all resources
  - `manager`: User read + full inventory access
  - `staff`: Limited inventory access (read, create, update)

- **Permission-based access control**:
  - Permissions mapped to roles in `userModel.ts`
  - Middleware validates permissions on protected routes
  - Fine-grained control over API endpoints

**API Structure**:

*Authentication Routes* (`/api/auth`):
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout and invalidate refresh token
- `GET /me` - Get current user profile (protected)
- `PUT /change-password` - Change password (protected)

*User Management Routes* (`/api/users`):
- `GET /` - Get all users with pagination (requires `user:read`)
- `GET /:id` - Get user by ID (requires `user:read`)
- `PUT /:id` - Update user (requires `user:update`)
- `DELETE /:id` - Delete user (requires `user:delete`)
- `PATCH /:id/deactivate` - Deactivate user (requires `admin` role)
- `PATCH /:id/activate` - Activate user (requires `admin` role)

*Inventory Routes* (`/api/inventory`):
- All routes require authentication
- GET routes require `inventory:read` permission
- POST routes require `inventory:create` permission
- PUT routes require `inventory:update` permission
- DELETE routes require `inventory:delete` permission

**Middleware**:
- `authenticate` - Verifies JWT access token and attaches user to request
- `requireRole(...roles)` - Ensures user has one of the specified roles
- `requirePermission(...permissions)` - Ensures user has required permissions
- `optionalAuth` - Attaches user if valid token exists, but doesn't block request

**Models**:
- `User` - User model with password hashing, role, permissions, and refresh token
- `Inventory` - Inventory item model

**Security Features**:
- Password validation (minimum 6 characters)
- Email validation and uniqueness
- Active/inactive user status
- Protection against self-deletion/deactivation
- Secure token verification
- Environment-based JWT secrets

## Key Patterns

### Custom Color System

Colors are defined as CSS variables (in `index.css`) and referenced in Tailwind config. Use like: `className="bg-background-100 text-text-900"`. This allows theme changes without Tailwind recompilation.

### Authentication Flow

1. **User Registration/Login**:
   - User submits credentials to `/api/auth/register` or `/api/auth/login`
   - Backend validates credentials and returns access token + refresh token
   - Frontend stores both tokens in localStorage via `authService`
   - User data stored in `AuthContext` for global access

2. **Making Authenticated Requests**:
   - Frontend uses `apiClient` utility for all API calls
   - Access token automatically included in Authorization header
   - If token expired (401), `apiClient` automatically refreshes using refresh token
   - New tokens stored and request retried

3. **Token Refresh**:
   - Access tokens expire after 15 minutes
   - Before failing, `apiClient` sends refresh token to `/api/auth/refresh`
   - New access and refresh tokens returned and stored
   - Original request retried with new access token
   - If refresh fails, user redirected to login

4. **Logout**:
   - Frontend calls `authService.logout()`
   - Refresh token sent to `/api/auth/logout` to invalidate
   - Tokens cleared from localStorage
   - User state cleared from `AuthContext`
   - User redirected to login page

### API Service Pattern

All API calls should use the `api` utility from `apiClient.ts`:

```typescript
// GET request
const response = await api.get('/inventory');

// POST request
const response = await api.post('/inventory', itemData);

// PUT request
const response = await api.put('/inventory/123', updatedData);

// DELETE request
const response = await api.delete('/inventory/123');

// Public endpoint (no auth)
const response = await api.get('/public', { requiresAuth: false });
```

### Environment Variables
**Backend** (`.env`):
```env
MONGO_URI=mongodb+srv://...
PORT=3001
ACCESS_TOKEN_SECRET=dev-access-token-secret-key-123
REFRESH_TOKEN_SECRET=dev-refresh-token-secret-key-456
```
### TypeScript Configuration

- Frontend uses project references (tsconfig.app.json, tsconfig.node.json)
- Backend uses NodeNext module resolution with ES modules (`"type": "module"`)
- Both configured with strict mode enabled
- Frontend uses `type` imports for better tree-shaking with `verbatimModuleSyntax`

## Important Files

### Backend
- `src/models/userModel.ts` - User schema with roles, permissions, password hashing
- `src/utils/jwtUtils.ts` - JWT token generation and verification
- `src/middleware/authMiddleware.ts` - Authentication and authorization middleware
- `src/controllers/authController.ts` - Authentication business logic
- `src/controllers/userController.ts` - User management business logic
- `src/routes/authRoutes.ts` - Authentication endpoints
- `src/routes/userRoutes.ts` - User management endpoints
- `src/routes/inventoryRoutes.ts` - Protected inventory endpoints
- `AUTH_API.md` - Complete API documentation

### Frontend
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/services/authService.ts` - Authentication API calls
- `src/utils/apiClient.ts` - Authenticated HTTP client with auto-refresh
- `src/components/ProtectedRoute.tsx` - Route guard component
- `src/pages/Login.tsx` - Login page with ShaderBackground
- `src/pages/Register.tsx` - Registration page with ShaderBackground
- `src/layout/Header.tsx` - Header with user profile and logout

## Testing the Authentication System

1. Start both servers (backend and frontend)
2. Navigate to `/register` to create an account
3. Default role is `staff` - you can manually change in database for testing admin/manager
4. Login with credentials
5. Access protected routes based on your role
6. Test permission-based access by trying different operations

For detailed API examples, see `backend/AUTH_API.md`
