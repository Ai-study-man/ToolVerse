#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { checkWebsite } from './deadLinkCheckerFixed';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// 使用 Service Role Key，拥有完整数据库权限
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  console.error('请确保在 .env.local 文件中设置了：');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 使用 Service Role 客户端，拥有完整权限
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

// 超级清理模式：直接删除死链工具
async function superDeleteDeadLinkTools(dryRun: boolean = true): Promise<void> {
  console.log('🚀 超级清理模式启动...');
  console.log(`🔧 权限: Service Role (完整数据库权限)`);
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

  // 2. 筛选需要检查的工具（保护真实网站）
  const realSites = [
    'openai.com', 'github.com', 'anthropic.com', 'google.com', 'microsoft.com',
    'grammarly.com', 'jasper.ai', 'midjourney.com', 'notion.so', 'runwayml.com',
    'stability.ai', 'loom.com', 'huggingface.co', 'replicate.com', 'vercel.com',
    'figma.com', 'canva.com', 'adobe.com', 'meta.com', 'deepl.com'
  ];

  const toolsToCheck = tools.filter(tool => {
    const isRealSite = realSites.some(site => tool.website?.includes(site));
    return !isRealSite && tool.website;
  });

  const protectedTools = tools.filter(tool => {
    const isRealSite = realSites.some(site => tool.website?.includes(site));
    return isRealSite;
  });

  console.log(`🔍 需要检查的工具: ${toolsToCheck.length} 个`);
  console.log(`🛡️  受保护的真实网站: ${protectedTools.length} 个`);

  // 3. 快速检测模式（并发更高）
  console.log('\n🔍 快速死链检测...');
  const deadTools: DatabaseTool[] = [];
  const batchSize = 10; // 增加并发数

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

    // 减少等待时间，加快处理
    if (i + batchSize < toolsToCheck.length) {
      console.log('⏳ 等待0.5秒...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // 4. 统计结果
  console.log('\n📊 检测结果统计:');
  console.log(`   ✅ 正常工具: ${toolsToCheck.length - deadTools.length}`);
  console.log(`   ❌ 死链工具: ${deadTools.length}`);
  console.log(`   🛡️  受保护工具: ${protectedTools.length}`);

  if (deadTools.length === 0) {
    console.log('\n🎉 没有发现死链工具！');
    return;
  }

  // 5. 显示死链列表（只显示前20个）
  console.log('\n💀 发现的死链工具（前20个）:');
  deadTools.slice(0, 20).forEach((tool, i) => {
    console.log(`   ${i + 1}. ${tool.name}: ${tool.website}`);
  });
  
  if (deadTools.length > 20) {
    console.log(`   ... 还有 ${deadTools.length - 20} 个死链工具`);
  }

  // 6. 超级删除操作
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
    console.log('\n🗑️  开始超级删除模式...');
    console.log('💪 使用 Service Role 权限，绕过所有限制');
    
    // 批量删除以提高效率
    const deleteIds = deadTools.map(tool => tool.id);
    
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .in('id', deleteIds);

      if (error) {
        console.error(`❌ 批量删除失败: ${error.message}`);
        
        // 如果批量删除失败，尝试逐个删除
        console.log('🔄 尝试逐个删除...');
        for (const tool of deadTools) {
          try {
            const { error: singleError } = await supabase
              .from('tools')
              .delete()
              .eq('id', tool.id);

            if (singleError) {
              console.error(`❌ 删除失败: ${tool.name} - ${singleError.message}`);
              deleteResults.push({
                id: tool.id,
                name: tool.name,
                website: tool.website || '',
                reason: `删除失败: ${singleError.message}`,
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
      } else {
        // 批量删除成功
        console.log(`✅ 批量删除成功！删除了 ${deadTools.length} 个死链工具`);
        deadTools.forEach(tool => {
          deleteResults.push({
            id: tool.id,
            name: tool.name,
            website: tool.website || '',
            reason: '死链检测失败',
            deleted: true
          });
        });
      }
    } catch (error: any) {
      console.error(`❌ 删除过程异常: ${error.message}`);
    }
  }

  // 7. 生成删除报告
  await generateDeleteReport(deleteResults, dryRun);

  // 8. 最终统计
  const deletedCount = deleteResults.filter(r => r.deleted).length;
  const failedCount = deleteResults.length - deletedCount;

  console.log('\n📊 最终统计:');
  if (dryRun) {
    console.log(`   📋 预览删除: ${deleteResults.length} 个工具`);
    console.log('   💡 使用 --delete 参数执行实际删除');
  } else {
    console.log(`   ✅ 成功删除: ${deletedCount} 个工具`);
    console.log(`   ❌ 删除失败: ${failedCount} 个工具`);
    console.log(`   🛡️  保留的真实工具: ${protectedTools.length} 个`);
    
    if (deletedCount > 0) {
      console.log('\n🎉 数据库清理完成！现在只剩下真实的AI工具。');
    }
  }

  // 9. 验证清理结果
  if (!dryRun && deletedCount > 0) {
    console.log('\n🔍 验证清理结果...');
    const { data: remainingTools } = await supabase
      .from('tools')
      .select('id, name, website')
      .order('name');

    console.log(`📊 清理后剩余工具: ${remainingTools?.length || 0} 个`);
    
    if (remainingTools && remainingTools.length <= 20) {
      console.log('\n🏆 剩余的工具列表:');
      remainingTools.forEach((tool, i) => {
        console.log(`   ${i + 1}. ${tool.name}: ${tool.website}`);
      });
    }
  }
}

// 生成删除报告
async function generateDeleteReport(results: DeleteResult[], dryRun: boolean): Promise<void> {
  const report = {
    generatedAt: new Date().toISOString(),
    mode: dryRun ? 'preview' : 'super_delete',
    permission: 'service_role',
    totalProcessed: results.length,
    deletedCount: results.filter(r => r.deleted).length,
    failedCount: results.filter(r => !r.deleted).length,
    results: results
  };

  const reportPath = path.join(process.cwd(), 'super_delete_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📄 超级删除报告已生成: ${reportPath}`);
}

// 主函数
async function main() {
  try {
    console.log('🚀 超级死链清理工具');
    console.log('💪 使用 Service Role 权限，可删除任何数据');
    
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

    await superDeleteDeadLinkTools(dryRun);
    console.log('\n🎉 超级清理完成！');

  } catch (error: any) {
    console.error('❌ 超级清理过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

export { superDeleteDeadLinkTools };
