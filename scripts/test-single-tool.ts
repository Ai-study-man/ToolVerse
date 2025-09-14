import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 使用主脚本的extractPricing函数
import { extractPricing } from './fetch-pricing';

async function testSingleTool() {
  console.log('🧪 测试单个工具的价格提取...\n');
  
  // 获取一个Unknown pricing的工具
  const { data, error } = await supabase
    .from('tools')
    .select('id, name, website, pricing')
    .eq('pricing', 'Unknown')
    .not('website', 'is', null)
    .limit(1);
    
  if (error || !data || data.length === 0) {
    console.error('❌ 无法获取测试工具');
    return;
  }
  
  const tool = data[0];
  console.log(`📋 测试工具: ${tool.name}`);
  console.log(`🌐 网站: ${tool.website}`);
  console.log(`💰 当前pricing: ${tool.pricing}\n`);
  
  try {
    console.log('🔍 正在获取网页内容...');
    const response = await axios.get(tool.website, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log(`✅ 成功获取HTML内容 (${response.data.length} 字符)`);
    
    // 提取价格信息
    console.log('\n💡 分析价格信息...');
    const result = extractPricing(response.data, tool.website);
    
    console.log(`\n📊 分析结果:`);
    console.log(`   推断的pricing: ${result.pricing}`);
    console.log(`   置信度: ${result.confidence}`);
    console.log(`   推断原因: ${result.reason}`);
    console.log(`   找到的价格: ${result.foundPrices.join(', ') || '无'}`);
    console.log(`   找到的关键词: ${result.foundKeywords.slice(0, 10).join(', ') || '无'}`);
    
    // 如果置信度高或中等，提示是否会更新
    if ((result.confidence === 'high' || (result.confidence === 'medium' && result.pricing !== 'unknown')) 
        && result.pricing !== tool.pricing) {
      console.log(`\n✅ 此工具将被更新为: ${result.pricing}`);
    } else {
      console.log(`\n⏭️  此工具将保持不变 (置信度: ${result.confidence})`);
    }
    
  } catch (error) {
    console.error(`❌ 获取或分析失败:`, error instanceof Error ? error.message : String(error));
  }
}

testSingleTool();