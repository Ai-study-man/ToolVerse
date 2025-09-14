export function normalizeCategory(category: string): string {
  if (!category || typeof category !== 'string') {
    return 'Other';
  }

  const cleanCategory = category.trim().toLowerCase();

  const categoryMapping: Record<string, string> = {
    // Writing & Content
    'writing': 'Writing & Content',
    'ai writing': 'Writing & Content',
    'content': 'Writing & Content',
    'content creation': 'Writing & Content',
    'copywriting': 'Writing & Content',
    'text generation': 'Writing & Content',
    'text': 'Writing & Content',
    'blog': 'Writing & Content',
    'article': 'Writing & Content',
    'creative writing': 'Writing & Content',
    'translation': 'Writing & Content',
    'paraphrasing': 'Writing & Content',
    'grammar': 'Writing & Content',
    'editing': 'Writing & Content',

    // Image Generation & Design
    'design': 'Image Generation & Design',
    'image generation': 'Image Generation & Design',
    'image': 'Image Generation & Design',
    'art': 'Image Generation & Design',
    'ai art': 'Image Generation & Design',
    'graphic design': 'Image Generation & Design',
    'logo': 'Image Generation & Design',
    'photo editing': 'Image Generation & Design',
    'image editing': 'Image Generation & Design',
    'visual': 'Image Generation & Design',
    'creative': 'Image Generation & Design',
    'digital art': 'Image Generation & Design',
    'avatar': 'Image Generation & Design',

    // Video & Audio
    'video': 'Video & Audio',
    'audio': 'Video & Audio',
    'video editing': 'Video & Audio',
    'audio editing': 'Video & Audio',
    'music': 'Video & Audio',
    'speech': 'Video & Audio',
    'voice': 'Video & Audio',
    'text-to-speech': 'Video & Audio',
    'speech-to-text': 'Video & Audio',
    'music generation': 'Video & Audio',
    'podcast': 'Video & Audio',
    'sound': 'Video & Audio',

    // Chatbots & Assistants
    'chatbot': 'Chatbots & Assistants',
    'chatbots': 'Chatbots & Assistants',
    'assistant': 'Chatbots & Assistants',
    'assistants': 'Chatbots & Assistants',
    'ai assistant': 'Chatbots & Assistants',
    'virtual assistant': 'Chatbots & Assistants',
    'conversational ai': 'Chatbots & Assistants',
    'chat': 'Chatbots & Assistants',
    'customer service': 'Chatbots & Assistants',
    'customer support': 'Chatbots & Assistants',

    // Productivity
    'productivity': 'Productivity',
    'workflow': 'Productivity',
    'automation': 'Productivity',
    'task management': 'Productivity',
    'project management': 'Productivity',
    'organization': 'Productivity',
    'efficiency': 'Productivity',
    'utilities': 'Productivity',
    'utility': 'Productivity',
    'tools': 'Productivity',
    'general': 'Productivity',
    'office': 'Productivity',

    // Developer Tools
    'development': 'Developer Tools',
    'developer tools': 'Developer Tools',
    'coding': 'Developer Tools',
    'programming': 'Developer Tools',
    'programming tools': 'Developer Tools',
    'code': 'Developer Tools',
    'software development': 'Developer Tools',
    'debugging': 'Developer Tools',
    'testing': 'Developer Tools',
    'devops': 'Developer Tools',
    'api': 'Developer Tools',
    'api tools': 'Developer Tools',
    'low-code': 'Developer Tools',
    'no-code': 'Developer Tools',
    'github': 'Developer Tools',

    // Education & Learning
    'education': 'Education & Learning',
    'learning': 'Education & Learning',
    'teaching': 'Education & Learning',
    'training': 'Education & Learning',
    'study': 'Education & Learning',
    'tutoring': 'Education & Learning',
    'e-learning': 'Education & Learning',
    'courses': 'Education & Learning',
    'educational': 'Education & Learning',
    'academic': 'Education & Learning',

    // Healthcare & Legal
    'healthcare': 'Healthcare & Legal',
    'health': 'Healthcare & Legal',
    'medical': 'Healthcare & Legal',
    'legal': 'Healthcare & Legal',
    'legal tools': 'Healthcare & Legal',
    'law': 'Healthcare & Legal',
    'compliance': 'Healthcare & Legal',
    'wellness': 'Healthcare & Legal',
    'fitness': 'Healthcare & Legal',
    'therapy': 'Healthcare & Legal',

    // Research & Analysis
    'research': 'Research & Analysis',
    'analysis': 'Research & Analysis',
    'data analysis': 'Research & Analysis',
    'analytics': 'Research & Analysis',
    'analytics tools': 'Research & Analysis',
    'data': 'Research & Analysis',
    'statistics': 'Research & Analysis',
    'insights': 'Research & Analysis',
    'market research': 'Research & Analysis',
    'competitive analysis': 'Research & Analysis',
    'search': 'Research & Analysis',
    'business intelligence': 'Research & Analysis',

    // Marketing & SEO
    'marketing': 'Marketing & SEO',
    'seo': 'Marketing & SEO',
    'seo tools': 'Marketing & SEO',
    'digital marketing': 'Marketing & SEO',
    'social media': 'Marketing & SEO',
    'advertising': 'Marketing & SEO',
    'email marketing': 'Marketing & SEO',
    'growth': 'Marketing & SEO',
    'promotion': 'Marketing & SEO',
    'branding': 'Marketing & SEO',
    'sales': 'Marketing & SEO',
    'ecommerce': 'Marketing & SEO',
    'e-commerce': 'Marketing & SEO',

    // Other
    'lifestyle': 'Other',
    'entertainment': 'Other',
    'gaming': 'Other',
    'travel': 'Other',
    'food': 'Other',
    'sports': 'Other',
    'fashion': 'Other',
    'fun': 'Other',
    'personal': 'Other',
    'business': 'Other',
    'finance': 'Other',
    'miscellaneous': 'Other',
    'other': 'Other',
    'unknown': 'Other',
  };

  // Direct match
  if (categoryMapping[cleanCategory]) {
    return categoryMapping[cleanCategory];
  }

  // Fuzzy match
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (cleanCategory.includes(key) || key.includes(cleanCategory)) {
      return value;
    }
  }

  return 'Other';
}

