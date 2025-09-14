// 数据库字段映射工具
// 处理 PostgreSQL snake_case 和 TypeScript camelCase 之间的转换

import { Tool } from '@/types';

// 数据库行接口（snake_case）
export interface DatabaseTool {
  id: string;
  name: string;
  description: string;
  short_description: string;  // snake_case
  logo: string;
  website: string;
  category: string;
  subcategory?: string;
  pricing_model: 'free' | 'paid' | 'freemium';  // snake_case
  pricing: string;
  rating: number;
  review_count: number;  // snake_case
  tags: string[];
  features: string[];
  use_cases?: string[];  // snake_case
  model_used?: string;   // snake_case
  created_at: string;    // snake_case
  likes?: number;
  views?: number;
  developer?: string;
  reviews?: any[];
  last_updated?: string;  // snake_case
  status?: 'active' | 'inactive';
}

// 从数据库行转换为 TypeScript 对象
export function databaseRowToTool(row: DatabaseTool): Tool {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    shortDescription: row.short_description,
    logo: row.logo,
    website: row.website,
    category: row.category,
    subcategory: row.subcategory,
    pricingModel: row.pricing_model,
    pricing: row.pricing,
    rating: row.rating,
    reviewCount: row.review_count,
    tags: row.tags,
    features: row.features,
    useCases: row.use_cases,
    modelUsed: row.model_used,
    createdAt: row.created_at,
    likes: row.likes,
    views: row.views,
    developer: row.developer,
    reviews: row.reviews,
    lastUpdated: row.last_updated,
    status: row.status
  };
}

// 从 TypeScript 对象转换为数据库更新对象
export function toolToDatabaseUpdate(tool: Partial<Tool>): Partial<DatabaseTool> {
  const update: Partial<DatabaseTool> = {};
  
  if (tool.id !== undefined) update.id = tool.id;
  if (tool.name !== undefined) update.name = tool.name;
  if (tool.description !== undefined) update.description = tool.description;
  if (tool.shortDescription !== undefined) update.short_description = tool.shortDescription;
  if (tool.logo !== undefined) update.logo = tool.logo;
  if (tool.website !== undefined) update.website = tool.website;
  if (tool.category !== undefined) update.category = tool.category;
  if (tool.subcategory !== undefined) update.subcategory = tool.subcategory;
  if (tool.pricingModel !== undefined) update.pricing_model = tool.pricingModel;
  if (tool.pricing !== undefined) update.pricing = tool.pricing;
  if (tool.rating !== undefined) update.rating = tool.rating;
  if (tool.reviewCount !== undefined) update.review_count = tool.reviewCount;
  if (tool.tags !== undefined) update.tags = tool.tags;
  if (tool.features !== undefined) update.features = tool.features;
  if (tool.useCases !== undefined) update.use_cases = tool.useCases;
  if (tool.modelUsed !== undefined) update.model_used = tool.modelUsed;
  if (tool.createdAt !== undefined) update.created_at = tool.createdAt;
  if (tool.likes !== undefined) update.likes = tool.likes;
  if (tool.views !== undefined) update.views = tool.views;
  if (tool.developer !== undefined) update.developer = tool.developer;
  if (tool.reviews !== undefined) update.reviews = tool.reviews;
  if (tool.lastUpdated !== undefined) update.last_updated = tool.lastUpdated;
  if (tool.status !== undefined) update.status = tool.status;
  
  return update;
}

// 构建更新查询的字段列表
export function buildUpdateFields(updates: Partial<DatabaseTool>): string {
  const fields = Object.entries(updates)
    .filter(([key, value]) => key !== 'id' && value !== undefined)
    .map(([key, _], index) => `${key} = $${index + 2}`)  // $1 is for WHERE id
    .join(', ');
  
  return fields;
}

// 获取更新值的数组（不包括 id）
export function getUpdateValues(updates: Partial<DatabaseTool>): any[] {
  return Object.entries(updates)
    .filter(([key, value]) => key !== 'id' && value !== undefined)
    .map(([_, value]) => value);
}
