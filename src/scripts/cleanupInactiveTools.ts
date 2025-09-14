#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  console.error('请确保在 .env.local 文件中设置了：');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface InactiveTool {
  id: string;
  name: string;
  website: string;
  status: string;
}

// 数据库清理函数
async function cleanupInactiveTools(dryRun: boolean = false): Promise<void> {
  console.log('🧹 开始数据库清理...');
  
  try {
    // 1. 首先查询所有状态为 inactive 的工具
    console.log('📋 查询 inactive 状态的工具...');
    const { data: inactiveTools, error: queryError } = await supabase
      .from('tools')
      .select('id, name, website, status')
      .eq('status', 'inactive');

    if (queryError) {
      throw new Error(`查询失败: ${queryError.message}`);
    }

    if (!inactiveTools || inactiveTools.length === 0) {
      console.log('✅ 没有找到需要清理的 inactive 工具');
      return;
    }

    console.log(`🎯 找到 ${inactiveTools.length} 个 inactive 工具:`);
    
    // 2. 显示要删除的工具列表
    inactiveTools.forEach((tool: InactiveTool, index: number) => {
      console.log(`   ${index + 1}. ${tool.name} (${tool.id})`);
      console.log(`      网站: ${tool.website}`);
      console.log(`      状态: ${tool.status}`);
      console.log('');
    });

    if (dryRun) {
      console.log('🔍 预览模式 - 不会实际删除数据');
      console.log(`💡 运行以下命令执行实际清理:`);
      console.log('   npm run cleanup-inactive-tools');
      return;
    }

    // 3. 确认删除
    console.log('⚠️  警告: 即将永久删除这些工具记录！');
    console.log('⏱️  等待 3 秒后开始删除...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 4. 批量删除
    console.log('🗑️  开始删除 inactive 工具...');
    
    let deletedCount = 0;
    let errorCount = 0;
    
    for (const tool of inactiveTools) {
      try {
        const { error: deleteError } = await supabase
          .from('tools')
          .delete()
          .eq('id', tool.id);

        if (deleteError) {
          console.error(`❌ 删除失败 ${tool.name} (${tool.id}): ${deleteError.message}`);
          errorCount++;
        } else {
          console.log(`✅ 已删除: ${tool.name} (${tool.id})`);
          deletedCount++;
        }
      } catch (error: any) {
        console.error(`❌ 删除异常 ${tool.name} (${tool.id}): ${error.message}`);
        errorCount++;
      }

      // 短暂延迟以避免过于频繁的请求
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 5. 汇总结果
    console.log('\n📊 清理结果:');
    console.log(`✅ 成功删除: ${deletedCount} 个工具`);
    console.log(`❌ 删除失败: ${errorCount} 个工具`);
    console.log(`📈 清理率: ${((deletedCount / inactiveTools.length) * 100).toFixed(1)}%`);

    if (deletedCount > 0) {
      console.log('\n🎉 数据库清理完成！');
      console.log('💡 建议: 运行一次完整的死链检测来确保数据质量');
      console.log('   npm run check-dead-links');
    }

  } catch (error: any) {
    console.error('❌ 清理过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 获取当前数据库统计
async function getDatabaseStats(): Promise<void> {
  console.log('📊 获取数据库统计信息...\n');

  try {
    // 总工具数
    const { count: totalCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });

    // Active 工具数
    const { count: activeCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Inactive 工具数
    const { count: inactiveCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'inactive');

    // 没有状态的工具数
    const { count: noStatusCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .is('status', null);

    console.log('📈 当前数据库状态:');
    console.log(`   总工具数: ${totalCount || 0}`);
    console.log(`   ✅ Active: ${activeCount || 0}`);
    console.log(`   ❌ Inactive: ${inactiveCount || 0}`);
    console.log(`   ⚪ 无状态: ${noStatusCount || 0}`);
    
    if (totalCount && totalCount > 0) {
      const activeRate = ((activeCount || 0) / totalCount * 100).toFixed(1);
      const inactiveRate = ((inactiveCount || 0) / totalCount * 100).toFixed(1);
      console.log(`   📊 活跃率: ${activeRate}%`);
      console.log(`   📊 失效率: ${inactiveRate}%`);
    }

  } catch (error: any) {
    console.error('❌ 获取统计信息失败:', error.message);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run') || args.includes('--preview');
  const isStatsOnly = args.includes('--stats');

  if (isStatsOnly) {
    await getDatabaseStats();
    return;
  }

  // 显示当前统计
  await getDatabaseStats();
  console.log('');

  // 执行清理
  await cleanupInactiveTools(isDryRun);
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

export { cleanupInactiveTools, getDatabaseStats };
