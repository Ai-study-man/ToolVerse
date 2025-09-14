/**
 * AI工具数据类型定义
 * 对应 Supabase 数据库中的 tools 表结构
 */
export interface Tool {
  /** 工具唯一标识符 */
  id: string;
  
  /** 工具名称 */
  name: string;
  
  /** 工具分类 */
  category?: string;
  
  /** 定价信息 */
  pricing?: string;
  
  /** 工具描述 */
  description?: string;
  
  /** 官方网站链接 */
  website?: string;
  
  /** 功能特性列表 */
  features?: string[];
  
  /** 标签列表 */
  tags?: string[];
  
  /** Logo 图片链接 */
  logo?: string;
  
  /** 创建时间 */
  created_at?: string;

  // 为了兼容旧组件，添加这些字段
  shortDescription?: string;
  pricingModel?: 'free' | 'paid' | 'freemium';
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
}

/**
 * 分类接口
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  toolCount?: number;
}

/**
 * 工具查询选项
 */
export interface ToolQueryOptions {
  /** 限制返回数量 */
  limit?: number;
  
  /** 按分类筛选 */
  category?: string;
  
  /** 搜索关键词 */
  q?: string;
}

/**
 * Hook 返回类型
 */
export interface UseToolsResult {
  /** 工具数据 */
  data: Tool[] | null;
  
  /** 加载状态 */
  loading: boolean;
  
  /** 错误信息 */
  error: string | null;
  
  /** 手动刷新数据 */
  refresh: () => Promise<void>;
}
