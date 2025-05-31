# 🎨 LevelList Modern Theme System

## Overview

LevelList features a modern, semantic theme system with professional palettes and intelligent auto-switching.

## 🌅 Available Palettes

### Dawn Light (Light Mode)
- **Primary Background**: `#FAFAFA` (clean light gray)
- **Secondary Background**: `#FFFFFF` (pure white)
- **Tertiary Background**: `#F3F4F6` (subtle gray)
- **Primary Text**: `#1A1A1A` (soft black)
- **Secondary Text**: `#6B7280` (medium gray)
- **Primary Accent**: `#3B82F6` (modern blue)
- **Secondary Accent**: `#F59E0B` (warm amber)

### Midnight Pro (Dark Mode)
- **Primary Background**: `#111827` (deep dark)
- **Secondary Background**: `#1F2937` (dark gray)
- **Tertiary Background**: `#374151` (medium dark)
- **Primary Text**: `#F9FAFB` (off-white)
- **Secondary Text**: `#9CA3AF` (light gray)
- **Primary Accent**: `#60A5FA` (bright blue)
- **Secondary Accent**: `#FBBF24` (bright amber)

## 🔧 Theme Modes

### 1. **Dawn Light** (`light`)
Clean and modern light theme with professional aesthetics.

### 2. **Midnight Pro** (`dark`)
Professional dark theme optimized for extended use.

### 3. **System** (`system`)
Automatically follows user's system preferences.

### 4. **Smart Auto** (`auto`)
Automatically switches based on time:
- **6AM-8AM**: Gradual transition to light mode
- **8AM-6PM**: Light mode (Dawn Light)
- **6PM-8PM**: Gradual transition to dark mode
- **8PM-6AM**: Dark mode (Midnight Pro)

## 🎯 Using the Modern Theme System

### Tailwind CSS Classes
The application uses standard Tailwind CSS classes for theming:

```css
/* Backgrounds */
bg-white dark:bg-gray-900        /* Main background */
bg-white dark:bg-gray-800        /* Card/surface background */
bg-gray-50 dark:bg-gray-800      /* Elevated surface background */

/* Text */
text-gray-900 dark:text-white    /* Primary text */
text-gray-600 dark:text-gray-300 /* Secondary text */
text-gray-500 dark:text-gray-400 /* Muted text */

/* Accents */
text-blue-600 dark:text-blue-400 /* Primary accent */
bg-blue-600 dark:bg-blue-500     /* Primary accent background */

/* Borders */
border-gray-200 dark:border-gray-700 /* Primary borders */
border-gray-300 dark:border-gray-600 /* Secondary borders */
```

### React Hook Usage
```typescript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { 
    theme,              // 'light' | 'dark' | 'system' | 'auto'
    resolvedTheme,      // 'light' | 'dark' (effective theme)
    updateTheme,        // Function to change theme
    isLoaded,           // Boolean - theme loaded
    isTransitioning,    // Boolean - transition in progress
    isInTransitionPeriod, // Boolean - auto transition period
    nextTransition      // Next transition (auto mode)
  } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-900 p-6">
      <h1 className="text-gray-900 dark:text-white">Current theme: {resolvedTheme}</h1>
      <p className="text-gray-600 dark:text-gray-300">Professional theme system</p>
    </div>
  );
}
```

## 🎨 Standard CSS Classes

### Backgrounds
- `bg-white dark:bg-gray-900` - Main page background
- `bg-white dark:bg-gray-800` - Card/component background
- `bg-gray-50 dark:bg-gray-800` - Elevated surface background

### Text
- `text-gray-900 dark:text-white` - Primary text color
- `text-gray-600 dark:text-gray-300` - Secondary text color
- `text-gray-500 dark:text-gray-400` - Muted text color

### Components
- Standard Tailwind component classes with dark mode variants
- Consistent hover and focus states
- Smooth transitions between themes

### Status Colors
- `bg-green-100 dark:bg-green-900/30` - Success state
- `bg-yellow-100 dark:bg-yellow-900/30` - Warning state
- `bg-red-100 dark:bg-red-900/30` - Error state
- `bg-blue-100 dark:bg-blue-900/30` - Info state

### Borders & Shadows
- `border-gray-200 dark:border-gray-700` - Primary borders
- `border-gray-300 dark:border-gray-600` - Secondary borders
- `shadow-sm` - Small shadow
- `shadow-md` - Medium shadow
- `shadow-lg` - Large shadow

## 🌟 Usage Examples

### Modern Card Component
```jsx
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
  <h3 className="text-gray-900 dark:text-white font-bold mb-2">Card Title</h3>
  <p className="text-gray-600 dark:text-gray-300 mb-4">Card description with proper contrast</p>
  <button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
    Primary Action
  </button>
</div>
```

### Status Badge
```jsx
<span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
  Completed
</span>
```

### Form Input
```jsx
<input 
  type="text" 
  placeholder="Enter text..."
  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
/>
```

## ♿ Accessibility

The modern theme system ensures:
- **WCAG AA compliance** with proper contrast ratios
- **System preference respect** for `prefers-color-scheme`
- **Motion sensitivity** support via `prefers-reduced-motion`
- **High contrast mode** support via `prefers-contrast`
- **Keyboard navigation** with visible focus indicators

## 🚀 Key Improvements

### Professional Design
- **Modern color palettes** using standard Tailwind colors
- **Consistent spacing** and typography scale
- **Subtle shadows** and smooth transitions
- **Clean aesthetics** optimized for readability

### Developer Experience
- **Standard Tailwind classes** - no custom CSS variables needed
- **Consistent patterns** across all components
- **Easy maintenance** with standard color system
- **TypeScript support** for theme values

## 🔧 Customization

### Adding Custom Colors
```css
/* Use Tailwind's extend feature in tailwind.config.ts */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Custom Component Styling
```jsx
<div className="bg-brand-50 dark:bg-brand-900 text-brand-900 dark:text-brand-50">
  Custom branded component
</div>
```

---

Last updated: January 2025
