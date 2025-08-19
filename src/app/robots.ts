import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
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
          '/static/',
          '/*.json$',
          '/auth/',
          '/dashboard/',
          '/test-data/',
          '/data-status/',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/', '/auth/'],
        crawlDelay: 0.5,
      },
      {
        userAgent: 'Bingbot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/', '/auth/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Baiduspider',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/', '/auth/'],
        crawlDelay: 2,
      },
      // 阻止AI训练爬虫
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
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: 'https://toolverse.com/sitemap.xml',
    host: 'https://toolverse.com',
  }
}
