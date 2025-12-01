# i-ims Project Documentation

Updated: 2025-12-01

This document provides an up-to-date overview of the i-ims (Inventory Management System) monorepo, including architecture, runtime setup, API surface, data shapes, security notes, developer guidance, and recommended next steps.

## Table of contents
- Overview
- Repository layout
- Backend
  - Tech stack
  - Entry point
  - Environment variables
  - Models (data shapes)
  - Authentication & authorization
  - Routes / API endpoints
  - File uploads
  - Useful backend files
- Frontend
  - Tech stack
  - Entry point
  - App structure and pages
  - Services and API client
  - Key components
- Developer workflows
  - Running locally (Windows PowerShell)
  - Building for production
- Security & operational notes
- Observations, issues, and recommended improvements
- Quick checklist for new contributors


## Overview

i-ims is a full-stack inventory management system with:
- Backend: Express + TypeScript + Mongoose (MongoDB) — provides REST APIs, JWT authentication, RBAC, and file uploads.
- Frontend: React + Vite + TypeScript — dashboards, inventory management, order processing, user management, and a barcode scanner UI.


## Repository layout

Root
- `backend/` - Express server written in TypeScript
  - `src/`
    - `server.ts` (app entry)
    - `controllers/` (business logic)
      - `authController.ts`
      - `customerController.ts`
      - `inventoryController.ts`
      - `orderController.ts`
      - `userController.ts`
    - `middleware/` (request middleware)
      - `authMiddleware.ts`
      - `uploadMiddleware.ts`
    - `models/` (Mongoose schemas)
      - `customerModel.ts`
      - `inventoryModel.ts`
      - `orderModel.ts`
      - `userModel.ts`
    - `routes/` (Express route wiring)
      - `authRoutes.ts`
      - `customerRoutes.ts`
      - `inventoryRoutes.ts`
      - `orderRoutes.ts`
      - `userRoutes.ts`
    - `utils/`
      - `jwtUtils.ts`
  - `uploads/` (static files served at `/uploads`)
    - `items/`
  - `package.json`, `tsconfig.json`, `.env`

- `frontend/` - React + Vite application
  - `src/`
    - `main.tsx` (app bootstrap)
    - `App.tsx` (routes and providers)
    - `index.css` (global styles + Tailwind variables)
    - `components/` (UI components)
      - `orders/`
        - `OrderTable.tsx`
        - `AddOrderModal.tsx`
        - `EditOrderModal.tsx`
        - `OrderDetailsModal.tsx`
        - `OrderSearchAndFilter.tsx`
      - `inventory/`
        - `InventoryTable.tsx`
        - `AddItemModal.tsx`
        - `EditItemModal.tsx`
        - `SearchAndFilter.tsx`
      - `crm/` (customer-related components)
      - `dashboard/` (charts and small widgets)
      - `layout/` (Header, Sidebar, Layout)
      - `ProtectedRoute.tsx`
      - `common/` (e.g., `ConfirmDialog.tsx`)
    - `pages/`
      - `Orders.tsx`, `Inventory.tsx`, `Dashboard.tsx`, `Login.tsx`, `Register.tsx`, `Users.tsx`, `Roles.tsx`, `Reports.tsx`, `Alerts.tsx`
    - `services/` (API wrappers)
      - `authService.ts`
      - `orderService.ts`
      - `inventoryService.ts`
      - `customerService.ts`
    - `utils/`
      - `apiClient.ts` (centralized HTTP client)
    - `contexts/`
      - `AuthContext.tsx`
      - `ThemeContext.tsx`
  - `public/`, `index.html`, `package.json`, `vite.config.ts`, `tailwind.config.js`, etc.


## Backend

Location: `backend/`

Tech stack
- Node.js (ES Modules)
- TypeScript
- Express
- Mongoose (MongoDB)
- Multer for file uploads
- jsonwebtoken, bcrypt

Entry point
- `src/server.ts` — sets up Express app, mounts routes, connects to MongoDB, serves uploads

Environment variables
- `MONGO_URI` — MongoDB connection string
- `PORT` — server port (default 3001)
- `ACCESS_TOKEN_SECRET` — JWT access token secret
- `REFRESH_TOKEN_SECRET` — JWT refresh token secret

If secrets are not set, defaults exist in code (development). For production, set strong secrets in `.env`.

Models (data shapes)
- User (`src/models/userModel.ts`)
  - id, email, password (hashed), firstName, lastName, role (admin|manager|staff), isActive, refreshToken, timestamps
  - permissions are derived from role (RolePermissions mapping)

- Inventory (`src/models/inventoryModel.ts`)
  - item_name, category, quantity, expiry_date?, threshold, barcode, image? (file path), status, date_added, last_updated
  - Pre-save and pre-findOneAndUpdate hooks calculate status (Expired, Out of Stock, Low Stock, In Stock)

