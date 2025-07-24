// SEO配置文件 - 统一管理网站SEO相关配置

export const seoConfig = {
  // 网站基本信息
  siteName: 'ToolVerse',
  siteUrl: 'https://toolverse.com',
  defaultTitle: 'ToolVerse - 发现最佳AI工具 | AI工具目录和评测平台',
  defaultDescription: '发现和使用最好的AI工具！ToolVerse提供500+AI工具详细评测、使用指南。包括ChatGPT、Midjourney、GitHub Copilot等热门AI工具，找到适合您业务和创意项目的AI解决方案。',
  
  // 默认关键词
  defaultKeywords: [
    'AI工具',
    '人工智能工具',
    'ChatGPT',
    'Midjourney',
    'AI绘画',
    'AI写作',
    'AI编程',
    'AI工具大全',
    'AI工具目录',
    'AI工具评测',
    'AI工具推荐',
    '免费AI工具',
    'AI工具排行榜'
  ],

  // Open Graph 默认图片
  defaultOgImage: '/og-image.png',
  
  // 社交媒体链接
  socialLinks: {
    twitter: 'https://twitter.com/toolverse',
    github: 'https://github.com/toolverse',
    linkedin: 'https://linkedin.com/company/toolverse'
  },

  // 联系信息
  contact: {
    email: 'contact@toolverse.com',
    phone: '+86-400-000-0000'
  },

  // 页面特定SEO配置
  pages: {
    home: {
      title: 'ToolVerse - 发现最佳AI工具 | AI工具目录和评测平台',
      description: '发现和使用最好的AI工具！ToolVerse提供500+AI工具详细评测、使用指南。包括ChatGPT、Midjourney、GitHub Copilot等热门AI工具，找到适合您业务和创意项目的AI解决方案。',
      keywords: [
        'AI工具',
        '人工智能工具',
        'ChatGPT',
        'Midjourney',
        'AI绘画',
        'AI写作',
        'AI编程',
        'AI工具大全',
        'AI工具目录',
        'AI工具评测'
      ]
    },
    tools: {
      title: 'AI工具大全 - 发现最佳人工智能工具 | ToolVerse',
      description: '浏览ToolVerse收录的500+优质AI工具。包括ChatGPT、Midjourney、Claude等热门AI工具，按分类筛选、查看评分和价格信息，找到最适合您的AI解决方案。',
      keywords: [
        'AI工具大全',
        'AI工具目录',
        '人工智能工具',
        'AI工具筛选',
        'AI工具分类',
        'ChatGPT',
        'Midjourney',
        'Claude',
        'AI工具评测',
        'AI工具排行'
      ]
    },
    categories: {
      title: 'AI工具分类 - 按类别浏览人工智能工具 | ToolVerse',
      description: '按分类浏览AI工具：对话AI、图像生成、代码开发、视频编辑、内容创作、商业分析等。轻松找到您需要的AI工具类型，提高工作效率。',
      keywords: [
        'AI工具分类',
        'AI工具类别',
        '对话AI工具',
        'AI图像生成',
        'AI代码开发',
        'AI视频编辑',
        'AI内容创作',
        'AI商业分析'
      ]
    },
    submit: {
      title: '提交AI工具 - 推荐优质AI工具 | ToolVerse',
      description: '向ToolVerse提交您发现的优质AI工具。我们欢迎开发者和用户推荐新的AI工具，共建最全面的AI工具目录。',
      keywords: [
        '提交AI工具',
        '推荐AI工具',
        'AI工具收录',
        'AI工具推广',
        'AI工具合作'
      ]
    }
  },

  // 结构化数据模板
  structuredData: {
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ToolVerse',
      url: 'https://toolverse.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://toolverse.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      }
    },
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ToolVerse',
      description: '专业的AI工具发现和评测平台',
      url: 'https://toolverse.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://toolverse.com/logo.png',
        width: 200,
        height: 60,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+86-400-000-0000',
        contactType: 'customer service',
        availableLanguage: ['Chinese', 'English'],
      }
    }
  }
};

// 生成页面元数据的辅助函数
export function generatePageMetadata(pageKey: keyof typeof seoConfig.pages, customData?: {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}) {
  const pageConfig = seoConfig.pages[pageKey];
  
  return {
    title: customData?.title || pageConfig.title,
    description: customData?.description || pageConfig.description,
    keywords: (customData?.keywords || pageConfig.keywords).join(', '),
    openGraph: {
      title: customData?.title || pageConfig.title,
      description: customData?.description || pageConfig.description,
      url: customData?.canonical || `${seoConfig.siteUrl}/${pageKey === 'home' ? '' : pageKey}`,
      type: 'website' as const,
      images: [
        {
          url: customData?.ogImage || seoConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${pageConfig.title} - ${seoConfig.siteName}`,
        },
      ],
      siteName: seoConfig.siteName,
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: customData?.title || pageConfig.title,
      description: customData?.description || pageConfig.description,
      images: [customData?.ogImage || seoConfig.defaultOgImage],
    },
    alternates: {
      canonical: customData?.canonical || `${seoConfig.siteUrl}/${pageKey === 'home' ? '' : pageKey}`,
    },
  };
}

// 生成工具页面元数据
export function generateToolMetadata(tool: {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  tags: string[];
  rating: number;
  pricingModel: string;
  pricing?: string;
  logo?: string;
}) {
  const title = `${tool.name} - ${tool.shortDescription || tool.description} | ToolVerse`;
  const description = `${tool.description} 了解${tool.name}的功能特点、价格信息、用户评价和使用教程。${tool.pricingModel === 'free' ? '免费使用' : tool.pricingModel === 'freemium' ? '免费试用' : '付费工具'}，评分${tool.rating}分。`;
  
  const keywords = [
    tool.name,
    ...tool.tags,
    tool.category,
    'AI工具',
    tool.pricingModel === 'free' ? '免费AI工具' : 'AI工具',
    `${tool.name}教程`,
    `${tool.name}使用方法`,
    `${tool.name}评测`
  ];

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      url: `${seoConfig.siteUrl}/tools/${tool.id}`,
      type: 'article',
      images: [
        {
          url: tool.logo || seoConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${tool.name} Logo`,
        },
      ],
      siteName: seoConfig.siteName,
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [tool.logo || seoConfig.defaultOgImage],
    },
    alternates: {
      canonical: `${seoConfig.siteUrl}/tools/${tool.id}`,
    },
    other: {
      'article:author': seoConfig.siteName,
      'article:section': tool.category,
      'article:tag': tool.tags.join(','),
      'product:price:amount': tool.pricing || '联系获取报价',
      'product:price:currency': 'CNY',
    },
  };
}
