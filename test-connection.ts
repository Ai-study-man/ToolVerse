// 测试 Supabase 连接
require('dotenv').config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

async function testConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('测试 Supabase 连接...');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key: ${supabaseKey ? '✓ 已设置' : '❌ 未设置'}`);
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('环境变量未设置');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 测试简单查询
    console.log('执行测试查询...');
    const { data, error, count } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('查询错误:', error);
    } else {
      console.log('✅ 连接成功!');
      console.log(`当前表中有 ${count} 条记录`);
    }
  } catch (err) {
    console.error('连接失败:', err);
  }
}

testConnection();
