# Visual Effects Implementation Guide

## Overview

This document describes the comprehensive visual effects system implemented for the Play Store Clone web application. All effects are production-ready, performance-optimized, and respect accessibility preferences.

## Table of Contents

1. [Installation](#installation)
2. [Components](#components)
3. [Animations](#animations)
4. [Performance Optimizations](#performance-optimizations)
5. [Accessibility](#accessibility)
6. [Usage Examples](#usage-examples)

## Installation

The visual effects system uses `framer-motion` for advanced animations:

```bash
npm install framer-motion
```

All other dependencies are already included in the project.

## Components

### 1. Enhanced AppCard (`/src/components/AppCard.tsx`)

**Features:**
- Staggered fade-in animation on scroll
- 3D tilt effect on mouse move
- Glassmorphism hover effect
- Shine/glare effect sweep
- Scale animation on hover
- Image zoom on hover

**Props:**
```typescript
type AppCardProps = {
  app: App;          // App data from Prisma
  index?: number;    // For staggered animations (default: 0)
};
```

**Usage:**
```tsx
<AppCard app={appData} index={0} />
```

**Visual Effects:**
- Entry: Fade in from 0.9 scale with staggered delay (50ms per card)
- Hover: 3D tilt based on mouse position, glassmorphism overlay, shine sweep
- Performance: Uses `will-change` for transform optimization

### 2. Enhanced InstallButton (`/src/components/InstallButton.tsx`)

**Features:**
- Ripple effect on click
- Loading spinner with rotation animation
- Success checkmark animation with bounce
- Smooth color transitions between states
- Label animation on state change

**Props:**
```typescript
type InstallButtonProps = {
  appId: string;
  isInstalled?: boolean;
};
```

**States:**
1. **idle** - Ready to install (green primary button)
2. **pending** - Installing with spinner
3. **success** - Brief success state with checkmark (800ms)
4. **installed** - Completed state (Open button)

**Usage:**
```tsx
<InstallButton appId="app-123" isInstalled={false} />
```

### 3. Enhanced StarRating (`/src/components/StarRating.tsx`)

**Features:**
- Animated star fill with rotation
- Sparkle effect for ratings ≥ 4.5
- Staggered animation (100ms delay per star)
- Count fade-in animation
- Dark mode support

**Props:**
```typescript
type StarRatingProps = {
  rating: number;
  size?: number;
  showCount?: boolean;
  count?: string;
  className?: string;
  animate?: boolean;  // Enable entry animation
};
```

**Usage:**
```tsx
<StarRating rating={4.8} size={20} animate={true} showCount={true} count="10K" />
```

### 4. Enhanced ScreenshotCarousel (`/src/components/ScreenshotCarousel.tsx`)

**Features:**
- Smooth drag/swipe with momentum
- Active screenshot scale effect (1.05x)
- Animated dot indicators
- Border highlight on active screenshot
- Staggered entry animation
- Keyboard navigation (Arrow keys)

**Props:**
```typescript
type ScreenshotCarouselProps = {
  screenshots: Screenshot[];
  title: string;
};
```

**Usage:**
```tsx
<ScreenshotCarousel screenshots={screenshotArray} title="App Name" />
```

### 5. HeroBanner (`/src/components/HeroBanner.tsx`)

**Features:**
- Animated gradient background (300% size, 15s loop)
- Floating particles (20 particles with random positions)
- Sparkles icon animation (rotation + scale)
- Text reveal animation
- CTA button hover effect

**Props:**
```typescript
type HeroBannerProps = {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
};
```

**Usage:**
```tsx
<HeroBanner
  title="Discover apps you'll actually use"
  subtitle="Hand picked for you"
  ctaText="Browse charts"
  ctaHref="/?section=top-charts"
/>
```

### 6. PageTransition (`/src/components/PageTransition.tsx`)

**Features:**
- Fade + slide transition between pages
- Exit animation (fade out + slide up)
- Entry animation (fade in + slide down)
- Uses pathname for unique keys

**Usage:**
```tsx
<PageTransition>
  {children}
</PageTransition>
```

### 7. AnimatedLoader (`/src/components/AnimatedLoader.tsx`)

**Features:**
- Fade + scale entrance
- Spinning loader icon
- Smooth exit animation

**Usage:**
```tsx
<AnimatedLoader size={24} className="my-4" />
```

## Animations

### Tailwind Custom Animations

The following animations are defined in `tailwind.config.ts`:

| Animation | Duration | Use Case |
|-----------|----------|----------|
| `fade-in` | 0.5s | Simple fade entrance |
| `fade-in-up` | 0.6s | Fade + slide up |
| `scale-in` | 0.3s | Scale from 0.9 to 1 |
| `shimmer` | 2s (infinite) | Skeleton loading |
| `gradient-shift` | 8s (infinite) | Background gradient animation |
| `ripple` | 0.6s | Click ripple effect |
| `star-fill` | 0.4s | Star rating fill |
| `sparkle` | 1s | Sparkle appearance |
| `float` | 3s (infinite) | Floating elements |
| `shine` | 2s (infinite) | Shine sweep effect |
| `tilt` | 0.3s | 3D tilt effect |

### CSS Utility Classes

#### Glassmorphism
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

#### Shine Effect
```css
.shine-effect {
  /* Automatically applies shine sweep on hover */
}
```

#### Gradient Border
```css
.gradient-border {
  /* Animated gradient border on hover */
}
```

## Performance Optimizations

### 1. Will-Change Property
Used on elements that will animate to prepare the browser:

```tsx
className="will-change-transform"
className="will-change-opacity"
```

### 2. Transform-Based Animations
All animations use CSS transforms (translateX, translateY, scale, rotate) instead of position/size changes for GPU acceleration.

### 3. Intersection Observer
Cards only animate when they enter the viewport:

```tsx
const { ref, hasIntersected } = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: "50px",
  freezeOnceVisible: true,
});
```

### 4. Memo Optimization
Components are memoized to prevent unnecessary re-renders:

```tsx
export const AppCard = memo(function AppCard({ app, index }) {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.app.id === nextProps.app.id;
});
```

### 5. Image Lazy Loading
Images load only when needed:

```tsx
<Image
  src={app.iconUrl}
  alt={app.title}
  fill
  priority={false}  // Lazy load
/>
```

## Accessibility

### Reduced Motion Support

All animations respect the user's motion preference:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus States
All interactive elements have visible focus states:

```css
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary-blue ring-0;
}
```

### ARIA Labels
All interactive components include proper ARIA labels:

```tsx
<button aria-label={`Go to screenshot ${idx + 1}`}>
```

### Keyboard Navigation
All components support keyboard navigation:
- Screenshot carousel: Arrow keys
- Buttons: Enter/Space
- Links: Enter

## Usage Examples

### Example 1: App Grid with Staggered Animation

```tsx
<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
  {apps.map((app, index) => (
    <AppCard key={app.id} app={app} index={index} />
  ))}
</div>
```

### Example 2: App Detail Page with Animations

```tsx
function AppDetailPage({ app }) {
  return (
    <div>
      <StarRating
        rating={app.rating}
        size={20}
        animate={true}
        showCount={true}
        count={app.reviewCount}
      />

      <ScreenshotCarousel
        screenshots={app.screenshots}
        title={app.title}
      />

      <InstallButton
        appId={app.id}
        isInstalled={app.installed}
      />
    </div>
  );
}
```

### Example 3: Landing Page with Hero Banner

```tsx
function HomePage() {
  return (
    <div>
      <HeroBanner
        title="Discover amazing apps"
        subtitle="Curated collection"
        ctaText="Explore now"
        ctaHref="/explore"
      />

      <div className="grid grid-cols-6 gap-4">
        {featuredApps.map((app, index) => (
          <AppCard key={app.id} app={app} index={index} />
        ))}
      </div>
    </div>
  );
}
```

## Browser Support

All visual effects are supported in:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

Fallbacks are provided for older browsers (effects gracefully degrade).

## Testing

To test the visual effects:

1. **Development mode:**
   ```bash
   npm run dev
   ```

2. **Production build:**
   ```bash
   npm run build
   npm start
   ```

3. **Test reduced motion:**
   - macOS: System Preferences > Accessibility > Display > Reduce motion
   - Windows: Settings > Ease of Access > Display > Show animations
   - DevTools: Emulate CSS media feature `prefers-reduced-motion: reduce`

## Dark Mode Support

All visual effects work seamlessly in dark mode. The glassmorphism and particle effects adapt automatically:

```css
[data-theme="dark"] .glass-effect {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## Troubleshooting

### Issue: Animations not working
- Check if `framer-motion` is installed
- Verify Tailwind config includes animation keyframes
- Check browser console for errors

### Issue: Performance issues
- Reduce the number of animated elements visible at once
- Ensure `will-change` is used appropriately
- Check if browser hardware acceleration is enabled

### Issue: Animations too fast/slow
- Adjust duration in component props or Tailwind config
- Use custom timing functions for specific effects

## Future Enhancements

Potential additions:
1. Parallax scrolling effects
2. More particle animation variations
3. Advanced 3D transforms with Three.js integration
4. Lottie animation support
5. SVG path animations
6. Micro-interactions for more UI elements

---

**Note:** All effects are designed to be visually impressive while maintaining excellent performance and accessibility standards.
