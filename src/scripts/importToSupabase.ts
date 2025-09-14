import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Tool } from '../types';

// 加载环境变量
require('dotenv').config({ path: '.env.local' });

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // 需要服务端密钥

console.log('🔍 环境变量检查:');
console.log(`   SUPABASE_URL: ${supabaseUrl ? '✓ 已设置' : '❌ 未设置'}`);
console.log(`   SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✓ 已设置' : '❌ 未设置'}`);
interface ImportLog {
  timestamp: string;
  totalTools: number;
  successCount: number;
  errorCount: number;
  newToolsCount?: number;
  updatedToolsCount?: number;
  errors: Array<{
    name: string;
    website: string;
    error: string;
    batchNumber: number;
  }>;
}

// 写入错误日志
function writeErrorLog(log: ImportLog) {
  const errorLogPath = path.join(process.cwd(), 'error.log');
  const logContent = [
    `=== Supabase 导入日志 - ${log.timestamp} ===`,
    `总工具数: ${log.totalTools}`,
    `成功插入: ${log.successCount}`,
    `新增工具: ${log.newToolsCount || 0}`,
    `更新工具: ${log.updatedToolsCount || 0}`,
    `失败数量: ${log.errorCount}`,
    '',
    '错误详情:',
    ...log.errors.map(error => 
      `[批次 ${error.batchNumber}] ${error.name} (${error.website}) - ${error.error}`
    ),
    '',
    '============================================',
    ''
  ].join('\n');
  
  fs.appendFileSync(errorLogPath, logContent, 'utf8');
  console.log(`📝 错误日志已写入: ${errorLogPath}`);
}

// 检查环境变量（仅在非 dry-run 模式）
function checkEnvironmentVariables(dryRun: boolean = false) {
  if (dryRun) {
    console.log('🔍 DRY RUN 模式 - 跳过环境变量检查');
    return;
  }
  
  if (!supabaseUrl) {
    console.error('❌ 请配置 NEXT_PUBLIC_SUPABASE_URL 环境变量');
    console.error('   当前值:', supabaseUrl);
    process.exit(1);
  }
  
  if (!supabaseServiceKey) {
    console.warn('⚠️  未找到 SUPABASE_SERVICE_ROLE_KEY，尝试使用 anon 密钥...');
    console.warn('   注意：anon 密钥可能权限不足，建议使用 service_role 密钥');
  }
}

// 尝试使用 service_role 密钥，如果没有则使用 anon 密钥
const actualKey = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && actualKey ? createClient(supabaseUrl, actualKey) : null;

