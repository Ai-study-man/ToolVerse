// 检查 Supabase 表结构
require('dotenv').config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

async function checkTableStructure() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('环境变量未设置');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 查询表结构
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: 'tools' })
      .single();
    
    if (error) {
      console.log('使用备用方法查询表结构...');
      // 尝试插入一个空记录来获取字段信息
      const { error: insertError } = await supabase
        .from('tools')
        .insert({});
      
      if (insertError) {
        console.log('表结构错误信息:', insertError);
      }
    } else {
      console.log('表结构:', data);
    }
    
  } catch (err) {
    console.error('查询失败:', err);
  }
}

checkTableStructure();
