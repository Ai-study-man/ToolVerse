#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// 配置
const CONFIG = {
  TIMEOUT: 10000, // 10秒超时
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
interface Tool {
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
  website: string;
  status: 'active' | 'inactive';
  error?: string;
  statusCode?: number;
}

// 检查单个网站的函数
async function checkWebsite(url: string, retryCount = 0): Promise<{ status: 'active' | 'inactive'; error?: string; statusCode?: number }> {
  try {
    // 规范化URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    console.log(`🔍 检查: ${normalizedUrl}`);

    // 先尝试HEAD请求，如果失败再用GET
    let response;
    try {
      response = await axios.head(normalizedUrl, {
        timeout: CONFIG.TIMEOUT,
        headers: {
          'User-Agent': CONFIG.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
        },
        validateStatus: function (status) {
          return true;
        },
        maxRedirects: 5,
      });
    } catch (headError: any) {
      // HEAD失败，尝试GET请求
      console.log(`🔄 HEAD失败，尝试GET: ${normalizedUrl}`);
      response = await axios.get(normalizedUrl, {
        timeout: CONFIG.TIMEOUT,
        headers: {
          'User-Agent': CONFIG.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
        },
        validateStatus: function (status) {
          return true;
        },
        maxRedirects: 5,
        maxContentLength: 1024 * 1024, // 限制1MB
      });
    }

    // 判断状态
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ 成功: ${normalizedUrl} (${response.status})`);
      return { status: 'active', statusCode: response.status };
    } else if (response.status >= 300 && response.status < 400) {
      console.log(`✅ 重定向: ${normalizedUrl} (${response.status}) - 网站正常`);
      return { status: 'active', statusCode: response.status };
    } else if (response.status === 403) {
      console.log(`⚠️  被保护: ${normalizedUrl} (403) - 可能有反爬虫保护，但网站存在`);
      return { status: 'active', error: '403 - 被反爬虫保护', statusCode: response.status };
    } else if (response.status === 404) {
      console.log(`❌ 失败: ${normalizedUrl} (404) - 页面不存在`);
      return { status: 'inactive', error: `HTTP ${response.status}`, statusCode: response.status };
    } else if (response.status >= 500) {
      console.log(`❌ 失败: ${normalizedUrl} (${response.status}) - 服务器错误`);
      return { status: 'inactive', error: `HTTP ${response.status}`, statusCode: response.status };
    } else {
      console.log(`❌ 失败: ${normalizedUrl} (${response.status})`);
      return { status: 'inactive', error: `HTTP ${response.status}`, statusCode: response.status };
    }

  } catch (error: any) {
    console.log(`❌ 错误: ${url} - ${error.message}`);

    // 重试逻辑
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(`  🔄 重试 ${retryCount + 1}/${CONFIG.MAX_RETRIES}: ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // 递增延迟
      return checkWebsite(url, retryCount + 1);
    }

    if (error.code === 'ECONNABORTED') {
      return { status: 'inactive', error: '请求超时', statusCode: 0 };
    } else if (error.code === 'ECONNRESET') {
      return { status: 'inactive', error: '连接被重置', statusCode: 0 };
    } else if (error.code === 'ENOTFOUND') {
      return { status: 'inactive', error: '域名不存在', statusCode: 0 };
    } else if (error.response?.status === 403) {
      return { status: 'active', error: '403 - 被反爬虫保护，但网站存在', statusCode: 403 };
    } else {
      return { 
        status: 'inactive', 
        error: error.message || 'Unknown error',
        statusCode: error.response?.status || 0 
      };
    }
  }
}

// 批量检查网站
async function checkWebsitesBatch(tools: Tool[]): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  
  // 分批处理，避免过多并发请求
  for (let i = 0; i < tools.length; i += CONFIG.CONCURRENT_REQUESTS) {
    const batch = tools.slice(i, i + CONFIG.CONCURRENT_REQUESTS);
    
    console.log(`\n📦 处理批次 ${Math.floor(i / CONFIG.CONCURRENT_REQUESTS) + 1}/${Math.ceil(tools.length / CONFIG.CONCURRENT_REQUESTS)} (${batch.length} 个网站)`);
    
    const batchPromises = batch.map(async (tool) => {
      if (!tool.website) {
        return {
          id: tool.id,
          website: '',
          status: 'inactive' as const,
          error: '没有网站链接'
        };
      }

      const result = await checkWebsite(tool.website);
      return {
        id: tool.id,
        website: tool.website,
        status: result.status,
        error: result.error,
        statusCode: result.statusCode
      };
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // 批次间短暂延迟
    if (i + CONFIG.CONCURRENT_REQUESTS < tools.length) {
      console.log('⏱️  等待 1 秒...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// 更新数据库中的状态
async function updateDatabase(results: CheckResult[]): Promise<void> {
  console.log('\n💾 更新数据库状态...');
  
  const updatePromises = results.map(async (result) => {
    try {
      const { error } = await supabase
        .from('tools')
        .update({ status: result.status })
        .eq('id', result.id);

      if (error) {
        console.error(`❌ 更新失败 ${result.id}:`, error.message);
      }
    } catch (error: any) {
      console.error(`❌ 更新异常 ${result.id}:`, error.message);
    }
  });

  await Promise.all(updatePromises);
  console.log('✅ 数据库状态更新完成');
}

// 生成死链报告
async function generateDeadLinksReport(results: CheckResult[]): Promise<void> {
  const deadLinks: DeadLink[] = results
    .filter(result => result.status === 'inactive')
    .map(result => ({
      id: result.id,
      name: '', // 这里可以添加工具名称
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

  const reportPath = path.join(process.cwd(), 'dead_links.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  
  console.log(`\n📄 死链报告已生成: ${reportPath}`);
  console.log(`📊 检查结果: ${report.activeCount} 正常, ${report.inactiveCount} 失效 (成功率: ${report.successRate})`);
}

// 主函数
async function main() {
  console.log('🚀 开始死链检测...\n');

  try {
    // 获取所有工具
    console.log('📥 获取工具数据...');
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, website')
      .not('website', 'is', null);

    if (error) {
      throw new Error(`获取数据失败: ${error.message}`);
    }

    if (!tools || tools.length === 0) {
      console.log('⚠️  没有找到包含网站链接的工具');
      return;
    }

    console.log(`📋 找到 ${tools.length} 个包含网站链接的工具\n`);

    // 批量检查网站
    const results = await checkWebsitesBatch(tools);

    // 更新数据库
    await updateDatabase(results);

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
  main().catch(console.error);
}
