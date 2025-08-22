// SEO配置文件 - 统一管理网站SEO相关配置

export const seoConfig = {
  // 网站基本信息
  siteName: 'ToolVerse',
  siteUrl: 'https://www.toolsverse.tools',
  defaultTitle: 'ToolVerse - Discover Best AI Tools | AI Tools Directory & Reviews',
  defaultDescription: 'Discover and use the best AI tools! ToolVerse provides 500+ detailed AI tool reviews and guides. Find ChatGPT, Midjourney, GitHub Copilot alternatives and more AI solutions for your business and creative projects.',
  
  // 核心关键词 - 基于搜索量和竞争度优化
  primaryKeywords: [
    'AI tools',
    'artificial intelligence tools',
    'ChatGPT',
    'Midjourney',
    'AI art generator',
    'AI writing tools',
    'AI coding assistant',
    'best AI tools 2025',
    'free AI tools',
    'AI productivity tools'
  ],

  // 长尾关键词 - 提升精准流量
  longTailKeywords: [
    'best AI tools for business',
    'free AI image generators',
    'AI tools for content creation',
    'ChatGPT alternatives',
    'AI programming assistants',
    'text to image AI tools',
    'AI writing assistants for bloggers',
    'enterprise AI software solutions',
    'AI tools comparison 2025',
    'beginner friendly AI tools'
  ],

  // 分类相关关键词
  categoryKeywords: {
    'Conversational AI': ['AI chatbots', 'conversational AI platforms', 'virtual assistants', 'ChatGPT alternatives', 'AI customer service'],
    'Image Generation': ['AI image generators', 'text to image AI', 'AI art tools', 'Midjourney alternatives', 'DALL-E alternatives'],
    'Code Development': ['AI coding tools', 'programming assistants', 'GitHub Copilot alternatives', 'AI code completion', 'developer tools'],
    'Writing & Content': ['AI writing tools', 'content generation AI', 'blog writing AI', 'copywriting tools', 'SEO content tools'],
    'Video & Audio': ['AI video editors', 'voice synthesis AI', 'audio generation tools', 'video creation AI', 'AI transcription'],
    'Business & Analytics': ['business intelligence AI', 'data analysis tools', 'AI automation', 'workflow optimization', 'predictive analytics'],
    'Language & Translation': ['AI translation tools', 'language learning AI', 'multilingual AI', 'DeepL alternatives', 'real-time translation'],
    'Design & Art': ['AI design tools', 'graphic design AI', 'logo generators', 'UI/UX AI tools', 'creative AI platforms']
  },

  // 竞品关键词 - 捕获竞品搜索流量
  competitorKeywords: [
    'Product Hunt AI tools',
    'There\'s An AI For That alternatives',
    'AI Tools Directory',
    'Future Tools alternatives',
    'AI Scout alternatives',
    'Tool Finder AI',
    'AI Tools Hub',
    'Best AI Software 2025'
  ],

  // 默认关键词
  defaultKeywords: [
    'AI tools directory',
    'artificial intelligence software',
    'machine learning tools',
    'AI platforms',
    'AI applications',
    'conversational AI',
    'natural language processing',
    'computer vision AI',
    'AI automation tools',
    'enterprise AI solutions',
    'AI workflow tools',
    'creative AI tools',
    'AI productivity software'
  ],

  // Open Graph 默认图片
  defaultOgImage: '/og-image.png',
  
  // 社交媒体链接
  socialLinks: {
    twitter: 'https://twitter.com/toolverse',
    github: 'https://github.com/toolverse',
    linkedin: 'https://linkedin.com/company/toolverse',
    facebook: 'https://facebook.com/toolverse',
    youtube: 'https://youtube.com/@toolverse'
  },

  // 联系信息
  contact: {
    email: 'contact@toolsverse.tools',
    phone: '+1-555-AI-TOOLS'
  },

  // 页面特定SEO配置
  pages: {
    home: {
      title: 'ToolVerse - Discover Best AI Tools | AI Tools Directory & Reviews',
      description: 'Discover and use the best AI tools! ToolVerse provides 500+ detailed AI tool reviews and guides. Find ChatGPT, Midjourney, GitHub Copilot alternatives and more AI solutions for your business and creative projects.',
      keywords: [
        'AI tools',
        'artificial intelligence tools',
        'best AI tools 2025',
        'ChatGPT',
        'Midjourney',
        'AI tools directory',
        'free AI tools',
        'AI productivity tools',
        'AI software reviews',
        'AI tools comparison'
      ]
    },
    tools: {
      title: 'AI Tools Directory - Discover Best Artificial Intelligence Tools | ToolVerse',
      description: 'Browse 500+ curated AI tools including ChatGPT, Midjourney, Claude, and more. Filter by category, pricing, and ratings. Find the perfect AI tool for your needs with detailed reviews and comparisons.',
      keywords: [
        'AI tools directory',
        'artificial intelligence tools',
        'AI software catalog',
        'ChatGPT alternatives',
        'Midjourney alternatives',
        'best AI tools 2025',
        'free AI tools',
        'AI tools reviews',
        'AI tools comparison',
        'enterprise AI tools'
      ]
    },
    categories: {
      title: 'AI Tools by Category - Browse Tools by Function | ToolVerse',
      description: 'Explore AI tools by category: Conversational AI, Image Generation, Code Development, Content Writing, Business Analytics, and more. Find the right AI tool type for your specific needs.',
      keywords: [
        'AI tools categories',
        'conversational AI tools',
        'AI image generators',
        'AI coding tools',
        'AI writing tools',
        'AI video editors',
        'business AI tools',
        'AI automation tools',
        'AI design tools'
      ]
    },
    submit: {
      title: 'Submit AI Tool - Add Your AI Tool to ToolVerse Directory',
      description: 'Submit your AI tool to ToolVerse directory. Get exposure to thousands of AI enthusiasts and businesses looking for the best AI solutions. Free listing with detailed reviews.',
      keywords: [
        'submit AI tool',
        'add AI tool',
        'AI tool listing',
        'AI directory submission',
        'promote AI tool',
        'AI tool marketing'
      ]
    }
  },

  // 结构化数据模板
  structuredData: {
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ToolVerse',
      url: 'https://www.toolsverse.tools',
      description: 'The ultimate directory for discovering and comparing AI tools',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.toolsverse.tools/tools?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
      sameAs: [
        'https://twitter.com/toolverse',
        'https://github.com/toolverse',
        'https://linkedin.com/company/toolverse'
      ]
    },
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ToolVerse',
      description: 'Professional AI tools discovery and review platform',
      url: 'https://www.toolsverse.tools',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.toolsverse.tools/logo.png',
        width: 200,
        height: 60,
      },
      foundingDate: '2025',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-AI-TOOLS',
        contactType: 'customer service',
        email: 'contact@toolsverse.tools',
        availableLanguage: ['English', 'Chinese'],
      },
      sameAs: [
        'https://twitter.com/toolverse',
        'https://github.com/toolverse',
        'https://linkedin.com/company/toolverse'
      ]
    },
    breadcrumbList: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: []
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

