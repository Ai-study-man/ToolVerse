import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkUpdatedTools() {
  console.log('🔍 检查更新后的工具价格样例...\n');

  // 查看一些具体的更新案例
  const { data } = await supabase
    .from('tools')
    .select('id, name, pricing, website')
    .in('name', ['Kosmik', 'Notion AI', 'Jasper', 'Taskade', 'copy.ai', 'Moonbeam', 'Lavender'])
    .limit(10);

  if (data) {
    console.log('📋 更新后的工具价格样例:');
    data.forEach(tool => {
      console.log(`- ${tool.name}: ${tool.pricing}`);
    });
  }

  console.log('\n📊 查看freemium工具...');
  const { data: freemiumTools } = await supabase
    .from('tools')
    .select('name, pricing')
    .eq('pricing', 'freemium')
    .limit(5);

  if (freemiumTools) {
    freemiumTools.forEach(tool => {
      console.log(`- ${tool.name}: ${tool.pricing}`);
    });
  }

  console.log('\n💰 查看有具体价格的工具...');
  const { data: pricedTools } = await supabase
    .from('tools')
    .select('name, pricing')
    .like('pricing', '$%')
    .limit(5);

  if (pricedTools) {
    pricedTools.forEach(tool => {
      console.log(`- ${tool.name}: ${tool.pricing}`);
    });
  }
}

checkUpdatedTools().catch(console.error);