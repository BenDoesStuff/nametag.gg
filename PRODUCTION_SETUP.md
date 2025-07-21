# 🚀 Nametag Production Setup Guide

This guide will help you set up Nametag for production deployment with all monitoring, analytics, and optimization features enabled.

## 📦 Installation Commands

Run these commands to install all production dependencies:

```bash
# Install all dependencies
npm install

# Install additional production dependencies
npm install @sentry/nextjs @vercel/analytics @vercel/og next-sitemap plausible-tracker

# Install development and testing dependencies
npm install --save-dev @axe-core/cli @next/bundle-analyzer cypress @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom tsx webpack-bundle-analyzer

# Setup Sentry (interactive wizard)
npx @sentry/wizard@latest -i nextjs

# Verify installation
npm run type-check
npm run lint
```

## 🔧 Environment Configuration

1. **Copy environment template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your environment variables:**
   ```bash
   # Required: Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Required: Site configuration
   SITE_URL=https://nametag.gg

   # Optional: Analytics
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=nametag.gg
   NEXT_PUBLIC_ANALYTICS_ENABLED=true

   # Optional: Error monitoring
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   SENTRY_DSN=your_sentry_dsn

   # Optional: External APIs
   TWITCH_CLIENT_ID=your_twitch_client_id
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

## 🔍 Vercel Deployment Setup

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel@latest
   ```

2. **Login and link project:**
   ```bash
   vercel login
   vercel link
   ```

3. **Set environment variables in Vercel:**
   ```bash
   # Production environment
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   vercel env add SITE_URL production
   vercel env add NEXT_PUBLIC_PLAUSIBLE_DOMAIN production
   vercel env add NEXT_PUBLIC_SENTRY_DSN production
   vercel env add SENTRY_DSN production

   # Preview environment
   vercel env add NEXT_PUBLIC_SUPABASE_URL preview
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
   # ... repeat for other variables
   ```

4. **Deploy:**
   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

## 📊 Analytics Setup

### Plausible Analytics

1. **Sign up at [plausible.io](https://plausible.io)**
2. **Add your domain:** `nametag.gg`
3. **Set environment variable:**
   ```bash
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=nametag.gg
   NEXT_PUBLIC_ANALYTICS_ENABLED=true
   ```

### Vercel Analytics

Automatically enabled when deployed to Vercel. No additional setup required.

## 🐛 Error Monitoring Setup

### Sentry

1. **Create account at [sentry.io](https://sentry.io)**
2. **Run Sentry wizard:**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
3. **Add DSN to environment:**
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   SENTRY_DSN=your_sentry_dsn
   ```

## 🧪 Testing Setup

### Unit Testing with Jest

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### E2E Testing with Cypress

```bash
# Install Cypress (if not already installed)
npm install --save-dev cypress

# Open Cypress GUI
npm run test:e2e:open

# Run Cypress tests headlessly
npm run test:e2e
```

### Accessibility Testing

```bash
# Run accessibility audit
npm run a11y

# Manual testing with Chrome DevTools:
# 1. Open Chrome DevTools
# 2. Go to Lighthouse tab
# 3. Run accessibility audit
```

## 📈 Performance Optimization

### Bundle Analysis

```bash
# Generate bundle analysis report
npm run analyze

# This will create bundle-analyzer-report.html
# Open it in your browser to analyze bundle size
```

### Image Optimization

Images are automatically optimized by Next.js. Ensure you're using the `Image` component:

```tsx
import Image from 'next/image';

<Image
  src="/your-image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // for above-the-fold images
/>
```

## 🔍 SEO Configuration

### Sitemap Generation

```bash
# Generate sitemap (runs automatically after build)
npm run sitemap

# Manually generate sitemap
npx next-sitemap
```

### Open Graph Images

Dynamic OG images are available at: `/api/og`

Example URLs:
- `https://nametag.gg/api/og?title=Welcome%20to%20Nametag`
- `https://nametag.gg/api/og?username=johndoe&type=profile`

## 🚨 Security Configuration

### Content Security Policy (CSP)

CSP is configured in `next.config.mjs`. Update the domains as needed:

```javascript
// In next.config.mjs headers()
"Content-Security-Policy": [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://plausible.io",
  "img-src 'self' blob: data: https://*.supabase.co",
  // Add more domains as needed
].join('; ')
```

### Rate Limiting

Basic rate limiting is configured in the headers. For advanced rate limiting, consider using Vercel's Edge Functions or middleware.

## 🔗 Link Checking

```bash
# Check for broken links (requires running server)
npm run dev # in one terminal
npm run check-links # in another terminal

# Check specific URL
npx tsx scripts/check_links.ts https://nametag.gg
```

## 🎯 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:

1. ✅ Runs linting and type checking
2. ✅ Executes unit tests
3. ✅ Builds the application
4. ✅ Runs E2E tests
5. ✅ Performs security audit
6. ✅ Deploys to Vercel (on main branch)
7. ✅ Runs Lighthouse CI for performance monitoring

### Required GitHub Secrets

Add these secrets to your GitHub repository:

```
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_TOKEN=your_vercel_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SENTRY_DSN=your_sentry_dsn
```

## 📋 Launch Checklist

Before launching to production, complete the [Launch Checklist](./LAUNCH_CHECKLIST.md).

## 🆘 Troubleshooting

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

### Vercel Deployment Issues

```bash
# Check deployment logs
vercel logs

# Redeploy
vercel --prod --force
```

### Performance Issues

```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npx depcheck

# Lighthouse audit
npx lighthouse https://nametag.gg --output html
```

## 📚 Additional Resources

- [Next.js Performance Guide](https://nextjs.org/docs/pages/building-your-application/optimizing/performance)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Plausible Analytics Guide](https://plausible.io/docs)

---

**🎉 Your Nametag platform is now ready for production!**