// 生成工具页面元数据 - 优化SEO关键词策略
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
  // 生成竞品关键词
  const competitorKeywords = [
    `${tool.name} alternative`,
    `${tool.name} vs`,
    `best ${tool.category.toLowerCase()} tools`,
    `${tool.name} competitor`,
    `${tool.name} similar tools`
  ];

  // 生成功能性关键词
  const functionalKeywords = [
    `${tool.name} review`,
    `${tool.name} pricing`,
    `how to use ${tool.name}`,
    `${tool.name} tutorial`,
    `${tool.name} features`,
    `${tool.name} pros and cons`,
    `is ${tool.name} worth it`,
    `${tool.name} discount`
  ];

  // 生成长尾关键词
  const longTailKeywords = [
    `best ${tool.category.toLowerCase()} AI tool`,
    `${tool.pricingModel} AI ${tool.category.toLowerCase()} tool`,
    `${tool.name} for business`,
    `${tool.name} for professionals`,
    `AI tool like ${tool.name}`,
    `${tool.category} AI software`
  ];

  // 组合所有关键词
  const allKeywords = [
    tool.name,
    ...tool.tags,
    tool.category,
    'AI tool',
    ...competitorKeywords,
    ...functionalKeywords,
    ...longTailKeywords,
    tool.pricingModel === 'free' ? 'free AI tool' : tool.pricingModel === 'freemium' ? 'freemium AI tool' : 'premium AI tool',
    `${tool.category} software`,
    'artificial intelligence',
    'AI software review',
    'best AI tools 2025'
  ];

  const title = `${tool.name} Review - ${tool.shortDescription || tool.category + ' AI Tool'} | ToolVerse`;
  const description = `${tool.description} Discover ${tool.name}'s features, pricing, user reviews, and alternatives. ${tool.pricingModel === 'free' ? 'Free to use' : tool.pricingModel === 'freemium' ? 'Free trial available' : 'Premium AI tool'} with ${tool.rating}/5 rating. Compare with similar ${tool.category.toLowerCase()} tools.`;
  
  return {
    title,
    description,
    keywords: allKeywords.slice(0, 25).join(', '), // 限制关键词数量避免keyword stuffing
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
          alt: `${tool.name} - ${tool.category} AI Tool`,
        },
      ],
      siteName: seoConfig.siteName,
      locale: 'en_US',
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
      'product:price:amount': tool.pricing || 'Contact for pricing',
      'product:price:currency': 'USD',
      'product:availability': 'in_stock',
      'product:condition': 'new',
      'rating:value': tool.rating.toString(),
      'rating:scale': '5',
    },
  };
}
