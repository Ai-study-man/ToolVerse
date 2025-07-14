export interface Tool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  logo: string;
  website: string;
  category: string;
  subcategory?: string;
  pricingModel: 'free' | 'paid' | 'freemium';
  pricing: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  features: string[];
  useCases?: string[];  // 使用场景
  modelUsed?: string;   // 使用的 AI 模型
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  toolCount: number;
}

export interface SearchFilters {
  category?: string;
  pricingModel?: string;
  rating?: number;
  tags?: string[];
}
