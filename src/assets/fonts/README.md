# Font Assets for Open Graph Images

This directory should contain font files for the Open Graph image generation.

## Required Files

- `Inter-Regular.ttf` - For regular text in OG images
- `Inter-Bold.ttf` - For bold headings in OG images

## How to Add Fonts

1. Download Inter font from [Google Fonts](https://fonts.google.com/specimen/Inter)
2. Extract the TTF files
3. Place `Inter-Regular.ttf` and `Inter-Bold.ttf` in this directory

## Alternative

If you prefer to use different fonts or skip custom fonts, update the OG image route:

```typescript
// In src/app/api/og/route.tsx
// Remove or comment out the font loading sections
// The system will fall back to default fonts
```

## Note

Font files are intentionally not included in the repository to keep it lightweight. They need to be added during deployment setup.