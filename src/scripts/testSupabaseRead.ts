import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log('🔍 环境变量检查:');
console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ 已设置' : '❌ 未设置'}`);
console.log(`   SERVICE_ROLE_KEY: ${supabaseKey ? '✅ 已设置' : '❌ 未设置'}`);

// 创建 Supabase 客户端（使用 Service Role Key 以确保有足够权限）
const supabase = createClient(supabaseUrl, supabaseKey);

interface Tool {
  id: string;
  name: string;
  category: string;
  pricing: string;
  description?: string;
  website?: string;
  features?: string[];
  tags?: string[];
  logo?: string;
}

async function testSupabaseRead() {
  try {
    console.log('\n📡 测试 Supabase 连接和数据读取...');
    
    // 1. 测试连接
    const { data: connectionTest, error: connectionError } = await supabase
      .from('tools')
      .select('count')
      .limit(1);
      
    if (connectionError) {
      console.error('❌ 连接失败:', connectionError);
      return;
    }
    
    console.log('✅ Supabase 连接成功');
    
    // 2. 获取前 5 个工具
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, category, pricing, description, website, features, tags, logo')
      .limit(5);
    
    if (error) {
      console.error('❌ 数据查询失败:', error);
      return;
    }
    
    if (!tools || tools.length === 0) {
      console.log('⚠️  没有找到任何工具数据');
      return;
    }
    
    console.log(`\n📊 成功获取 ${tools.length} 个工具:`);
    console.log('=' .repeat(80));
    
    tools.forEach((tool: Tool, index: number) => {
      console.log(`\n🔧 工具 ${index + 1}:`);
      console.log(`   📝 名称: ${tool.name}`);
      console.log(`   📂 分类: ${tool.category}`);
      console.log(`   💰 定价: ${tool.pricing}`);
      console.log(`   📄 描述: ${tool.description?.substring(0, 100)}${tool.description && tool.description.length > 100 ? '...' : ''}`);
      console.log(`   🌐 网站: ${tool.website || 'N/A'}`);
      console.log(`   🏷️  标签: ${tool.tags?.join(', ') || 'N/A'}`);
      console.log(`   ⭐ 功能: ${tool.features?.slice(0, 3).join(', ') || 'N/A'}${tool.features && tool.features.length > 3 ? '...' : ''}`);
      console.log(`   🖼️  Logo: ${tool.logo ? '✅ 有' : '❌ 无'}`);
    });
    
    // 3. 测试按分类查询
    console.log('\n📊 按分类统计:');
    const { data: categoryStats, error: categoryError } = await supabase
      .from('tools')
      .select('category')
      .limit(1000);
      
    if (categoryError) {
      console.error('❌ 分类统计失败:', categoryError);
    } else if (categoryStats) {
      const categoryCount = categoryStats.reduce((acc: Record<string, number>, tool: any) => {
        acc[tool.category] = (acc[tool.category] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(categoryCount)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 10)
        .forEach(([category, count]) => {
          console.log(`   📂 ${category}: ${count} 个工具`);
        });
    }
    
    // 4. 测试定价模型分布
    console.log('\n💰 定价模型分布:');
    const { data: pricingStats, error: pricingError } = await supabase
      .from('tools')
      .select('pricing')
      .limit(1000);
      
    if (pricingError) {
      console.error('❌ 定价统计失败:', pricingError);
    } else if (pricingStats) {
      const pricingCount = pricingStats.reduce((acc: Record<string, number>, tool: any) => {
        acc[tool.pricing] = (acc[tool.pricing] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(pricingCount)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .forEach(([pricing, count]) => {
          console.log(`   💳 ${pricing}: ${count} 个工具`);
        });
    }
    
    console.log('\n🎉 数据读取测试完成！前端应该能够正常显示这些数据。');
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error);
  }
}

// 运行测试
if (require.main === module) {
  testSupabaseRead().catch(console.error);
}

export { testSupabaseRead };
