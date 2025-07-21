/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://nametag.gg',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Disable index sitemap for smaller sites
  
  // Exclude paths that shouldn't be indexed
  exclude: [
    '/admin/*',
    '/api/*',
    '/profile/edit',
    '/debug',
    '/test-*',
    '/_next/*',
    '/sitemap*.xml',
  ],
  
  // Dynamic routes configuration
  additionalPaths: async (config) => {
    const result = [];
    
    // Add high-priority static pages
    const staticPages = [
      '/',
      '/friends',
      '/about',
      '/privacy',
      '/terms',
    ];
    
    staticPages.forEach(page => {
      result.push({
        loc: page,
        changefreq: 'weekly',
        priority: page === '/' ? 1.0 : 0.8,
        lastmod: new Date().toISOString(),
      });
    });
    
    // TODO: Add dynamic user profile pages
    // You can fetch popular profiles from your database here
    // Example:
    // const popularProfiles = await fetchPopularProfiles();
    // popularProfiles.forEach(profile => {
    //   result.push({
    //     loc: `/${profile.username}`,
    //     changefreq: 'daily',
    //     priority: 0.6,
    //     lastmod: profile.updated_at,
    //   });
    // });
    
    return result;
  },
  
  // Robot.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/profile/edit',
          '/debug',
          '/test-*',
          '/_next/',
        ],
      },
      // Block AI crawlers if desired
      ...(process.env.BLOCK_AI_CRAWLERS === 'true' ? [
        {
          userAgent: 'GPTBot',
          disallow: '/',
        },
        {
          userAgent: 'ChatGPT-User',
          disallow: '/',
        },
        {
          userAgent: 'CCBot',
          disallow: '/',
        },
      ] : []),
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://nametag.gg'}/sitemap.xml`,
    ],
  },
  
  // Transform function to customize each URL
  transform: async (config, path) => {
    // Default configuration
    const defaultConfig = {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
    
    // Customize based on path
    switch (path) {
      case '/':
        return {
          ...defaultConfig,
          priority: 1.0,
          changefreq: 'daily',
        };
        
      case '/friends':
        return {
          ...defaultConfig,
          priority: 0.8,
          changefreq: 'daily',
        };
        
      default:
        // User profile pages (dynamic routes)
        if (path.match(/^\/[a-zA-Z0-9_-]+$/)) {
          return {
            ...defaultConfig,
            priority: 0.6,
            changefreq: 'daily',
          };
        }
        
        return defaultConfig;
    }
  },
};