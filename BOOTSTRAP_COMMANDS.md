# 🚀 Nametag Production Bootstrap Commands

Run these commands in order to set up your production-ready Nametag deployment.

## 1. Install Dependencies

```bash
# Install all production dependencies
npm install

# Verify installation
npm run type-check
npm run lint
```

## 2. Environment Setup

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your actual values
# Required variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SITE_URL
```

## 3. Sentry Setup (Optional but Recommended)

```bash
# Run Sentry setup wizard
npx @sentry/wizard@latest -i nextjs

# Follow the prompts to:
# 1. Login to Sentry
# 2. Select/create project
# 3. Configure error monitoring
```

## 4. Database Setup

```bash
# Run database migrations in Supabase SQL editor
# Files to execute in order:
# 1. database/friend_system_schema.sql
# 2. database/new_blocks_schema.sql
# 3. database/add_stream_columns.sql
```

## 5. Local Development Test

```bash
# Start development server
npm run dev

# In another terminal, run tests
npm run test
npm run check-links http://localhost:3000

# Run accessibility audit
npm run a11y
```

## 6. Performance Analysis

```bash
# Analyze bundle size
npm run analyze

# Generate sitemap
npm run sitemap

# Build for production
npm run build
```

## 7. Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel@latest

# Login and link project
vercel login
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SITE_URL production

# Deploy
vercel --prod
```

## 8. GitHub Actions Setup

Add these secrets to your GitHub repository (Settings → Secrets):

```
VERCEL_ORG_ID=team_xxx (from vercel link output)
VERCEL_PROJECT_ID=prj_xxx (from vercel link output)
VERCEL_TOKEN=xxx (from vercel.com/account/tokens)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SENTRY_DSN=your_sentry_dsn (if using Sentry)
```

## 9. Analytics Setup (Optional)

### Plausible Analytics
```bash
# 1. Sign up at plausible.io
# 2. Add site: nametag.gg
# 3. Set environment variable:
#    NEXT_PUBLIC_PLAUSIBLE_DOMAIN=nametag.gg
#    NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### Vercel Analytics
```bash
# Automatically enabled on Vercel
# No additional setup required
```

## 10. E2E Testing Setup

```bash
# Install Cypress (if not already installed)
npm install --save-dev cypress

# Open Cypress to run initial setup
npm run test:e2e:open

# Run E2E tests
npm run test:e2e
```

## 11. Domain Setup

```bash
# In Vercel dashboard:
# 1. Go to Project Settings → Domains
# 2. Add your custom domain (e.g., nametag.gg)
# 3. Configure DNS records as instructed
# 4. Wait for SSL certificate to be issued
```

## 12. Launch Checklist

```bash
# Run through the launch checklist
# See LAUNCH_CHECKLIST.md for complete list

# Key items:
# ✅ All tests passing
# ✅ Environment variables set
# ✅ Database migrations run
# ✅ Analytics tracking
# ✅ Error monitoring active
# ✅ Performance scores > 90
# ✅ Security headers configured
```

## 13. Post-Launch Monitoring

```bash
# Monitor key metrics:
# - Error rates in Sentry
# - Performance in Vercel Analytics
# - User engagement in Plausible
# - Uptime and response times

# Set up alerts for:
# - High error rates
# - Slow response times
# - Deployment failures
```

## Quick Start (Minimal Setup)

If you want to get up and running quickly:

```bash
# 1. Essential setup
npm install
cp .env.local.example .env.local
# Edit .env.local with Supabase credentials

# 2. Test locally
npm run dev

# 3. Deploy
vercel --prod
```

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Environment Issues
```bash
# Check environment variables
vercel env ls

# Pull latest environment from Vercel
vercel env pull .env.local
```

### Performance Issues
```bash
# Analyze bundle
npm run analyze

# Check for large dependencies
npx depcheck

# Run Lighthouse audit
npx lighthouse https://nametag.gg --output html
```

---

**🎉 Your production-ready Nametag platform is now live!**

For detailed information, see:
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Complete setup guide
- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) - Pre-launch checklist
- [README_NEW.md](./README_NEW.md) - Updated README