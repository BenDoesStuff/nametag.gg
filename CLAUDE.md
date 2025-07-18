# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Gamefolio" - a Next.js 15 portfolio application for gamers to showcase their gaming profiles, link social accounts, and connect with other gamers. The app uses Supabase for authentication and data storage, with a dark gaming-themed UI styled with Tailwind CSS.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture

### App Router Structure
- Uses Next.js 15 App Router with TypeScript
- Root layout includes global navigation with UserSession component
- Dynamic routing for user profiles: `/[username]/page.tsx`
- Protected routes for profile editing and API endpoints

### Authentication Flow
- Supabase authentication with email/password
- UserSession component manages auth state globally
- Profile data stored in `profiles` table linked to auth users
- Auth state changes trigger profile data fetching

### Key Components
- **UserSession**: Handles auth state, user menu, login/logout
- **ProfileCard**: Displays user gaming profiles with social links
- **API Routes**: `/api/profile/`, `/api/friends/` for data operations
- Components are exported via `/components/index.ts` barrel pattern

### Database Integration
- Supabase client configured in `/lib/supabaseClient.ts`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Real-time auth state management with `onAuthStateChange`

### Styling
- Tailwind CSS with custom "neon-green" color (#39FF14)
- Dark theme with gray-900/950 backgrounds
- Gaming-aesthetic with neon accents and gradients
- Responsive design with mobile-first approach

## Development Notes

- Uses React 19 with Next.js 15 and TypeScript 5
- Custom fonts: Geist Sans and Geist Mono
- All components use client-side rendering where auth state is needed
- Profile usernames are used for dynamic routing