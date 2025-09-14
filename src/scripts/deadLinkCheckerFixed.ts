#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { toolToDatabaseUpdate, buildUpdateFields, getUpdateValues } from '../utils/databaseMapping';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// 配置
const CONFIG = {
  TIMEOUT: 8000, // 8秒超时
  CONCURRENT_REQUESTS: 5, // 并发请求数
  MAX_RETRIES: 2, // 重试次数
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

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

// 类型定义
interface DatabaseTool {
  id: string;
  name: string;
  website: string | null;
  status?: 'active' | 'inactive';
}

interface DeadLink {
  id: string;
  name: string;
  website: string;
  error: string;
  statusCode?: number;
  checkedAt: string;
}

interface CheckResult {
  id: string;
  name: string;
  website: string;
  status: 'active' | 'inactive';
  statusCode?: number;
  error?: string;
  responseTime?: number;
}

// 检查单个网站是否可访问
async function checkWebsite(url: string, retries = CONFIG.MAX_RETRIES): Promise<{
  success: boolean;
  statusCode?: number;
  error?: string;
  responseTime?: number;
}> {
  const startTime = Date.now();
  
  try {
    // 标准化URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // 先尝试HEAD请求（更快）
    try {
      const headResponse = await axios.head(normalizedUrl, {
        timeout: CONFIG.TIMEOUT,
        headers: {
          'User-Agent': CONFIG.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 500, // 接受重定向和客户端错误
      });

      const responseTime = Date.now() - startTime;
      
      // 403 可能是反爬虫，但网站实际可用
      if (headResponse.status === 403) {
        console.log(`⚠️  ${url} 返回 403，可能是反爬虫保护，认为网站正常`);
        return { success: true, statusCode: headResponse.status, responseTime };
      }
      
      return { 
        success: headResponse.status < 400, 
        statusCode: headResponse.status, 
        responseTime 
      };
    } catch (headError: any) {
      // HEAD失败，尝试GET请求
      console.log(`HEAD失败，尝试GET请求: ${url}`);
      
      const getResponse = await axios.get(normalizedUrl, {
        timeout: CONFIG.TIMEOUT,
        headers: {
          'User-Agent': CONFIG.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
        maxContentLength: 1024 * 1024, // 限制1MB，避免下载大文件
      });

      const responseTime = Date.now() - startTime;
      
      // 403 可能是反爬虫，但网站实际可用
      if (getResponse.status === 403) {
        console.log(`⚠️  ${url} 返回 403，可能是反爬虫保护，认为网站正常`);
        return { success: true, statusCode: getResponse.status, responseTime };
      }
      
      return { 
        success: getResponse.status < 400, 
        statusCode: getResponse.status, 
        responseTime 
      };
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    // 如果还有重试次数，递归重试
    if (retries > 0) {
      console.log(`重试 ${url} (剩余${retries}次)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒再重试
      return checkWebsite(url, retries - 1);
    }
    
    // 分析错误类型
    let errorMessage = 'Unknown error';
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Domain not found';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection timeout';
    } else if (error.response) {
      errorMessage = `HTTP ${error.response.status}`;
      return { 
        success: false, 
        statusCode: error.response.status, 
        error: errorMessage, 
        responseTime 
      };
    } else {
      errorMessage = error.message || 'Network error';
    }
    
    return { success: false, error: errorMessage, responseTime };
  }
}

// 批量检查工具
async function checkToolsBatch(tools: DatabaseTool[]): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  
  // 并发处理，控制并发数量
  for (let i = 0; i < tools.length; i += CONFIG.CONCURRENT_REQUESTS) {
    const batch = tools.slice(i, i + CONFIG.CONCURRENT_REQUESTS);
    
    console.log(`\n📋 处理第 ${Math.floor(i / CONFIG.CONCURRENT_REQUESTS) + 1} 批 (${i + 1}-${Math.min(i + CONFIG.CONCURRENT_REQUESTS, tools.length)}/${tools.length})`);
    
    const batchPromises = batch.map(async (tool) => {
      if (!tool.website) {
        return {
          id: tool.id,
          name: tool.name,
          website: tool.website || '',
          status: 'inactive' as const,
          error: 'No website provided'
        };
      }

      console.log(`🔍 检查: ${tool.name} (${tool.website})`);
      const result = await checkWebsite(tool.website);
      
      const checkResult: CheckResult = {
        id: tool.id,
        name: tool.name,
        website: tool.website,
        status: result.success ? 'active' : 'inactive',
        statusCode: result.statusCode,
        error: result.error,
        responseTime: result.responseTime
      };

      // 输出结果
      if (result.success) {
        console.log(`✅ ${tool.name}: 正常 (${result.statusCode}) [${result.responseTime}ms]`);
      } else {
        console.log(`❌ ${tool.name}: ${result.error} [${result.responseTime}ms]`);
      }

      return checkResult;
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // 批次间暂停，避免过于频繁的请求
    if (i + CONFIG.CONCURRENT_REQUESTS < tools.length) {
      console.log('⏳ 等待1秒...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// 使用 SQL 更新数据库状态
async function updateDatabaseWithSQL(results: CheckResult[]): Promise<void> {
  console.log('\n💾 使用SQL更新数据库状态...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const result of results) {
    try {
      // 使用原生SQL更新，绕过可能的ORM映射问题
      const { error } = await supabase.rpc('update_tool_status', {
        tool_id: result.id,
        new_status: result.status
      });

      if (error) {
        console.error(`❌ SQL更新失败 ${result.id}:`, error.message);
        errorCount++;
      } else {
        successCount++;
        console.log(`✅ 已更新 ${result.name}: ${result.status}`);
      }
    } catch (error: any) {
      console.error(`❌ SQL更新异常 ${result.id}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 更新统计: 成功 ${successCount}, 失败 ${errorCount}`);
}

// 使用直接SQL更新（备用方案）
async function updateDatabaseDirect(results: CheckResult[]): Promise<void> {
  console.log('\n💾 直接更新数据库状态...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const result of results) {
    try {
      const { error } = await supabase
        .from('tools')
        .update({ status: result.status })
        .eq('id', result.id);

      if (error) {
        console.error(`❌ 更新失败 ${result.id} (${result.name}):`, error.message);
        console.error(`   错误代码: ${error.code}`);
        errorCount++;
      } else {
        successCount++;
        console.log(`✅ 已更新 ${result.name}: ${result.status}`);
      }
    } catch (error: any) {
      console.error(`❌ 更新异常 ${result.id}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 更新统计: 成功 ${successCount}, 失败 ${errorCount}`);
}

// 生成死链报告
async function generateDeadLinksReport(results: CheckResult[]): Promise<void> {
  const deadLinks: DeadLink[] = results
    .filter(result => result.status === 'inactive')
    .map(result => ({
      id: result.id,
      name: result.name,
      website: result.website,
      error: result.error || 'Unknown error',
      statusCode: result.statusCode,
      checkedAt: new Date().toISOString()
    }));

  const report = {
    generatedAt: new Date().toISOString(),
    totalChecked: results.length,
    activeCount: results.filter(r => r.status === 'active').length,
    inactiveCount: deadLinks.length,
    successRate: ((results.filter(r => r.status === 'active').length / results.length) * 100).toFixed(2) + '%',
    deadLinks: deadLinks
  };

  // 保存报告到文件
  const reportPath = path.join(process.cwd(), 'dead_links_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n📄 死链报告已生成:');
  console.log(`   文件: ${reportPath}`);
  console.log(`   总检查: ${report.totalChecked}`);
  console.log(`   正常: ${report.activeCount}`);
  console.log(`   异常: ${report.inactiveCount}`);
  console.log(`   成功率: ${report.successRate}`);
  
  if (deadLinks.length > 0) {
    console.log('\n❌ 发现的死链:');
    deadLinks.forEach(link => {
      console.log(`   • ${link.name}: ${link.website} (${link.error})`);
    });
  }
}

// 主函数
async function main() {
  try {
    console.log('🚀 开始死链检测...');
    console.log(`⚙️  配置: 超时${CONFIG.TIMEOUT}ms, 并发${CONFIG.CONCURRENT_REQUESTS}, 重试${CONFIG.MAX_RETRIES}次`);
    
    // 获取工具列表
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

    // 检查命令行参数是否限制数量
    const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
    const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;
    
    const toolsToCheck = limit ? tools.slice(0, limit) : tools;
    
    if (limit) {
      console.log(`🔢 限制检查前 ${limit} 个工具`);
    }

    // 批量检查
    console.log(`\n🔍 开始检查 ${toolsToCheck.length} 个工具的网站状态...`);
    const results = await checkToolsBatch(toolsToCheck);

    // 显示统计
    const activeCount = results.filter(r => r.status === 'active').length;
    const inactiveCount = results.filter(r => r.status === 'inactive').length;
    
    console.log('\n📊 检查完成统计:');
    console.log(`   ✅ 正常: ${activeCount}`);
    console.log(`   ❌ 异常: ${inactiveCount}`);
    console.log(`   📈 成功率: ${((activeCount / results.length) * 100).toFixed(2)}%`);

    // 尝试更新数据库
    const updateArg = process.argv.includes('--update');
    if (updateArg) {
      console.log('\n🔄 开始更新数据库...');
      await updateDatabaseDirect(results);
    } else {
      console.log('\n⚠️  跳过数据库更新（使用 --update 参数启用）');
    }

    // 生成报告
    await generateDeadLinksReport(results);

    console.log('\n🎉 死链检测完成！');

  } catch (error: any) {
    console.error('❌ 检测过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

export { checkWebsite, checkToolsBatch, generateDeadLinksReport };
