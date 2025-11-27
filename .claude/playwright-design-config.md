# Playwright MCP Configuration for IMS Design Testing

## Overview
This configuration enables Claude Code to use Playwright for automated design testing and visual validation of the Inventory Management System.

## Focus Areas for Design Testing

### 1. Theme System Testing
- **Light/Dark Theme Toggle**: Verify theme switching works across all pages
- **Color Consistency**: Validate custom color palette (text, background, primary, secondary, accent)
- **CSS Variables**: Ensure all 50-950 shades render correctly in both themes

### 2. Layout Components
- **Sidebar Navigation**: Test responsive behavior and active states
- **Header Component**: Verify consistent positioning and styling
- **Layout Wrapper**: Ensure proper three-part layout rendering

### 3. Responsive Design
- **Breakpoints**: Test desktop viewports
- **Component Adaptation**: Check component reflow at different screen sizes

### 4. Typography & Fonts
- **Plus Jakarta Sans**: Verify font loading and rendering
- **Text Hierarchy**: Check heading sizes and weights
- **Readability**: Test text contrast ratios for accessibility

### 5. Custom Color Palette Validation
Test all custom Tailwind colors in both light and dark modes:
- `text-*` (50-950)
- `background-*` (50-950)
- `primary-*` (50-950)
- `secondary-*` (50-950)
- `accent-*` (50-950)

### 6. Image Upload & Display Features
- **File Upload UI**: Test drag-and-drop and click-to-upload areas
- **Image Preview**: Verify thumbnail generation and display
- **Image Zoom Modal**: Test click-to-zoom functionality with React Portal
- **Inventory Table Images**: Validate 48x48px thumbnails with hover effects
- **Modal Image Display**: Check full-size image rendering in modals

## Recommended Playwright Commands

### Navigate to Frontend
```
Navigate to http://localhost:5173
```

### Take Design Screenshots
```
Take screenshot of entire page
Take screenshot of sidebar component
Take screenshot in dark mode
```

### Test Theme Toggle
```
Click theme toggle button
Wait for theme transition
Take screenshot after theme change
```

### Test Responsive Layouts
```
Set viewport to 1920x1080 (desktop)
```

### Accessibility Checks
```
Get accessibility tree
Check color contrast ratios
Verify ARIA labels
```

## Usage Notes

1. **Start Development Server First**: Run `npm run dev` in the `frontend/` directory before testing
2. **Default URL**: Frontend runs on `http://localhost:5173`
3. **Backend URL**: Backend runs on `http://localhost:3001` (if needed for API testing)

## Example Design Test Workflow

1. Start the frontend dev server
2. Navigate to the application using Playwright MCP
3. Take baseline screenshots of all routes (/, /inventory, /alerts, /users, /settings)
4. Toggle to dark theme
5. Take dark mode screenshots for comparison
6. Test responsive layouts at different viewports
7. Verify interactive elements (buttons, navigation, forms)

## Image Upload Feature Test Workflow

1. Navigate to `/inventory` page
2. Click "Add Item" button to open modal
3. Test image upload area:
   - Verify upload UI styling (dashed border, upload icon)
   - Take screenshot of empty upload state
4. Click file upload area (simulate file selection)
5. Verify image preview appears with remove button
6. Take screenshot of image preview state
7. Submit form and verify item creation
8. In inventory table:
   - Verify 48x48px thumbnail appears
   - Hover over image to see ring effect
   - Take screenshot of thumbnail
9. Click thumbnail to open zoom modal
10. Verify fullscreen image display with:
    - Dark overlay (75% opacity)
    - Close button in top right
    - Item name at top
    - "Click outside or press ESC" helper text
11. Take screenshot of zoom modal
12. Test closing: click outside, press ESC, click X button
13. Test Edit functionality with image replacement
14. Verify old image is replaced in both preview and table

## Key Pages to Test

- `/` - Dashboard
- `/inventory` - Inventory management with image upload/zoom features
- `/barcode-scanner` - Barcode scanner with image display
- `/users` - User management
- `/alerts` - Stock and expiry alerts
- `/orders` - Orders management
- `/reports` - Reports
- `/settings` - Settings

## Design System Elements

Focus on these UI components when testing:
- Navigation links and active states
- Button styles (including dark mode: white background, black text)
- Form inputs and validation states
- Card components and shadows
- Modal dialogs (Add/Edit/Delete Item, Image Zoom)
- Image upload areas with drag-and-drop styling
- Image thumbnails with hover ring effects
- Fullscreen image zoom overlay (75% opacity, ESC to close)
- Loading states and animations
- React Portal modals (proper z-index and positioning)