// Category icons for the 11 core categories
export const categoryIcons: Record<string, string> = {
  'Writing & Content': '✍️',
  'Image Generation & Design': '🎨',
  'Video & Audio': '🎬',
  'Chatbots & Assistants': '🤖',
  'Productivity': '⚡',
  'Developer Tools': '💻',
  'Education & Learning': '📚',
  'Healthcare & Legal': '🏥',
  'Research & Analysis': '📊',
  'Marketing & SEO': '📈',
  'Other': '📦',
};

// Get category icon with fallback
export function getCategoryIcon(category: string): string {
  const normalizedCategory = normalizeCategory(category);
  return categoryIcons[normalizedCategory] || '📦';
}

// Get all categories with icons
export function getCategoriesWithIcons(): Array<{ name: string; icon: string }> {
  return Object.entries(categoryIcons).map(([name, icon]) => ({
    name,
    icon
  }));
}

/**
 * Map tool to unified category based on category, name, and description
 * @param tool Tool object with name, description, and optional category
 * @returns Unified category name
 */
export function mapToUnifiedCategory(tool: { 
  name: string; 
  description: string; 
  category?: string | null 
}): string {
  // Step 1: Try to map existing category first
  if (tool.category) {
    const normalizedExisting = normalizeCategory(tool.category);
    if (normalizedExisting !== 'Other') {
      return normalizedExisting;
    }
  }

  // Step 2: Analyze name and description for keywords
  const textToAnalyze = `${tool.name} ${tool.description || ''}`.toLowerCase();
  
  // Keyword mapping for content analysis
  const keywordMapping: Record<string, string[]> = {
    'Writing & Content': [
      'write', 'writing', 'content', 'text', 'article', 'blog', 'copy', 'script',
      'essay', 'story', 'book', 'novel', 'poem', 'grammar', 'translate', 'translation',
      'paraphrase', 'summarize', 'rewrite', 'author', 'journalist', 'editor',
      'copywriter', 'proofreading', 'spell check', 'language', 'newsletter'
    ],
    
    'Image Generation & Design': [
      'image', 'photo', 'picture', 'design', 'art', 'visual', 'graphic', 'logo',
      'banner', 'poster', 'illustration', 'drawing', 'sketch', 'avatar', 'icon',
      'background', 'wallpaper', 'thumbnail', 'mockup', 'ui design', 'web design',
      'creative', 'aesthetic', 'color', 'typography', 'layout', 'photoshop'
    ],
    
    'Video & Audio': [
      'video', 'audio', 'sound', 'music', 'voice', 'speech', 'podcast', 'radio',
      'recording', 'edit', 'clip', 'movie', 'film', 'youtube', 'streaming',
      'microphone', 'speaker', 'noise', 'song', 'beat', 'melody', 'rhythm',
      'subtitle', 'caption', 'transcript', 'voiceover', 'dubbing'
    ],
    
    'Chatbots & Assistants': [
      'chat', 'chatbot', 'assistant', 'bot', 'conversation', 'dialogue', 'support',
      'customer service', 'help desk', 'ai assistant', 'virtual assistant',
      'companion', 'advisor', 'consultant', 'guide', 'mentor', 'tutor',
      'answering', 'query', 'question', 'response', 'interactive'
    ],
    
    'Productivity': [
      'productivity', 'workflow', 'automation', 'task', 'project', 'management',
      'organization', 'planning', 'schedule', 'calendar', 'reminder', 'note',
      'todo', 'efficiency', 'optimize', 'streamline', 'collaboration', 'team',
      'workspace', 'office', 'document', 'file', 'folder', 'storage'
    ],
    
    'Developer Tools': [
      'code', 'coding', 'programming', 'developer', 'development', 'software',
      'api', 'framework', 'library', 'debugging', 'testing', 'deployment',
      'github', 'git', 'repository', 'database', 'server', 'backend', 'frontend',
      'javascript', 'python', 'react', 'node', 'web development', 'app development',
      'copilot', 'pair programming', 'code generation', 'ide', 'editor', 'compiler'
    ],
    
    'Education & Learning': [
      'education', 'learning', 'teaching', 'training', 'course', 'lesson', 'study',
      'student', 'teacher', 'instructor', 'tutorial', 'guide', 'knowledge',
      'skill', 'certification', 'exam', 'quiz', 'practice', 'exercise',
      'academic', 'school', 'university', 'college', 'research paper'
    ],
    
    'Healthcare & Legal': [
      'health', 'medical', 'healthcare', 'doctor', 'patient', 'hospital', 'clinic',
      'medicine', 'therapy', 'treatment', 'diagnosis', 'wellness', 'fitness',
      'legal', 'law', 'lawyer', 'attorney', 'court', 'contract', 'compliance',
      'regulation', 'policy', 'privacy', 'security', 'gdpr', 'terms'
    ],
    
    'Research & Analysis': [
      'research', 'analysis', 'data', 'analytics', 'statistics', 'survey',
      'report', 'insight', 'trend', 'pattern', 'visualization', 'chart',
      'graph', 'dashboard', 'metrics', 'kpi', 'business intelligence',
      'market research', 'competitive analysis', 'study', 'investigation'
    ],
    
    'Marketing & SEO': [
      'marketing', 'seo', 'advertising', 'promotion', 'campaign', 'brand',
      'social media', 'email marketing', 'content marketing', 'digital marketing',
      'ecommerce', 'sales', 'lead', 'conversion', 'traffic', 'keyword',
      'optimization', 'google', 'facebook', 'instagram', 'linkedin', 'twitter'
    ]
  };

  // Step 3: Score each category based on keyword matches
  const categoryScores: Record<string, number> = {};
  
  Object.entries(keywordMapping).forEach(([category, keywords]) => {
    let score = 0;
    keywords.forEach(keyword => {
      // Exact keyword match gets higher score
      if (textToAnalyze.includes(keyword)) {
        // Longer, more specific keywords get much higher weight
        if (keyword.length > 8) {
          score += 4; // Very specific terms
        } else if (keyword.length > 5) {
          score += 3; // Moderately specific terms
        } else if (keyword.length > 3) {
          score += 2; // Standard terms
        } else {
          score += 1; // Short terms
        }
      }
    });
    categoryScores[category] = score;
  });

  // Step 4: Find the category with highest score
  let bestCategory = 'Other';
  let bestScore = 0;
  
  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });

  // Step 5: Only return the best category if it has a meaningful score
  // This prevents weak matches from being classified incorrectly
  return bestScore >= 2 ? bestCategory : 'Other';
}

// Category display names (for Chinese UI)
export const categoryDisplayNames: Record<string, string> = {
  'Writing & Content': '写作与内容',
  'Image Generation & Design': '图像生成与设计',
  'Video & Audio': '视频与音频',
  'Chatbots & Assistants': '聊天机器人与助手',
  'Productivity': '生产力工具',
  'Developer Tools': '开发工具',
  'Education & Learning': '教育与学习',
  'Healthcare & Legal': '健康与法律',
  'Research & Analysis': '研究与分析',
  'Marketing & SEO': '营销与SEO',
  'Other': '其他',
};

// Get category display name
export function getCategoryDisplayName(category: string): string {
  const normalizedCategory = normalizeCategory(category);
  return categoryDisplayNames[normalizedCategory] || normalizedCategory;
}