// 批量插入工具到Supabase
async function insertToolsToSupabase(tools: Tool[], batchSize: number = 50, dryRun: boolean = false): Promise<void> {
  console.log(`📊 准备${dryRun ? '模拟' : ''}插入 ${tools.length} 个工具到 Supabase`);
  
  if (dryRun) {
    console.log('\n🔍 DRY RUN 模式 - 不会真实写入数据库\n');
    
    // 显示前5条记录预览
    console.log('📋 前 5 条即将插入的记录预览:');
    tools.slice(0, 5).forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.name}`);
      console.log(`      网站: ${tool.website}`);
      console.log(`      分类: ${tool.category} | 定价: ${tool.pricingModel}`);
      console.log(`      ID: ${tool.id}`);
      console.log('');
    });
    
    // 准备数据转换示例
    const sampleDbData = tools.slice(0, 2).map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      short_description: tool.shortDescription,
      logo: tool.logo,
      website: tool.website,
      category: tool.category,
      subcategory: tool.subcategory,
      pricing_model: tool.pricingModel,
      pricing: tool.pricing,
      pricing_tiers: tool.pricingTiers ? JSON.stringify(tool.pricingTiers) : null,
      contact_pricing: tool.contactPricing ? JSON.stringify(tool.contactPricing) : null,
      rating: tool.rating,
      review_count: tool.reviewCount,
      tags: tool.tags,
      features: tool.features,
      use_cases: tool.useCases,
      model_used: tool.modelUsed,
      created_at: tool.createdAt,
      likes: tool.likes || 0,
      views: tool.views || 0,
      developer: tool.developer,
      reviews: tool.reviews ? JSON.stringify(tool.reviews) : null,
      last_updated: tool.lastUpdated || tool.createdAt
    }));
    
    console.log('🔄 数据库字段映射示例（前2条记录）:');
    sampleDbData.forEach((record, index) => {
      console.log(`\n   记录 ${index + 1}:`);
      console.log(`     id: ${record.id}`);
      console.log(`     name: ${record.name}`);
      console.log(`     short_description: ${record.short_description.substring(0, 50)}...`);
      console.log(`     category: ${record.category}`);
      console.log(`     pricing_model: ${record.pricing_model}`);
      console.log(`     rating: ${record.rating.toFixed(2)}`);
      console.log(`     tags: [${record.tags.slice(0, 3).join(', ')}${record.tags.length > 3 ? '...' : ''}]`);
    });
    
    // 统计信息
    const categoryStats = tools.reduce((acc, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const pricingStats = tools.reduce((acc, tool) => {
      acc[tool.pricingModel] = (acc[tool.pricingModel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📊 导入统计预览:');
    console.log(`   总工具数: ${tools.length}`);
    console.log(`   计划批次数: ${Math.ceil(tools.length / batchSize)}`);
    console.log(`   每批数量: ${batchSize}`);
    
    console.log('\n📈 分类分布:');
    Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`     ${category}: ${count} 个工具`);
      });
    
    console.log('\n💰 定价模式分布:');
    Object.entries(pricingStats).forEach(([model, count]) => {
      console.log(`     ${model}: ${count} 个工具`);
    });
    
    console.log('\n✅ DRY RUN 完成 - 如果数据看起来正确，请移除 --dry-run 参数进行真实导入');
    return;
  }
  
  let successCount = 0;
  let errorCount = 0;
  let newToolsCount = 0;
  let updatedToolsCount = 0;
  const errors: Array<{
    name: string;
    website: string;
    error: string;
    batchNumber: number;
  }> = [];
  
  const startTime = new Date();
  const totalBatches = Math.ceil(tools.length / batchSize);
  
  console.log(`📊 准备插入 ${tools.length} 个工具到 Supabase`);
  console.log(`📦 计划分为 ${totalBatches} 个批次，每批最多 ${batchSize} 个工具`);
  console.log(`⏱️  开始时间: ${startTime.toLocaleTimeString()}\n`);
  
  // 分批处理
  for (let i = 0; i < tools.length; i += batchSize) {
    const batch = tools.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const currentProgress = Math.min(i + batchSize, tools.length);
    const progressPercentage = Math.round((currentProgress / tools.length) * 100);
    const elapsedTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
    
    console.log(`\n📦 批次 ${batchNumber}/${totalBatches} | 进度: ${currentProgress}/${tools.length} (${progressPercentage}%) | 用时: ${elapsedTime}s`);
    console.log(`   正在处理: ${batch.length} 个工具...`);
    
    try {
      // 准备数据 - 只包含基本字段，避免不存在的字段
      const dbData = batch.map(tool => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        short_description: tool.shortDescription,
        logo: tool.logo,
        website: tool.website,
        category: tool.category,
        pricing_model: tool.pricingModel,
        pricing: tool.pricing,
        rating: tool.rating,
        review_count: tool.reviewCount,
        tags: tool.tags,
        features: tool.features,
        created_at: tool.createdAt,
        likes: tool.likes || 0,
        views: tool.views || 0,
        last_updated: tool.lastUpdated || tool.createdAt,
        verified: false,
        popular: false
      }));
      
      // 使用 upsert 进行增量更新，以 website 作为唯一键
      if (!supabase) {
        throw new Error('Supabase 客户端未初始化');
      }
      
      // 首先检查哪些工具已存在
      const websites = dbData.map(tool => tool.website);
      const { data: existingTools, error: checkError } = await supabase
        .from('tools')
        .select('website, id, name, last_updated')
        .in('website', websites);
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found (正常情况)
        console.warn(`   ⚠️  检查现有工具时出现警告: ${checkError.message}`);
      }
      
      const existingWebsites = new Set((existingTools || []).map(tool => tool.website));
      const newTools = dbData.filter(tool => !existingWebsites.has(tool.website));
      const updatingTools = dbData.filter(tool => existingWebsites.has(tool.website));
      
      console.log(`   📊 分析: ${newTools.length} 个新工具, ${updatingTools.length} 个更新工具`);
      
      // 执行 upsert 操作
      const { data, error } = await supabase
        .from('tools')
        .upsert(dbData, { 
          onConflict: 'website', // 使用 website 作为冲突检测字段
          ignoreDuplicates: false 
        })
        .select('id, website, name');
      
      if (error) {
        throw error;
      }
      
      successCount += batch.length;
      newToolsCount += newTools.length;
      updatedToolsCount += updatingTools.length;
      
      const batchElapsedTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
      const avgTimePerBatch = batchElapsedTime / batchNumber;
      const estimatedTotalTime = Math.round(avgTimePerBatch * totalBatches);
      const remainingTime = Math.max(0, estimatedTotalTime - batchElapsedTime);
      
      console.log(`   ✅ 成功处理 ${batch.length} 个工具 (新增: ${newTools.length}, 更新: ${updatingTools.length})`);
      console.log(`   📈 累计: 成功 ${successCount}/${tools.length} | 新增 ${newToolsCount} | 更新 ${updatedToolsCount}`);
      console.log(`   ⏱️  预计剩余时间: ${remainingTime}s | 预计总用时: ${estimatedTotalTime}s`);
      
      // 避免请求过于频繁
      if (i + batchSize < tools.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      console.error(`❌ 批次 ${batchNumber} 插入失败:`, error);
      errorCount += batch.length;
      
      // 记录每个工具的错误
      batch.forEach(tool => {
        errors.push({
          name: tool.name,
          website: tool.website,
          error: String(error),
          batchNumber
        });
      });
      
      // 如果是连接错误，等待更长时间再重试
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message.toLowerCase();
        if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
          console.log('⏳ 网络错误，等待 5 秒后继续...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }
  }
  
  console.log(`\n📊 导入完成统计:`);
  console.log(`   ✅ 成功: ${successCount} 个`);
  console.log(`   🆕 新增: ${newToolsCount} 个`);
  console.log(`   🔄 更新: ${updatedToolsCount} 个`);
  console.log(`   ❌ 失败: ${errorCount} 个`);
  console.log(`   ⏱️  总用时: ${Math.round((new Date().getTime() - startTime.getTime()) / 1000)} 秒`);
  
  // 写入日志
  const importLog: ImportLog = {
    timestamp: new Date().toISOString(),
    totalTools: tools.length,
    successCount,
    errorCount,
    newToolsCount,
    updatedToolsCount,
    errors
  };
  
  if (errors.length > 0) {
    console.log(`\n❌ 错误详情:`);
    errors.slice(0, 5).forEach(error => 
      console.log(`   - ${error.name}: ${error.error.substring(0, 100)}...`)
    );
    
    if (errors.length > 5) {
      console.log(`   ... 还有 ${errors.length - 5} 个错误，详见 error.log`);
    }
    
    writeErrorLog(importLog);
  } else {
    console.log(`\n🎉 所有工具都成功导入！`);
  }
}

// 从JSON文件读取工具数据
function loadToolsFromJson(filePath: string): Tool[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const tools = JSON.parse(content) as Tool[];
  
  if (!Array.isArray(tools)) {
    throw new Error('JSON文件格式错误，应该是Tool数组');
  }
  
  return tools;
}

// 检查Supabase连接和表结构
async function checkSupabaseConnection(): Promise<void> {
  try {
    console.log('🔍 检查 Supabase 连接...');
    
    if (!supabase) {
      throw new Error('Supabase 客户端未初始化');
    }
    
    // 测试连接
    const { error, count } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('详细错误信息:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log('✅ Supabase 连接正常');
    console.log(`📊 当前表中有 ${count || 0} 条记录`);
    
  } catch (error) {
    console.error('❌ Supabase 连接失败:', error);
    throw error;
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const jsonFilePath = args.find(arg => !arg.startsWith('--')) || path.join(process.cwd(), 'data', 'ai-collection-tools.json');
  
  try {
    // 检查环境变量
    checkEnvironmentVariables(dryRun);
    
    if (!dryRun) {
      // 只有在非dry-run模式才检查连接
      await checkSupabaseConnection();
    } else {
      console.log('🔍 DRY RUN 模式 - 跳过 Supabase 连接检查');
    }
    
    // 加载数据
    console.log(`📂 从文件加载数据: ${jsonFilePath}`);
    const tools = loadToolsFromJson(jsonFilePath);
    console.log(`📊 加载了 ${tools.length} 个工具`);
    
    if (dryRun) {
      // DRY RUN 模式
      await insertToolsToSupabase(tools, 50, true);
    } else {
      // 真实导入模式 - 确认是否继续
      console.log('\n⚠️  即将开始导入数据到 Supabase。');
      console.log('   这将会向 tools 表中插入/更新数据。');
      console.log('   如果确认继续，请按 Ctrl+C 取消或等待 5 秒自动开始...\n');
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // 开始导入
      await insertToolsToSupabase(tools, 50, false);
      
      console.log('\n🎉 导入完成！');
    }
    
  } catch (error) {
    console.error('❌ 导入过程失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  // 加载环境变量
  require('dotenv').config({ path: '.env.local' });
  main().catch(console.error);
}

export { insertToolsToSupabase, loadToolsFromJson };
