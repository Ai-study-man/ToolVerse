/**
 * 类别标准化工具
 * 
 * 将散乱的原始类别映射到统一的核心分类系统
 * 支持多种输入格式和语言，输出标准化的英文类别
 */

// 核心类别定义（不超过12个）
export const CORE_CATEGORIES = {
  WRITING_CONTENT: 'Writing & Content',
  IMAGE_DESIGN: 'Image Generation & Design', 
  VIDEO_AUDIO: 'Video & Audio',
  CHATBOTS_ASSISTANTS: 'Chatbots & Assistants',
  PRODUCTIVITY: 'Productivity',
  DEVELOPER_TOOLS: 'Developer Tools',
  EDUCATION_LEARNING: 'Education & Learning',
  HEALTHCARE_LEGAL: 'Healthcare & Legal',
  RESEARCH_ANALYSIS: 'Research & Analysis',
  MARKETING_SEO: 'Marketing & SEO',
  BUSINESS_FINANCE: 'Business & Finance',
  OTHER: 'Other'
} as const;

// 类别映射表 - 从原始类别到核心类别的映射
const CATEGORY_MAPPING: Record<string, string> = {
  // Writing & Content 相关
  'writing': CORE_CATEGORIES.WRITING_CONTENT,
  'ai writing': CORE_CATEGORIES.WRITING_CONTENT,
  'writing & content': CORE_CATEGORIES.WRITING_CONTENT,
  'content creation': CORE_CATEGORIES.WRITING_CONTENT,
  'content': CORE_CATEGORIES.WRITING_CONTENT,
  'copywriting': CORE_CATEGORIES.WRITING_CONTENT,
  'text generation': CORE_CATEGORIES.WRITING_CONTENT,
  'text': CORE_CATEGORIES.WRITING_CONTENT,
  'blog writing': CORE_CATEGORIES.WRITING_CONTENT,
  'creative writing': CORE_CATEGORIES.WRITING_CONTENT,
  'content marketing': CORE_CATEGORIES.WRITING_CONTENT,
  'academia': CORE_CATEGORIES.WRITING_CONTENT,
  'academic': CORE_CATEGORIES.WRITING_CONTENT,
  'translation': CORE_CATEGORIES.WRITING_CONTENT,
  'paraphrasing': CORE_CATEGORIES.WRITING_CONTENT,

  // Image Generation & Design 相关
  'design': CORE_CATEGORIES.IMAGE_DESIGN,
  'design & art': CORE_CATEGORIES.IMAGE_DESIGN,
  'image generation': CORE_CATEGORIES.IMAGE_DESIGN,
  'image': CORE_CATEGORIES.IMAGE_DESIGN,
  'art': CORE_CATEGORIES.IMAGE_DESIGN,
  'ai art': CORE_CATEGORIES.IMAGE_DESIGN,
  'graphic design': CORE_CATEGORIES.IMAGE_DESIGN,
  'logo design': CORE_CATEGORIES.IMAGE_DESIGN,
  'photo editing': CORE_CATEGORIES.IMAGE_DESIGN,
  'image editing': CORE_CATEGORIES.IMAGE_DESIGN,
  'visual': CORE_CATEGORIES.IMAGE_DESIGN,
  'creative': CORE_CATEGORIES.IMAGE_DESIGN,
  'digital art': CORE_CATEGORIES.IMAGE_DESIGN,

  // Video & Audio 相关
  'video': CORE_CATEGORIES.VIDEO_AUDIO,
  'audio': CORE_CATEGORIES.VIDEO_AUDIO,
  'video & audio': CORE_CATEGORIES.VIDEO_AUDIO,
  'video editing': CORE_CATEGORIES.VIDEO_AUDIO,
  'audio editing': CORE_CATEGORIES.VIDEO_AUDIO,
  'music': CORE_CATEGORIES.VIDEO_AUDIO,
  'speech': CORE_CATEGORIES.VIDEO_AUDIO,
  'voice': CORE_CATEGORIES.VIDEO_AUDIO,
  'text-to-speech': CORE_CATEGORIES.VIDEO_AUDIO,
  'speech-to-text': CORE_CATEGORIES.VIDEO_AUDIO,
  'music generation': CORE_CATEGORIES.VIDEO_AUDIO,
  'podcast': CORE_CATEGORIES.VIDEO_AUDIO,

  // Chatbots & Assistants 相关
  'chatbot': CORE_CATEGORIES.CHATBOTS_ASSISTANTS,
  'chatbots': CORE_CATEGORIES.CHATBOTS_ASSISTANTS,
  'assistant': CORE_CATEGORIES.CHATBOTS_ASSISTANTS,
  'assistants': CORE_CATEGORIES.CHATBOTS_ASSISTANTS,
  'ai assistant': CORE_CATEGORIES.CHATBOTS_ASSISTANTS,
  'virtual assistant': CORE_CATEGORIES.CHATBOTS_ASSISTANTS,
  'conversational ai': CORE_CATEGORIES.CHATBOTS_ASSISTANTS,
  'chat': CORE_CATEGORIES.CHATBOTS_ASSISTANTS,
  'customer service': CORE_CATEGORIES.CHATBOTS_ASSISTANTS,
  'customer support': CORE_CATEGORIES.CHATBOTS_ASSISTANTS,

  // Productivity 相关
  'productivity': CORE_CATEGORIES.PRODUCTIVITY,
  'workflow': CORE_CATEGORIES.PRODUCTIVITY,
  'automation': CORE_CATEGORIES.PRODUCTIVITY,
  'task management': CORE_CATEGORIES.PRODUCTIVITY,
  'project management': CORE_CATEGORIES.PRODUCTIVITY,
  'organization': CORE_CATEGORIES.PRODUCTIVITY,
  'efficiency': CORE_CATEGORIES.PRODUCTIVITY,
  'utilities': CORE_CATEGORIES.PRODUCTIVITY,
  'utility': CORE_CATEGORIES.PRODUCTIVITY,
  'tools': CORE_CATEGORIES.PRODUCTIVITY,
  'general': CORE_CATEGORIES.PRODUCTIVITY,

  // Developer Tools 相关
  'development': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'developer tools': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'coding': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'programming': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'code': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'software development': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'debugging': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'testing': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'devops': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'api': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'low-code': CORE_CATEGORIES.DEVELOPER_TOOLS,
  'no-code': CORE_CATEGORIES.DEVELOPER_TOOLS,

  // Education & Learning 相关
  'education': CORE_CATEGORIES.EDUCATION_LEARNING,
  'learning': CORE_CATEGORIES.EDUCATION_LEARNING,
  'education & learning': CORE_CATEGORIES.EDUCATION_LEARNING,
  'teaching': CORE_CATEGORIES.EDUCATION_LEARNING,
  'training': CORE_CATEGORIES.EDUCATION_LEARNING,
  'study': CORE_CATEGORIES.EDUCATION_LEARNING,
  'tutoring': CORE_CATEGORIES.EDUCATION_LEARNING,
  'e-learning': CORE_CATEGORIES.EDUCATION_LEARNING,
  'courses': CORE_CATEGORIES.EDUCATION_LEARNING,
  'educational': CORE_CATEGORIES.EDUCATION_LEARNING,

  // Healthcare & Legal 相关
  'healthcare': CORE_CATEGORIES.HEALTHCARE_LEGAL,
  'health': CORE_CATEGORIES.HEALTHCARE_LEGAL,
  'medical': CORE_CATEGORIES.HEALTHCARE_LEGAL,
  'legal': CORE_CATEGORIES.HEALTHCARE_LEGAL,
  'law': CORE_CATEGORIES.HEALTHCARE_LEGAL,
  'compliance': CORE_CATEGORIES.HEALTHCARE_LEGAL,
  'wellness': CORE_CATEGORIES.HEALTHCARE_LEGAL,
  'fitness': CORE_CATEGORIES.HEALTHCARE_LEGAL,
  'therapy': CORE_CATEGORIES.HEALTHCARE_LEGAL,

  // Research & Analysis 相关
  'research': CORE_CATEGORIES.RESEARCH_ANALYSIS,
  'analysis': CORE_CATEGORIES.RESEARCH_ANALYSIS,
  'research & analysis': CORE_CATEGORIES.RESEARCH_ANALYSIS,
  'data analysis': CORE_CATEGORIES.RESEARCH_ANALYSIS,
  'analytics': CORE_CATEGORIES.RESEARCH_ANALYSIS,
  'data': CORE_CATEGORIES.RESEARCH_ANALYSIS,
  'statistics': CORE_CATEGORIES.RESEARCH_ANALYSIS,
  'insights': CORE_CATEGORIES.RESEARCH_ANALYSIS,
  'market research': CORE_CATEGORIES.RESEARCH_ANALYSIS,
  'competitive analysis': CORE_CATEGORIES.RESEARCH_ANALYSIS,
  'search': CORE_CATEGORIES.RESEARCH_ANALYSIS,

  // Marketing & SEO 相关
  'marketing': CORE_CATEGORIES.MARKETING_SEO,
  'seo': CORE_CATEGORIES.MARKETING_SEO,
  'marketing & seo': CORE_CATEGORIES.MARKETING_SEO,
  'digital marketing': CORE_CATEGORIES.MARKETING_SEO,
  'social media': CORE_CATEGORIES.MARKETING_SEO,
  'advertising': CORE_CATEGORIES.MARKETING_SEO,
  'email marketing': CORE_CATEGORIES.MARKETING_SEO,
  'growth': CORE_CATEGORIES.MARKETING_SEO,
  'promotion': CORE_CATEGORIES.MARKETING_SEO,
  'branding': CORE_CATEGORIES.MARKETING_SEO,

  // Business & Finance 相关
  'business': CORE_CATEGORIES.BUSINESS_FINANCE,
  'finance': CORE_CATEGORIES.BUSINESS_FINANCE,
  'business & finance': CORE_CATEGORIES.BUSINESS_FINANCE,
  'business & sales': CORE_CATEGORIES.BUSINESS_FINANCE,
  'sales': CORE_CATEGORIES.BUSINESS_FINANCE,
  'crm': CORE_CATEGORIES.BUSINESS_FINANCE,
  'accounting': CORE_CATEGORIES.BUSINESS_FINANCE,
  'investment': CORE_CATEGORIES.BUSINESS_FINANCE,
  'financial': CORE_CATEGORIES.BUSINESS_FINANCE,
  'hr': CORE_CATEGORIES.BUSINESS_FINANCE,
  'human resources': CORE_CATEGORIES.BUSINESS_FINANCE,
  'management': CORE_CATEGORIES.BUSINESS_FINANCE,

  // Other/Miscellaneous 相关
  'lifestyle': CORE_CATEGORIES.OTHER,
  'entertainment': CORE_CATEGORIES.OTHER,
  'gaming': CORE_CATEGORIES.OTHER,
  'travel': CORE_CATEGORIES.OTHER,
  'food': CORE_CATEGORIES.OTHER,
  'sports': CORE_CATEGORIES.OTHER,
  'fashion': CORE_CATEGORIES.OTHER,
  'fun': CORE_CATEGORIES.OTHER,
  'personal': CORE_CATEGORIES.OTHER,
  'miscellaneous': CORE_CATEGORIES.OTHER,
  'misc': CORE_CATEGORIES.OTHER,
  'other': CORE_CATEGORIES.OTHER,
  'unknown': CORE_CATEGORIES.OTHER,
};

