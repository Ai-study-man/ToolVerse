import { createClient } from '@supabase/supabase-js';
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkUnknownPricing() {
  console.log('🔍 检查数据库中pricing为Unknown的工具...\n');
  
  const { data, error } = await supabase
    .from('tools')
    .select('id, name, website, pricing')
    .eq('pricing', 'Unknown')
    .not('website', 'is', null)
    .limit(10);
    
  if (error) {
    console.error('❌ 查询失败:', error);
    return;
  }
  
  console.log(`找到 ${data?.length || 0} 个pricing为Unknown且有website的工具 (显示前10个):\n`);
  
  data?.forEach((tool, index) => {
    console.log(`${index + 1}. ${tool.name}`);
    console.log(`   ID: ${tool.id}`);
    console.log(`   网站: ${tool.website}`);
    console.log(`   当前pricing: ${tool.pricing}`);
    console.log('');
  });
  
  // 获取总体pricing分布
  console.log('📊 获取总体pricing分布...');
  const { data: allData } = await supabase
    .from('tools')
    .select('pricing')
    .not('pricing', 'is', null);
    
  const pricingCounts: Record<string, number> = {};
  allData?.forEach(tool => {
    pricingCounts[tool.pricing] = (pricingCounts[tool.pricing] || 0) + 1;
  });
  
  console.log('\n当前pricing分布:');
  Object.entries(pricingCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([pricing, count]) => {
      console.log(`  ${pricing}: ${count} 个工具`);
    });
}

checkUnknownPricing();