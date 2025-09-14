/**
 * 数据库迁移前后对比脚本
 * 分析当前数据库中的分类分布，并预测迁移后的结果
 */

import { createClient } from '@supabase/supabase-js';
import { mapToUnifiedCategory } from '../src/utils/categoryIcons';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('请配置 Supabase 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string | null;
}

async function analyzeCategories() {
  console.log('🔍 分析当前数据库分类分布...\n');

  // 获取所有工具
  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name, description, category')
    .order('name');

  if (error) {
    console.error('获取工具数据失败:', error);
    return;
  }

  if (!tools || tools.length === 0) {
    console.log('❌ 数据库中没有工具数据');
    return;
  }

  console.log(`📊 总共找到 ${tools.length} 个工具\n`);

  // 当前分类统计
  const currentCategoryStats: Record<string, number> = {};
  const newCategoryStats: Record<string, number> = {};
  const migrationMap: Record<string, { tools: Tool[], newCategory: string }> = {};

  tools.forEach(tool => {
    // 当前分类统计
    const currentCategory = tool.category || 'null';
    currentCategoryStats[currentCategory] = (currentCategoryStats[currentCategory] || 0) + 1;

    // 新分类统计
    const newCategory = mapToUnifiedCategory(tool);
    newCategoryStats[newCategory] = (newCategoryStats[newCategory] || 0) + 1;

    // 迁移映射
    if (!migrationMap[currentCategory]) {
      migrationMap[currentCategory] = { tools: [], newCategory: '' };
    }
    migrationMap[currentCategory].tools.push(tool);
    migrationMap[currentCategory].newCategory = newCategory;
  });

  // 显示当前分类分布
  console.log('📈 当前分类分布:');
  console.log('==================');
  Object.entries(currentCategoryStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      const percentage = ((count / tools.length) * 100).toFixed(1);
      console.log(`${category.padEnd(25)} ${count.toString().padStart(3)} 个 (${percentage}%)`);
    });

  console.log('\n');

  // 显示迁移后分类分布
  console.log('🎯 迁移后分类分布 (11大类):');
  console.log('============================');
  Object.entries(newCategoryStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      const percentage = ((count / tools.length) * 100).toFixed(1);
      console.log(`${category.padEnd(25)} ${count.toString().padStart(3)} 个 (${percentage}%)`);
    });

  console.log('\n');

  // 显示详细迁移映射
  console.log('🔄 详细迁移映射:');
  console.log('=================');
  Object.entries(migrationMap)
    .sort(([,a], [,b]) => b.tools.length - a.tools.length)
    .forEach(([originalCategory, { tools: categoryTools, newCategory }]) => {
      console.log(`\n${originalCategory} → ${newCategory}`);
      console.log(`  数量: ${categoryTools.length} 个工具`);
      
      if (categoryTools.length <= 5) {
        // 如果工具少，显示所有
        categoryTools.forEach(tool => {
          console.log(`  - ${tool.name}: ${tool.description?.substring(0, 50)}...`);
        });
      } else {
        // 如果工具多，只显示前3个和后2个
        categoryTools.slice(0, 3).forEach(tool => {
          console.log(`  - ${tool.name}: ${tool.description?.substring(0, 50)}...`);
        });
        console.log(`  ... 还有 ${categoryTools.length - 5} 个工具 ...`);
        categoryTools.slice(-2).forEach(tool => {
          console.log(`  - ${tool.name}: ${tool.description?.substring(0, 50)}...`);
        });
      }
    });

  // 分析变化最大的分类
  console.log('\n📊 变化分析:');
  console.log('=============');
  
  const changes = Object.keys({ ...currentCategoryStats, ...newCategoryStats }).map(category => {
    const before = currentCategoryStats[category] || 0;
    const after = newCategoryStats[category] || 0;
    return { category, before, after, change: after - before };
  });

  const increasingCategories = changes.filter(c => c.change > 0).sort((a, b) => b.change - a.change);
  const decreasingCategories = changes.filter(c => c.change < 0).sort((a, b) => a.change - b.change);

  if (increasingCategories.length > 0) {
    console.log('\n📈 增长的分类:');
    increasingCategories.forEach(({ category, before, after, change }) => {
      console.log(`  ${category}: ${before} → ${after} (+${change})`);
    });
  }

  if (decreasingCategories.length > 0) {
    console.log('\n📉 减少的分类:');
    decreasingCategories.forEach(({ category, before, after, change }) => {
      console.log(`  ${category}: ${before} → ${after} (${change})`);
    });
  }

  // 生成迁移SQL预览
  console.log('\n💾 迁移SQL预览 (前10条):');
  console.log('========================');
  tools.slice(0, 10).forEach(tool => {
    const newCategory = mapToUnifiedCategory(tool);
    if (tool.category !== newCategory) {
      console.log(`UPDATE tools SET category = '${newCategory}' WHERE id = ${tool.id}; -- ${tool.name}`);
    }
  });

  if (tools.length > 10) {
    console.log(`... 还有 ${tools.length - 10} 条更新语句 ...`);
  }

  console.log('\n✅ 分析完成!');
  console.log('\n🔧 要执行迁移，请运行:');
  console.log('   npx tsx scripts/clean-categories.ts');
}

// 运行分析
analyzeCategories().catch(console.error);