/**
 * 标准化类别名称
 * @param category 原始类别名称
 * @returns 标准化后的类别名称
 */
export function normalizeCategory(category: string): string {
  if (!category || typeof category !== 'string') {
    return CORE_CATEGORIES.OTHER;
  }

  // 清理输入：去除首尾空格，转换为小写，移除特殊字符
  const cleanCategory = category
    .trim()
    .toLowerCase()
    .replace(/[&_\-]/g, ' ')  // 将 &, _, - 替换为空格
    .replace(/\s+/g, ' ')     // 多个空格合并为一个
    .trim();

  // 直接匹配
  if (CATEGORY_MAPPING[cleanCategory]) {
    return CATEGORY_MAPPING[cleanCategory];
  }

  // 模糊匹配：检查是否包含关键词
  for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
    if (cleanCategory.includes(key) || key.includes(cleanCategory)) {
      return value;
    }
  }

  // 特殊处理：检查是否是已知的核心类别
  const coreValues = Object.values(CORE_CATEGORIES);
  for (const coreCategory of coreValues) {
    if (cleanCategory.includes(coreCategory.toLowerCase()) || 
        coreCategory.toLowerCase().includes(cleanCategory)) {
      return coreCategory;
    }
  }

  // 如果没有匹配到任何类别，归类为 Other
  console.warn(`Unknown category: "${category}", mapped to "${CORE_CATEGORIES.OTHER}"`);
  return CORE_CATEGORIES.OTHER;
}

/**
 * 获取所有核心类别列表
 */
export function getCoreCategories(): string[] {
  return Object.values(CORE_CATEGORIES);
}

/**
 * 检查是否是有效的核心类别
 */
export function isValidCoreCategory(category: string): boolean {
  return Object.values(CORE_CATEGORIES).includes(category as any);
}

/**
 * 批量标准化类别
 */
export function normalizeCategoriesBatch(categories: string[]): string[] {
  return categories.map(normalizeCategory);
}

/**
 * 获取类别统计信息
 */
export function getCategoryStats(tools: Array<{ category?: string }>): Record<string, number> {
  const stats: Record<string, number> = {};
  
  // 初始化所有核心类别为0
  Object.values(CORE_CATEGORIES).forEach(category => {
    stats[category] = 0;
  });

  // 统计每个类别的工具数量
  tools.forEach(tool => {
    const normalizedCategory = normalizeCategory(tool.category || '');
    stats[normalizedCategory] = (stats[normalizedCategory] || 0) + 1;
  });

  return stats;
}

export default normalizeCategory;