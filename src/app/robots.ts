export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/_next/',
          '/test-data/',
          '/data-status/',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
        crawlDelay: 2,
      },
      {
        userAgent: 'Baiduspider',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
        crawlDelay: 3,
      },
    ],
    sitemap: 'https://toolverse.com/sitemap.xml',
    host: 'https://toolverse.com',
  };
}
