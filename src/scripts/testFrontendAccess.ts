import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

async function testFrontendAccess() {
  console.log('🧪 测试前端 Supabase 访问权限...\n');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ 环境变量未配置');
    return;
  }
  
  // 创建前端客户端（使用匿名密钥）
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    console.log('1️⃣ 测试基本连接...');
    
    // 测试 1: 简单查询
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name')
      .limit(5);
    
    if (toolsError) {
      console.log('❌ 工具查询失败:', toolsError.message);
    } else {
      console.log(`✅ 工具查询成功! 找到 ${tools?.length || 0} 个工具:`);
      tools?.forEach(tool => console.log(`   - ${tool.name} (ID: ${tool.id})`));
    }
    
    // 测试 2: 计数查询
    console.log('\n2️⃣ 测试计数查询...');
    const { count, error: countError } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ 计数查询失败:', countError.message);
    } else {
      console.log(`✅ 计数查询成功! 总共有 ${count} 个工具`);
    }
    
    // 测试 3: 分类查询
    console.log('\n3️⃣ 测试分类查询...');
    const { data: categories, error: catError } = await supabase
      .from('tools')
      .select('category')
      .not('category', 'is', null);
    
    if (catError) {
      console.log('❌ 分类查询失败:', catError.message);
    } else {
      const uniqueCategories = Array.from(new Set(categories?.map(c => c.category)));
      console.log(`✅ 分类查询成功! 找到 ${uniqueCategories.length} 个分类:`);
      uniqueCategories.slice(0, 5).forEach(cat => console.log(`   - ${cat}`));
    }
    
  } catch (error) {
    console.error('🚫 测试过程出错:', error);
  }
}

// 运行测试
if (require.main === module) {
  testFrontendAccess().catch(console.error);
}
