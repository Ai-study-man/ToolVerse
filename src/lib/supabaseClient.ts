import { createClient } from '@supabase/supabase-js';

// 检查环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 在任何环境下检查环境变量，构建时提供默认值
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder-anon-key';

// 开发模式下的额外检查
if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Warning: Supabase environment variables are missing. Using placeholder values.');
}

// 创建 Supabase 客户端
export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    persistSession: false, // 不持久化会话
    autoRefreshToken: false, // 不自动刷新 token
  },
});

// 默认导出
export default supabase;
