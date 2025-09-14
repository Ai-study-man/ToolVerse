import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkChinesePricing() {
  console.log('🔍 检查中文价格信息...\n');

  // 检查DALL-E 3和Midjourney的价格
  const { data } = await supabase
    .from('tools')
    .select('name, pricing')
    .in('name', ['DALL-E 3', 'Midjourney']);

  if (data) {
    console.log('当前价格信息:');
    data.forEach(tool => {
      console.log(`${tool.name}: ${tool.pricing}`);
    });
  }

  // 查找包含中文的pricing字段
  console.log('\n🔍 查找包含中文字符的价格信息...');
  const { data: chineseTools } = await supabase
    .from('tools')
    .select('name, pricing')
    .like('pricing', '%通过%')
    .or('pricing.like.%基础%,pricing.like.%标准%,pricing.like.%专业%,pricing.like.%月%,pricing.like.%免费%');

  if (chineseTools && chineseTools.length > 0) {
    console.log('找到包含中文的价格信息:');
    chineseTools.forEach(tool => {
      console.log(`- ${tool.name}: ${tool.pricing}`);
    });
  }
}

checkChinesePricing().catch(console.error);