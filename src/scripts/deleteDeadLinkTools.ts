#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { checkWebsite } from './deadLinkCheckerFixed';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DatabaseTool {
  id: string;
  name: string;
  website: string | null;
  status?: 'active' | 'inactive';
}

interface DeleteResult {
  id: string;
  name: string;
  website: string;
  reason: string;
  deleted: boolean;
}

// 检测并删除死链工具
async function deleteDeadLinkTools(dryRun: boolean = true): Promise<void> {
  console.log('🚀 开始死链工具删除流程...');
  console.log(`🔧 模式: ${dryRun ? '预览模式（不会真实删除）' : '实际删除模式'}`);
  
  // 1. 获取所有工具
  console.log('\n📥 获取工具列表...');
  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name, website, status')
    .order('name');

  if (error) {
    throw new Error(`获取工具列表失败: ${error.message}`);
  }

  if (!tools || tools.length === 0) {
    console.log('❌ 没有找到工具数据');
    return;
  }

  console.log(`✅ 获取到 ${tools.length} 个工具`);

  // 2. 筛选需要检查的工具
  const toolsToCheck = tools.filter(tool => {
    // 跳过已知的真实网站
    const realSites = [
      'openai.com', 'github.com', 'anthropic.com', 'google.com', 'microsoft.com',
      'grammarly.com', 'jasper.ai', 'midjourney.com', 'notion.so', 'runwayml.com',
      'stability.ai', 'loom.com'
    ];
    const isRealSite = realSites.some(site => tool.website?.includes(site));
    
    return !isRealSite && tool.website;
  });

  console.log(`🔍 需要检查的工具: ${toolsToCheck.length} 个`);

  // 3. 检测死链
  console.log('\n🔍 开始检测死链...');
  const deadTools: DatabaseTool[] = [];
  const batchSize = 5;

  for (let i = 0; i < toolsToCheck.length; i += batchSize) {
    const batch = toolsToCheck.slice(i, i + batchSize);
    console.log(`\n📋 检查第 ${Math.floor(i / batchSize) + 1} 批 (${i + 1}-${Math.min(i + batchSize, toolsToCheck.length)}/${toolsToCheck.length})`);

    const batchPromises = batch.map(async (tool) => {
      if (!tool.website) return null;

      console.log(`🔍 检查: ${tool.name}`);
      const result = await checkWebsite(tool.website);

      if (!result.success) {
        console.log(`❌ 死链: ${tool.name} - ${result.error}`);
        return tool;
      } else {
        console.log(`✅ 正常: ${tool.name}`);
        return null;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    const deadInBatch = batchResults.filter(tool => tool !== null) as DatabaseTool[];
    deadTools.push(...deadInBatch);

    // 批次间暂停
    if (i + batchSize < toolsToCheck.length) {
      console.log('⏳ 等待2秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // 4. 统计结果
  console.log('\n📊 检测结果统计:');
  console.log(`   ✅ 正常工具: ${toolsToCheck.length - deadTools.length}`);
  console.log(`   ❌ 死链工具: ${deadTools.length}`);

  if (deadTools.length === 0) {
    console.log('\n🎉 没有发现死链工具！');
    return;
  }

  // 5. 显示死链列表
  console.log('\n💀 发现的死链工具:');
  deadTools.forEach((tool, i) => {
    console.log(`   ${i + 1}. ${tool.name}: ${tool.website}`);
  });

  // 6. 删除操作
  const deleteResults: DeleteResult[] = [];

  if (dryRun) {
    console.log('\n🔍 预览模式：以下工具将被删除');
    deadTools.forEach(tool => {
      deleteResults.push({
        id: tool.id,
        name: tool.name,
        website: tool.website || '',
        reason: '死链检测失败',
        deleted: false
      });
    });
  } else {
    console.log('\n🗑️  开始删除死链工具...');
    
    for (const tool of deadTools) {
      try {
        const { error } = await supabase
          .from('tools')
          .delete()
          .eq('id', tool.id);

        if (error) {
          console.error(`❌ 删除失败: ${tool.name} - ${error.message}`);
          deleteResults.push({
            id: tool.id,
            name: tool.name,
            website: tool.website || '',
            reason: `删除失败: ${error.message}`,
            deleted: false
          });
        } else {
          console.log(`✅ 已删除: ${tool.name}`);
          deleteResults.push({
            id: tool.id,
            name: tool.name,
            website: tool.website || '',
            reason: '死链检测失败',
            deleted: true
          });
        }
      } catch (error: any) {
        console.error(`❌ 删除异常: ${tool.name} - ${error.message}`);
        deleteResults.push({
          id: tool.id,
          name: tool.name,
          website: tool.website || '',
          reason: `删除异常: ${error.message}`,
          deleted: false
        });
      }
    }
  }

  // 7. 生成删除报告
  await generateDeleteReport(deleteResults, dryRun);

  // 8. 最终统计
  const deletedCount = deleteResults.filter(r => r.deleted).length;
  const failedCount = deleteResults.length - deletedCount;

  console.log('\n📊 删除统计:');
  if (dryRun) {
    console.log(`   📋 预览删除: ${deleteResults.length} 个工具`);
    console.log('   💡 使用 --delete 参数执行实际删除');
  } else {
    console.log(`   ✅ 成功删除: ${deletedCount} 个工具`);
    console.log(`   ❌ 删除失败: ${failedCount} 个工具`);
  }
}

// 生成删除报告
async function generateDeleteReport(results: DeleteResult[], dryRun: boolean): Promise<void> {
  const report = {
    generatedAt: new Date().toISOString(),
    mode: dryRun ? 'preview' : 'delete',
    totalProcessed: results.length,
    deletedCount: results.filter(r => r.deleted).length,
    failedCount: results.filter(r => !r.deleted).length,
    results: results
  };

  const reportPath = path.join(process.cwd(), 'dead_tools_deletion_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📄 删除报告已生成: ${reportPath}`);
}

// 主函数
async function main() {
  try {
    // 检查命令行参数
    const dryRun = !process.argv.includes('--delete');
    
    if (dryRun) {
      console.log('⚠️  这是预览模式，不会真正删除数据');
      console.log('   使用 --delete 参数执行真正的删除操作');
    } else {
      console.log('🚨 这将真正删除死链工具！');
      console.log('⏳ 3秒后开始...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    await deleteDeadLinkTools(dryRun);
    console.log('\n🎉 死链工具删除流程完成！');

  } catch (error: any) {
    console.error('❌ 删除过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

export { deleteDeadLinkTools };
