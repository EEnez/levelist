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
- **Primary Background**: `#0F0F0F` (deep black)
- **Secondary Background**: `#1A1A1A` (dark gray)
- **Tertiary Background**: `#262626` (medium dark)
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

### Semantic CSS Variables
```css
/* Backgrounds */
--bg-primary: Main background color
--bg-secondary: Card/surface background
--bg-tertiary: Elevated surface background
--bg-accent: Subtle accent background

/* Text */
--text-primary: Main text color
--text-secondary: Secondary text color
--text-tertiary: Muted text color
--text-inverse: Inverse text color

/* Accents */
--accent-primary: Primary accent color
--accent-primary-hover: Primary accent hover state
--accent-secondary: Secondary accent color
--accent-secondary-hover: Secondary accent hover state

/* Borders */
--border-primary: Primary border color
--border-secondary: Secondary border color
--border-accent: Accent border color
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
    <div className="bg-surface p-6">
      <h1 className="text-primary">Current theme: {resolvedTheme}</h1>
      <p className="text-secondary">Professional theme system</p>
    </div>
  );
}
```

## 🎨 Semantic CSS Classes

### Backgrounds
- `.bg-surface` - Secondary background (cards, surfaces)
- `.bg-surface-elevated` - Elevated surface background
- `.bg-accent-subtle` - Subtle accent background

### Text
- `.text-primary` - Primary text color
- `.text-secondary` - Secondary text color
- `.text-tertiary` - Muted text color
- `.text-inverse` - Inverse text color

### Components
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.card` - Card component with hover effects
- `.card-elevated` - Elevated card variant

### Status Badges
- `.badge-success` - Success state badge
- `.badge-warning` - Warning state badge
- `.badge-error` - Error state badge
- `.badge-info` - Info state badge

### Borders & Shadows
- `.border-primary` - Primary border color
- `.border-secondary` - Secondary border color
- `.shadow-sm` - Small shadow
- `.shadow-md` - Medium shadow
- `.shadow-lg` - Large shadow

## 🌟 Usage Examples

### Modern Card Component
```jsx
<div className="card p-6">
  <h3 className="text-primary font-bold mb-2">Card Title</h3>
  <p className="text-secondary mb-4">Card description with proper contrast</p>
  <button className="btn-primary">
    Primary Action
  </button>
</div>
```

### Status Badge
```jsx
<span className="badge-success px-3 py-1 rounded-full text-sm">
  Completed
</span>
```

### Form Input
```jsx
<input 
  type="text" 
  placeholder="Enter text..."
  className="w-full px-3 py-2 rounded-lg"
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

### Semantic Approach
- **Meaningful variable names** instead of color-specific names
- **Automatic contrast** - text adapts to background
- **Consistent spacing** and typography scale
- **Reduced CSS conflicts** with fewer `!important` declarations

### Professional Design
- **Modern color palettes** inspired by leading design systems
- **Subtle shadows** and smooth transitions
- **Glassmorphism effects** for modern aesthetics
- **Responsive design** optimized for all devices

### Developer Experience
- **Intuitive class names** that describe purpose, not appearance
- **Consistent API** across all components
- **Easy customization** through CSS variables
- **TypeScript support** for theme values

## 🔧 Customization

### Adding Custom Colors
```css
:root {
  --custom-accent: #8B5CF6;
}

.dark {
  --custom-accent: #A78BFA;
}

.custom-element {
  color: var(--custom-accent);
}
```

### Creating Custom Components
```css
.my-component {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-sm);
}

.my-component:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
```

---

LevelList Theme System Documentation
