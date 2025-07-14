import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// 只在有有效配置时创建Supabase客户端
export const supabase = supabaseUrl.includes('placeholder') 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey);

// 数据库表结构类型定义
export interface UserBehaviorLog {
  id: string;
  user_id: string;
  tool_id: string | null;
  action_type: ActionType;
  timestamp: string;
  metadata: ActionMetadata;
  created_at: string;
}

// 行为类型枚举
export type ActionType = 
  | 'favorite'       // 收藏工具
  | 'unfavorite'     // 取消收藏
  | 'like'           // 点赞
  | 'unlike'         // 取消点赞
  | 'rate'           // 评分
  | 'search'         // 搜索
  | 'view_tool'      // 访问工具详情页
  | 'visit_website'  // 点击访问工具官网
  | 'filter'         // 使用筛选功能
  | 'share'          // 分享工具
  | 'compare';       // 对比工具

// 行为元数据类型
export interface ActionMetadata {
  source_page?: string;        // 来源页面
  search_query?: string;       // 搜索关键词
  device_type?: 'desktop' | 'mobile' | 'tablet';  // 设备类型
  user_agent?: string;         // 用户代理
  referrer?: string;           // 引荐页面
  session_id?: string;         // 会话ID
  rating_value?: number;       // 评分值(1-5)
  filter_category?: string;    // 筛选类别
  filter_pricing?: string;     // 筛选价格模式
  share_platform?: string;     // 分享平台
  compare_tools?: string[];    // 对比的工具ID列表
  ip_address?: string;         // IP地址
  country?: string;            // 国家
  city?: string;               // 城市
  [key: string]: any;          // 其他自定义字段
}

// 数据库错误类型
export interface DatabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}
