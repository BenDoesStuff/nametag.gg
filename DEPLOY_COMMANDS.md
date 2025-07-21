# 🚀 Nametag Deployment Commands

## Quick Deploy to Vercel

```bash
# 1. Commit the rebrand changes
git add .
git commit -m "feat: complete rebrand to Nametag

🎮 Gamefolio → Nametag rebrand including:
- Updated all UI text and branding  
- New logo and assets with neon green theme
- SEO metadata and package.json updates
- Added legacy redirects for old URLs
- Comprehensive documentation updates

🔧 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# 2. Push to GitHub
git push origin main

# 3. Deploy to Vercel (if not auto-deployed)
npx vercel --prod

# 4. Update Vercel project name
# Go to Vercel Dashboard → Settings → General → Change project name to "nametag"
```

## Verification Commands

```bash
# Check for any remaining "Gamefolio" references
git grep -i "gamefolio" src/ public/ *.json *.md

# Test build
npm run build

# Start development server
npm run dev

# Run verification script
./scripts/check_rebrand.sh
```

## Domain Migration (Optional)

```bash
# If migrating to nametag.gg domain:
# 1. Update Vercel project settings
# 2. Add new domain in Vercel dashboard
# 3. Update DNS records
# 4. Add domain to CORS settings in Supabase
```

## Database Updates (if needed)

```sql
-- Run in Supabase SQL editor if stream functionality is desired
\i database/add_stream_columns.sql
```

## Environment Variables Checklist

Ensure these are set in Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `TWITCH_CLIENT_ID` (optional, for streaming)
- `YOUTUBE_API_KEY` (optional, for streaming)

---

Your **Nametag** application is ready for production! 🎮✨