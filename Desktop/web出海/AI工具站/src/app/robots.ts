export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://toolverse.com/sitemap.xml', // 替换为你的域名
  };
}
