import { MetadataRoute } from 'next'
import DataSyncService from '../lib/dataSyncService'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.toolsverse.tools'
  
  try {
    // 获取所有工具和分类数据
    const [tools, categories] = await Promise.all([
      DataSyncService.getTools(),
      DataSyncService.getCategories()
    ])

    // 基础页面
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/tools`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/submit`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
    ]

    // 工具页面
    const toolPages = tools.map((tool) => ({
      url: `${baseUrl}/tools/${tool.id}`,
      lastModified: new Date(tool.createdAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 分类页面
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/category/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // 标签页面 - 基于热门标签
    const popularTags = [
      'chatgpt', 'midjourney', 'ai-writing', 'ai-coding', 'ai-image-generation',
      'free-ai-tools', 'ai-productivity', 'conversational-ai', 'ai-video',
      'ai-design', 'ai-automation', 'machine-learning'
    ]
    
    const tagPages = popularTags.map((tag) => ({
      url: `${baseUrl}/tools?search=${tag}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    // 组合所有页面
    return [
      ...staticPages,
      ...toolPages,
      ...categoryPages,
      ...tagPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // 如果数据获取失败，返回基础页面
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/tools`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ]
  }
}