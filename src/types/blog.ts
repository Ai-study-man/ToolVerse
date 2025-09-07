export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
    };
  };
  category: BlogCategory;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  readingTime: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: string;
  status: 'draft' | 'published';
  relatedTools?: string[]; // Tool IDs for cross-linking
  viewCount: number;
  shareCount: number;
  keywords: string[]; // SEO keywords for this specific post
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon?: string;
  postCount: number;
  seoKeywords: string[];
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: '1',
    name: 'AI Tools Reviews',
    slug: 'ai-tools-reviews',
    description: 'In-depth reviews and comparisons of AI tools',
    color: '#2563eb',
    icon: '⭐',
    postCount: 0,
    seoKeywords: ['AI tool review', 'best AI tools', 'AI software comparison', 'artificial intelligence review']
  },
  {
    id: '2', 
    name: 'AI Tutorials',
    slug: 'ai-tutorials',
    description: 'Step-by-step guides for using AI tools',
    color: '#7c3aed',
    icon: '📚',
    postCount: 0,
    seoKeywords: ['AI tutorial', 'how to use AI', 'AI guide', 'artificial intelligence tutorial']
  },
  {
    id: '3',
    name: 'Industry News',
    slug: 'industry-news',
    description: 'Latest AI industry trends and updates',
    color: '#10b981',
    icon: '📰',
    postCount: 0,
    seoKeywords: ['AI news', 'artificial intelligence news', 'AI industry trends', 'machine learning news']
  },
  {
    id: '4',
    name: 'Business AI',
    slug: 'business-ai',
    description: 'AI tools and strategies for business',
    color: '#f59e0b',
    icon: '💼',
    postCount: 0,
    seoKeywords: ['business AI', 'AI for business', 'enterprise AI', 'AI productivity']
  },
  {
    id: '5',
    name: 'AI Comparisons',
    slug: 'ai-comparisons',
    description: 'Head-to-head comparisons of AI tools',
    color: '#ef4444',
    icon: '⚖️',
    postCount: 0,
    seoKeywords: ['AI comparison', 'AI vs AI', 'compare AI tools', 'best AI tool comparison']
  }
];

export interface BlogFilters {
  category?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  featured?: boolean;
  sortBy?: 'latest' | 'popular' | 'trending';
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  averageReadingTime: number;
  popularTags: { tag: string; count: number }[];
  topCategories: { category: BlogCategory; count: number }[];
}
