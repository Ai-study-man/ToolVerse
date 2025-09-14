import { createClient } from '@supabase/supabase-js';

// 检查环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 调试日志 - 在任何环境都显示（不显示敏感信息）
console.log('[Supabase Client] Environment check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing',
  keyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'missing',
  nodeEnv: process.env.NODE_ENV
});

// 构建时使用占位符，运行时必须有真实值
const isPlaceholder = !supabaseUrl || !supabaseAnonKey;
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder-anon-key';

// 运行时检查
if (typeof window !== 'undefined' && isPlaceholder) {
  console.error('❌ [Supabase Client] Missing environment variables in production!');
  console.error('📝 Setup Guide:');
  console.error('1. Login to Vercel Dashboard');
  console.error('2. Go to your project → Settings → Environment Variables');
  console.error('3. Add: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('4. Redeploy your application');
  console.error('📚 More help: /docs/SUPABASE_RLS_GUIDE.md');
}

// 创建 Supabase 客户端
export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    persistSession: false, // 不持久化会话
    autoRefreshToken: false, // 不自动刷新 token
  },
});

// 导出环境变量状态供调试使用
export const supabaseConfig = {
  isConfigured: !isPlaceholder,
  url: finalSupabaseUrl,
  hasValidKey: !!supabaseAnonKey
};

// 默认导出
export default supabase;
