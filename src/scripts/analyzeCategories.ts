import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function analyzeCategories() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log('🔍 分析 Supabase 中的工具分类...\n');

  // 获取所有工具的分类
  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name, category');

  if (error) {
    console.error('❌ 查询失败:', error);
    return;
  }

  // 统计分类
  const categoryCount: Record<string, number> = {};
  tools?.forEach(tool => {
    if (tool.category) {
      categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1;
    }
  });

  // 显示结果
  console.log('=== 实际分类分布 ===');
  Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`${category}: ${count} 个工具`);
    });

  console.log(`\n📊 总计: ${Object.keys(categoryCount).length} 个分类, ${tools?.length} 个工具`);

  // 显示前10个工具的详细信息
  console.log('\n=== 前10个工具示例 ===');
  tools?.slice(0, 10).forEach(tool => {
    console.log(`${tool.name} - ${tool.category}`);
  });
}

if (require.main === module) {
  analyzeCategories().catch(console.error);
}
