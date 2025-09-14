import { createClient } from '@supabase/supabase-js';

// 检查环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 开发模式下检查环境变量
if (process.env.NODE_ENV === 'development') {
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: false, // 不持久化会话
    autoRefreshToken: false, // 不自动刷新 token
  },
});

// 默认导出
export default supabase;
