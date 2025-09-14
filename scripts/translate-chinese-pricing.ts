import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 中文到英文的价格翻译映射
const priceTranslations: { [key: string]: string } = {
  '通过ChatGPT Plus或API使用': 'Available through ChatGPT Plus or API',
  '基础版$10/月，标准版$30/月，专业版$60/月': 'Basic $10/month, Standard $30/month, Pro $60/month',
  '免费使用有限制，Pro版本$20/月': 'Free with limitations, Pro version $20/month'
};

async function translateChinesePricing() {
  console.log('🔍 查找包含中文的价格信息...\n');

  // 查找所有可能包含中文的价格
  const { data: allTools } = await supabase
    .from('tools')
    .select('id, name, pricing')
    .not('pricing', 'is', null);

  if (!allTools) {
    console.log('未找到工具数据');
    return;
  }

  const chineseTools = allTools.filter(tool => 
    /[\u4e00-\u9fff]/.test(tool.pricing) // 检测中文字符
  );

  console.log(`找到 ${chineseTools.length} 个包含中文价格的工具:`);
  chineseTools.forEach(tool => {
    console.log(`- ${tool.name}: ${tool.pricing}`);
  });

  // 翻译并更新
  console.log('\n🔄 开始翻译更新...');
  let updatedCount = 0;

  for (const tool of chineseTools) {
    const englishPricing = priceTranslations[tool.pricing];
    if (englishPricing) {
      const { error } = await supabase
        .from('tools')
        .update({ pricing: englishPricing })
        .eq('id', tool.id);

      if (error) {
        console.error(`❌ 更新失败 ${tool.name}:`, error.message);
      } else {
        console.log(`✅ 已更新 ${tool.name}: ${tool.pricing} → ${englishPricing}`);
        updatedCount++;
      }
    } else {
      console.log(`⚠️  未找到翻译 ${tool.name}: ${tool.pricing}`);
    }
  }

  console.log(`\n🎉 更新完成！共更新了 ${updatedCount} 个工具的价格信息`);
}

translateChinesePricing().catch(console.error);