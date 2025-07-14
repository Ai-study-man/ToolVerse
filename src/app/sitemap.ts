import { allTools, categories } from '../data/mockData';

const baseUrl = 'https://toolverse.com'; // 替换为你的域名

export default function sitemap() {
  const staticRoutes = [
    '',
    '/tools',
    '/categories',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const toolRoutes = allTools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: new Date(tool.createdAt).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...toolRoutes, ...categoryRoutes];
}
