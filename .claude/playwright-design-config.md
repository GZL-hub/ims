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
3. Take baseline screenshots of all routes (/, /roles, /inventory, /users, /settings)
4. Toggle to dark theme
5. Take dark mode screenshots for comparison
6. Test responsive layouts at different viewports
7. Verify interactive elements (buttons, navigation, forms)

## Key Pages to Test

- `/` - Dashboard
- `/roles` - Roles management
- `/inventory` - Inventory management
- `/users` - User management
- `/settings` - Settings

## Design System Elements

Focus on these UI components when testing:
- Navigation links and active states
- Button styles and hover effects
- Form inputs and validation states
- Card components and shadows
- Modal dialogs (if implemented)
- Loading states and animations
