# Quick Reference: Visual Effects

## Component Import Paths

```tsx
import { AppCard } from "@/components/AppCard";
import { InstallButton } from "@/components/InstallButton";
import { StarRating } from "@/components/StarRating";
import { ScreenshotCarousel } from "@/components/ScreenshotCarousel";
import { HeroBanner } from "@/components/HeroBanner";
import { PageTransition } from "@/components/PageTransition";
import { AnimatedLoader } from "@/components/AnimatedLoader";
```

## Quick Usage

### 1. App Card with Staggered Animation
```tsx
{apps.map((app, index) => (
  <AppCard key={app.id} app={app} index={index} />
))}
```

### 2. Install Button with Ripple
```tsx
<InstallButton appId="123" isInstalled={false} />
```

### 3. Animated Star Rating
```tsx
<StarRating
  rating={4.5}
  size={20}
  animate={true}
  showCount={true}
  count="10K"
/>
```

### 4. Screenshot Carousel with Dots
```tsx
<ScreenshotCarousel
  screenshots={screenshots}
  title="App Name"
/>
```

### 5. Hero Banner
```tsx
<HeroBanner />
```

## CSS Utility Classes

### Glassmorphism Effect
```tsx
<div className="glass-effect p-4 rounded-xl">
  Content
</div>
```

### Shine Effect
```tsx
<div className="shine-effect">
  Hover to see shine
</div>
```

### Gradient Border
```tsx
<div className="gradient-border rounded-xl p-4">
  Hover to see gradient border
</div>
```

### 3D Perspective
```tsx
<div className="preserve-3d">
  <div style={{ transform: 'rotateY(10deg)' }}>
    3D content
  </div>
</div>
```

## Tailwind Animation Classes

```tsx
<div className="animate-fade-in">Fade in</div>
<div className="animate-fade-in-up">Fade in and slide up</div>
<div className="animate-scale-in">Scale in</div>
<div className="animate-shimmer">Shimmer effect</div>
<div className="animate-gradient-shift">Gradient shift</div>
<div className="animate-ripple">Ripple effect</div>
<div className="animate-float">Float effect</div>
<div className="animate-shine">Shine sweep</div>
```

## Performance Utilities

```tsx
<div className="will-change-transform">
  Will animate transform
</div>

<div className="will-change-opacity">
  Will animate opacity
</div>
```

## Hooks

### Intersection Observer
```tsx
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const { ref, hasIntersected } = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: "50px",
  freezeOnceVisible: true,
});

<div ref={ref}>
  {hasIntersected && <AnimatedContent />}
</div>
```

### Scroll Reveal
```tsx
import { useScrollReveal } from "@/hooks/useScrollReveal";

const { ref, isVisible } = useScrollReveal({
  threshold: 0.1,
  triggerOnce: true,
});

<div ref={ref}>
  {isVisible && <Content />}
</div>
```

## Framer Motion Variants

### Card Animation
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, delay: index * 0.05 }}
>
  Card content
</motion.div>
```

### Hover Animation
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Interactive element
</motion.div>
```

### Stagger Children
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Dark Mode Considerations

All effects automatically adapt to dark mode via CSS variables:

```tsx
// No changes needed - effects work in both modes
<AppCard app={app} index={0} />
```

## Testing Motion Preferences

```tsx
// Effects automatically respect prefers-reduced-motion
// No code changes needed
```

To test:
- Chrome DevTools: Rendering > Emulate CSS media feature `prefers-reduced-motion`
- macOS: System Preferences > Accessibility > Display > Reduce motion
- Windows: Settings > Ease of Access > Display > Show animations

## Common Patterns

### Grid with Staggered Cards
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
  {apps.map((app, index) => (
    <AppCard key={app.id} app={app} index={index} />
  ))}
</div>
```

### Loading State
```tsx
{isLoading ? (
  <AnimatedLoader size={40} />
) : (
  <Content />
)}
```

### Page with Transitions
```tsx
<PageTransition>
  <YourPageContent />
</PageTransition>
```

### Hero Section
```tsx
<section>
  <HeroBanner
    title="Your Title"
    subtitle="Your Subtitle"
    ctaText="Call to Action"
    ctaHref="/link"
  />

  <div className="mt-10">
    <ContentGrid />
  </div>
</section>
```
