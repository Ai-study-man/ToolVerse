// 价格层级接口
export interface PricingTier {
  name: string;         // 层级名称：Free, Pro, Enterprise
  price: string;        // 价格：$0, $19/month, Contact for pricing
  features: string[];   // 该层级包含的功能
  limits?: string[];    // 使用限制
  highlighted?: boolean; // 是否为推荐层级
}

// 联系询价信息接口
export interface ContactPricing {
  type: 'contact' | 'range' | 'quote';  // 询价类型
  description: string;   // 描述信息
  priceRange?: string;   // 价格区间（如有）
  contactMethod?: string; // 联系方式
  responseTime?: string;  // 反馈时间
  requirements?: string[]; // 询价需要提供的信息
}

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
  // 新增详细价格信息（可选，向后兼容）
  pricingTiers?: PricingTier[];    // 分层定价
  contactPricing?: ContactPricing;  // 联系询价信息
  rating: number;
  reviewCount: number;
  tags: string[];
  features: string[];
  useCases?: string[];  // 使用场景
  modelUsed?: string;   // 使用的 AI 模型
  createdAt: string;
  // 新增筛选相关字段
  commercialLicense?: boolean;  // 是否支持商用
  difficulty?: 'beginner' | 'intermediate' | 'advanced';  // 难度等级
  lastUpdated?: string;  // 最后更新时间
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

// 高级筛选接口
export interface AdvancedFilters {
  categories: string[];           // 选中的分类
  pricingModels: string[];       // 价格模式：free, paid, freemium
  commercialLicense: string[];   // 商用许可：supported, not-supported
  difficulty: string[];          // 难度：beginner-friendly, advanced
  rating: number;                // 最低评分
  tags: string[];               // 标签筛选
}

// 筛选选项配置
export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;  // 匹配的工具数量
  icon?: string;   // 图标
}
