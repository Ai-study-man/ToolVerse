import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// 这个脚本用于设置 Supabase RLS 策略，允许前端读取数据
async function setupRLSPolicies() {
  console.log('🔧 开始设置 Supabase RLS 策略...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log(`URL: ${supabaseUrl ? '✓ 已设置' : '❌ 未设置'}`);
  console.log(`ANON_KEY: ${supabaseAnonKey ? '✓ 已设置' : '❌ 未设置'}`);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ 环境变量未正确配置');
    return;
  }
  
  try {
    // 使用匿名密钥测试前端访问（这是我们需要修复的）
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // 首先检查当前状态
    const { data: tools, error: testError } = await supabase
      .from('tools')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.log('❌ 前端无法访问数据:', testError.message);
      
      // 如果是权限问题，我们需要在 Supabase 控制台中设置策略
      const projectId = supabaseUrl.split('//')[1]?.split('.')[0];
      console.log(`
📋 请在 Supabase 控制台中执行以下 SQL 来允许匿名读取:

-- 1. 临时禁用 RLS（开发环境）
ALTER TABLE tools DISABLE ROW LEVEL SECURITY;

-- 或者，保持 RLS 启用但允许匿名读取（推荐）:
-- ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow anonymous read access" ON tools
--   FOR SELECT
--   TO anon
--   USING (true);

🌐 访问 Supabase 控制台:
   https://supabase.com/dashboard/project/${projectId}/editor
      `);
      
    } else {
      console.log('✅ 前端数据访问正常，RLS 策略已正确配置！');
      console.log(`📊 找到 ${tools?.length || 0} 个工具`);
    }
    
  } catch (error) {
    console.error('设置过程出错:', error);
  }
}

// 运行设置
if (require.main === module) {
  setupRLSPolicies().catch(console.error);
}

export { setupRLSPolicies };
