# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for an Inventory Management System (i-ims) with a React frontend and Express backend. The project is in early development with basic boilerplate code and a custom color palette system.

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

**Routing**: Uses React Router DOM with routes defined in `App.tsx`:
- `/` - Dashboard
- `/roles` - Roles management
- `/inventory` - Inventory management
- `/users` - User management
- `/settings` - Settings

**Layout System**: Three-part layout structure:
- `Layout.tsx` - Main layout wrapper combining Sidebar + Header + content
- `Sidebar.tsx` - Navigation sidebar
- `Header.tsx` - Top header bar

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

**Server**: Basic Express server on port 3001
- CORS enabled for frontend communication
- Single test endpoint: `GET /api/message`
- TypeScript compiled to `dist/` directory

## Key Patterns

### Custom Color System

Colors are defined as CSS variables (in `index.css`) and referenced in Tailwind config. Use like: `className="bg-background-100 text-text-900"`. This allows theme changes without Tailwind recompilation.

### TypeScript Configuration

- Frontend uses project references (tsconfig.app.json, tsconfig.node.json)
- Backend uses NodeNext module resolution with ES modules (`"type": "module"`)
- Both configured with strict mode enabled
