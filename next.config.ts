import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/gamefolio/:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shared.akamai.steamstatic.com',
        port: '',
        pathname: '/store_item_assets/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.unrealengine.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bnetcmsus-a.akamaihd.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'webstatic.hoyoverse.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
        port: '',
        pathname: '/**',
      },
      // For any future game image sources
      {
        protocol: 'https',
        hostname: '**.steamstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.riotgames.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.blizzard.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.epicgames.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.blz-contentstack.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.minecraft.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.contentapi.ea.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'genshin.hoyoverse.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        port: '',
        pathname: '/**',
      },
      // Supabase storage for user avatars and content
      {
        protocol: 'https',
        hostname: 'ahpbhvcmhuddkpvjovpj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Spotify album artwork
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
