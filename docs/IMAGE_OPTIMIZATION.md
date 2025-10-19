# Image Optimization Guide

This guide explains how to optimize images for the SOS Club website to ensure fast loading times and good user experience.

## Image Requirements

### Team Photos
- **Size**: 400x400px minimum
- **Format**: JPG or PNG
- **Quality**: High quality, professional headshots
- **Location**: `/public/images/bureau/`

### Event Photos
- **Size**: 800x600px minimum
- **Format**: JPG
- **Quality**: High quality, well-lit photos
- **Location**: `/public/images/events/`

### General Images
- **Size**: Optimize for web (max 1920px width)
- **Format**: JPG for photos, PNG for graphics with transparency
- **Compression**: Use tools like TinyPNG or ImageOptim

## Optimization Tools

### Online Tools
- [TinyPNG](https://tinypng.com/) - Compress PNG and JPG images
- [Squoosh](https://squoosh.app/) - Google's image optimization tool
- [ImageOptim](https://imageoptim.com/) - Mac app for image optimization

### Command Line Tools
```bash
# Install imagemin-cli
npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant

# Optimize images
imagemin images/*.{jpg,png} --out-dir=optimized --plugin=mozjpeg --plugin=pngquant
```

## Next.js Image Component

Use Next.js Image component for automatic optimization:

```tsx
import Image from 'next/image'

<Image
  src="/images/events/event-photo.jpg"
  alt="Event description"
  width={800}
  height={600}
  className="rounded-lg"
  priority={false} // Set to true for above-the-fold images
/>
```

## Responsive Images

For responsive images, use the `sizes` prop:

```tsx
<Image
  src="/images/events/event-photo.jpg"
  alt="Event description"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="rounded-lg"
/>
```

## WebP Format

Consider using WebP format for better compression:

```tsx
<Image
  src="/images/events/event-photo.webp"
  alt="Event description"
  width={800}
  height={600}
  className="rounded-lg"
/>
```

## Lazy Loading

Images are lazy-loaded by default in Next.js. For above-the-fold images, use `priority={true}`:

```tsx
<Image
  src="/images/hero/hero-image.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority={true}
  className="w-full h-auto"
/>
```

## Image Naming Convention

Use descriptive, kebab-case names:

- `farouk-snoussi-president.jpg`
- `awareness-campaign-2024.jpg`
- `gala-fundraising-event.jpg`

## File Size Guidelines

- **Hero images**: Max 500KB
- **Event photos**: Max 300KB
- **Team photos**: Max 200KB
- **Thumbnails**: Max 100KB

## Alt Text Best Practices

Always provide descriptive alt text:

```tsx
// Good
<Image src="/images/events/gala.jpg" alt="Students and faculty at the annual fundraising gala event" />

// Bad
<Image src="/images/events/gala.jpg" alt="gala" />
```

## Performance Monitoring

Monitor image performance using:

- Google PageSpeed Insights
- Lighthouse
- WebPageTest

Aim for:
- LCP (Largest Contentful Paint) < 2.5s
- CLS (Cumulative Layout Shift) < 0.1
- FID (First Input Delay) < 100ms
