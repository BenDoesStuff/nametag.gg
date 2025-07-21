/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    // Enable modern bundling
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Optimize imports for better tree-shaking
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      preventFullImport: true,
    },
    '@/components/ui': {
      transform: '@/components/ui/{{member}}',
    },
  },

  // Bundle analyzer (enabled when ANALYZE=true)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: '../bundle-analyzer-report.html',
          })
        );
      }
      return config;
    },
  }),

  // Legacy redirects for SEO
  async redirects() {
    return [
      {
        source: '/gamefolio/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // Add more legacy redirects as needed
      {
        source: '/profile/:username',
        destination: '/:username',
        permanent: true,
      },
    ];
  },

  // Security and performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // CSP - adjust domains as needed
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://plausible.io https://static.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' blob: data: https://*.supabase.co https://*.steamstatic.com https://*.riotgames.com https://*.blizzard.com https://*.epicgames.com https://picsum.photos https://images.contentstack.io https://images.blz-contentstack.com https://www.minecraft.net https://media.contentapi.ea.com https://genshin.hoyoverse.com https://images.igdb.com https://i.imgur.com https://imgur.com https://cdn2.unrealengine.com https://bnetcmsus-a.akamaihd.net https://webstatic.hoyoverse.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://plausible.io wss://*.supabase.co",
              "frame-src 'self' https://www.youtube.com https://player.twitch.tv",
              "media-src 'self' https://*.supabase.co",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "form-action 'self'",
              "base-uri 'self'",
              "manifest-src 'self'"
            ].join('; ')
          },
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ],
      },
      // Cache static assets
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      // Cache API routes with shorter duration
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60'
          }
        ],
      }
    ];
  },

  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // Gaming platforms
      {
        protocol: 'https',
        hostname: 'shared.akamai.steamstatic.com',
        pathname: '/store_item_assets/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.unrealengine.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bnetcmsus-a.akamaihd.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'webstatic.hoyoverse.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
        pathname: '/**',
      },
      // Wildcard patterns for gaming platforms
      {
        protocol: 'https',
        hostname: '**.steamstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.riotgames.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.blizzard.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.epicgames.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.blz-contentstack.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.minecraft.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.contentapi.ea.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'genshin.hoyoverse.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        pathname: '/**',
      },
      // Supabase storage (replace with your actual Supabase URL)
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // GitHub avatars for social auth
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      // Discord avatars
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/avatars/**',
      }
    ],
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // Output configuration for standalone deployment if needed
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Compression
  compress: true,

  // Generate ETags for static content
  generateEtags: true,

  // Disable trailing slash
  trailingSlash: false,
};

export default nextConfig;