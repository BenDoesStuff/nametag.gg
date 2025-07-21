# 🎮 Nametag - Your Ultimate Gamer Profile

**Nametag** is a Next.js 15 portfolio application for gamers to showcase their gaming profiles, link social accounts, and connect with other gamers. Create your ultimate gamer identity and share it with the world.

![Nametag Demo](./public/nametag-logo.svg)

## ✨ Features

- **🎯 Block-Based Profile Editor** - Drag-and-drop customizable blocks
- **🎨 Dynamic Themes** - Dark mode with customizable neon accent colors
- **👥 Friend System** - Connect with other gamers and build your network
- **🎮 Gaming Integration** - Link Steam, Discord, Twitch, and more
- **📱 Mobile Responsive** - Optimized for all devices
- **🚀 Real-time Updates** - Live streaming integration and notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nametag.git
   cd nametag
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   ```bash
   # Run the included SQL files in your Supabase SQL editor
   psql -d your_db < database/friend_system_schema.sql
   psql -d your_db < database/new_blocks_schema.sql
   psql -d your_db < database/add_stream_columns.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see your Nametag application.

## 📁 Project Structure

```
nametag/
├── src/
│   ├── app/                 # Next.js 15 App Router
│   ├── components/          # React components
│   │   ├── blocks/         # Profile block components
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
├── database/               # SQL migrations
└── scripts/                # Utility scripts
```

## 🎨 Customization

### Themes
Nametag supports dynamic color themes. Users can customize their profile's accent color from the theme picker.

### Blocks
The profile system uses a block-based approach:
- **Header Block** - Profile photo, name, bio
- **Games Block** - Showcase favorite games
- **Friends Block** - Display friend connections
- **Stream Block** - Twitch/YouTube integration
- **About Block** - Rich text or Q&A format
- **Gallery Block** - Media showcase

### Adding New Blocks
See `BLOCKS_README.md` for detailed instructions on creating custom blocks.

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy**

The application will be available at your Vercel domain.

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run Cypress E2E tests
npm run test:e2e:open    # Open Cypress GUI
npm run a11y             # Run accessibility audit

# Analysis & Optimization
npm run analyze          # Analyze bundle size
npm run sitemap          # Generate sitemap
npm run check-links      # Check for broken links

# Build variants
npm run build:standalone # Build as standalone app
```

[![CI Status](https://github.com/your-username/nametag/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/your-username/nametag/actions)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000.svg)](https://nametag.gg)

## 📚 Documentation

- [Block System Guide](./BLOCKS_README.md)
- [Friend System Setup](./FRIEND_SYSTEM_SETUP.md)
- [Social Links Guide](./SOCIAL_LINKS_README.md)
- [Claude.ai Integration](./CLAUDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Nametag** - Create your ultimate gamer profile and connect with the gaming community! 🎮✨