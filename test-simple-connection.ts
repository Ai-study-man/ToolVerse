import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

console.log('🔍 测试 Supabase 连接...');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('📋 配置信息:');
console.log('URL:', supabaseUrl ? '✅ 已设置' : '❌ 未设置');
console.log('Service Key:', supabaseServiceKey ? '✅ 已设置' : '❌ 未设置');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少必要的环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('\n🔍 测试数据库连接...');
    
    // 简单的查询测试
    const { data, error, count } = await supabase
      .from('tools')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('❌ 连接错误:', error);
      return false;
    }
    
    console.log('✅ 连接成功!');
    console.log('📊 数据库中现有工具数量:', count || 0);
    return true;
    
  } catch (err) {
    console.error('❌ 连接异常:', err);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n✅ 测试完成 - 连接正常');
  } else {
    console.log('\n❌ 测试失败 - 连接异常');
    process.exit(1);
  }
});