- Order (`src/models/orderModel.ts`)
  - customer_name, email, phone?, items: [{ inventoryId (ref), item_name, quantity }], status (Pending|Completed|Cancelled), date_created, last_updated

Authentication & Authorization
- JWT-based dual-token approach
  - Access tokens: short-lived (15 minutes)
  - Refresh tokens: long-lived (7 days)
- `src/utils/jwtUtils.ts` — generate/verify tokens
- `src/middleware/authMiddleware.ts` — `authenticate`, `requireRole`, `requirePermission`, `optionalAuth`
- Refresh tokens are stored on the User record and compared on refresh/logout

Routes / API endpoints (high-level)
- `POST /api/auth/register` — register a user
- `POST /api/auth/login` — login
- `POST /api/auth/refresh` — refresh tokens
- `POST /api/auth/logout` — logout
- `GET /api/auth/me` — current user
- `PUT /api/auth/change-password` — change password

- `GET /api/inventory` — list inventory (requires `inventory:read`)
- `GET /api/inventory/search?query=...` — search items by barcode or name
- `GET /api/inventory/barcode/:barcode` — get item by barcode
- `POST /api/inventory` — create item (multipart/form-data with image) — requires `inventory:create`
- `PUT /api/inventory/:id` — update item (optional image replace) — requires `inventory:update`
- `DELETE /api/inventory/:id` — delete item and file — requires `inventory:delete`
- `GET /api/inventory/alerts` — compute alerts (expiring/low stock)

- `GET /api/orders` — list orders (requires `orders:read`)
- `GET /api/orders/:id` — get order by id
- `POST /api/orders` — create order (deducts inventory quantities) — requires `orders:create`
- `PUT /api/orders/:id` — update order status — requires `orders:update`
- `DELETE /api/orders/:id` — delete order (restores inventory quantities) — requires `orders:delete`

- `GET /api/users` and other user management endpoints (requires `user:read`, `user:update`, `user:delete`, admin role for deactivate/activate)

File uploads
- Multer stores uploads at `backend/uploads/items/`
- Files are served statically at `/uploads` route in `server.ts`
- Inventory image paths stored in DB as `uploads/items/<filename>`

Useful backend files
- `src/controllers/*` — business logic
- `src/routes/*` — route wiring and permission checks
- `src/middleware/uploadMiddleware.ts` — multer config (file types, size limits)


## Frontend

Location: `frontend/`

Tech stack
- React (v19) + TypeScript
- Vite
- Tailwind CSS
- @tanstack/react-table for tables
- axios / fetch (via `apiClient`) for HTTP
- lucide-react icons

Entry point
- `src/main.tsx` renders `App` in `index.html`

App structure and pages
- `src/App.tsx` defines routes and uses `AuthProvider` and `ThemeProvider`
- Pages: Dashboard, Orders, Inventory, Users, Roles, Reports, Alerts, BarcodeScanner, Login, Register, etc.

Services and API client
- `src/utils/apiClient.ts` — centralized client that adds Authorization header and handles refresh on 401 (used by many services)
- `src/services/authService.ts` — login/register/logout, token storage in localStorage, getCurrentUser, refreshAccessToken, changePassword
- `src/services/orderService.ts` — translates backend shape (snake_case) to frontend shape (camelCase) — helpers mapBackendOrder and map when creating/updating
- `src/services/inventoryService.ts` — handles FormData uploads, getImageUrl helper to build full URL

Key components
- `src/components/orders/OrderTable.tsx` — displays orders using react-table, supports sorting, filtering, pagination, and has a "View" button to open an order details modal (rendered via portal)
- `src/components/orders/AddOrderModal.tsx` — modal for creating orders
- `src/components/inventory/InventoryTable.tsx` — inventory table with image preview modal
- `src/contexts/AuthContext.tsx` — manages user state and exposes `hasPermission`, `hasRole`
- `src/components/ProtectedRoute.tsx` — guards routes based on auth/permissions

Folder notes
- `components/*` contains reusable UI pieces, modals, tables, and sub-features like barcode scanner
- `services/*` centralize API calls; `apiClient` should be the single source of truth for base URL and token refresh behavior


## Developer workflows

Running locally (Windows PowerShell)

From `backend/`:

```powershell
cd backend
# ensure .env exists with MONGO_URI and JWT secrets
npm install
npm run dev
```

From `frontend/`:

```powershell
cd frontend
npm install
npm run dev
```

Build for production
- Backend: `npm run build` then `npm start` (runs compiled `dist/server.js`)
- Frontend: `npm run build` (Vite) and `npm run preview` to serve locally


## Security & operational notes

- Ensure `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are set in production and are strong random values.
- Consider HTTPS in production environments.
- Refresh tokens are stored on the server per-user. This approach supports server-side invalidation but does not protect against stolen refresh tokens used from different devices.
- Consider rotating refresh tokens on use (already implemented: refresh returns a new refresh token and the server updates the stored value).
- File uploads are stored locally; for production consider S3 or another object store if horizontal scaling or durability is required.

