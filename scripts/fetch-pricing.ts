import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

// 配置
const CONCURRENCY = 5;
const REQUEST_TIMEOUT = 10000; // 10秒
const RETRY_ATTEMPTS = 2;
const RETRY_DELAY = 1000; // 1秒

// Supabase 客户端 - 延迟初始化
let supabase: any = null;

function getSupabaseClient() {
  if (!supabase) {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('缺少Supabase配置，请检查环境变量');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// 工具接口
interface Tool {
  id: string;
  name: string;
  website: string;
  pricing: string;
}

// 价格推断结果接口
interface PricingResult {
  pricing: string;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  foundPrices: string[];
  foundKeywords: string[];
}

// 报告条目接口
interface ReportEntry {
  id: string;
  name: string;
  url: string;
  oldPricing: string;
  newPricing: string;
  confidence: string;
  reason: string;
  foundPrices: string[];
  foundKeywords: string[];
  status: 'updated' | 'unchanged' | 'error';
  error?: string;
}

// 价格相关关键词
const PRICING_KEYWORDS = [
  'pricing', 'plans', 'subscription', 'subscribe', 'free', 'trial', 'demo',
  'cost', 'price', 'buy', 'purchase', 'payment', 'billing', 'upgrade',
  'premium', 'pro', 'basic', 'starter', 'enterprise', 'business',
  'freemium', 'forever free', 'no credit card', 'cancel anytime'
];

// 价格正则表达式
const PRICE_PATTERNS = [
  /\$\d+(?:\.\d{2})?(?:\/(?:month|mo|year|yr|week|day|user|seat))?/gi,
  /\$\d+(?:\.\d{2})?\s*(?:per|\/)\s*(?:month|mo|year|yr|week|day|user|seat)/gi,
  /\d+(?:\.\d{2})?\s*USD(?:\/(?:month|mo|year|yr))?/gi,
  /(?:monthly|yearly|annual)\s*:\s*\$\d+(?:\.\d{2})?/gi
];

// 免费相关关键词
const FREE_INDICATORS = [
  'free forever', 'always free', 'completely free', 'totally free',
  'free plan', 'free tier', 'free version', 'no cost', 'zero cost',
  'free to use', 'free trial', '100% free'
];

// 获取所有pricing为Unknown的工具
async function fetchTools(): Promise<Tool[]> {
  console.log('📊 正在获取pricing为Unknown的工具...');
  
  const client = getSupabaseClient();
  let query = client
    .from('tools')
    .select('id, name, website, pricing')
    .eq('pricing', 'Unknown')
    .not('website', 'is', null);
    
  // 测试模式限制数量
  if (process.env.TEST_MODE === 'true' && process.env.TEST_LIMIT) {
    const limit = parseInt(process.env.TEST_LIMIT);
    query = query.limit(limit);
    console.log(`🧪 测试模式：只处理前 ${limit} 个工具`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`获取工具失败: ${error.message}`);
  }

  console.log(`🔍 找到 ${data?.length || 0} 个需要检查的工具`);
  return data || [];
}

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取网页HTML内容（带重试）
async function fetchHTML(url: string, retries = RETRY_ATTEMPTS): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: REQUEST_TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.log(`⚠️  请求失败，${retries} 次重试剩余: ${url}`);
      await delay(RETRY_DELAY);
      return fetchHTML(url, retries - 1);
    }
    throw error;
  }
}

// 从HTML中提取价格信息
function extractPricing(html: string, url: string): PricingResult {
  const $ = cheerio.load(html);
  const text = $('body').text().toLowerCase();
  
  // 查找价格
  const foundPrices: string[] = [];
  PRICE_PATTERNS.forEach(pattern => {
    const matches = html.match(pattern) || [];
    foundPrices.push(...matches);
  });

  // 去重价格
  const uniquePrices = Array.from(new Set(foundPrices));

  // 查找关键词
  const foundKeywords = PRICING_KEYWORDS.filter(keyword => 
    text.includes(keyword.toLowerCase())
  );

  // 检查免费指示器
  const freeIndicators = FREE_INDICATORS.filter(indicator =>
    text.includes(indicator.toLowerCase())
  );

  // 推断价格
  let pricing = 'unknown';
  let confidence: 'high' | 'medium' | 'low' = 'low';
  let reason = '未找到明确的价格信息';

  // 优先检查freemium模式（有免费版本且有付费价格）
  if (freeIndicators.length > 0 && uniquePrices.length > 0) {
    pricing = 'freemium';
    confidence = 'high';
    reason = `找到免费版本和付费价格(${uniquePrices[0]})，推断为freemium模式`;
  } else if (uniquePrices.length > 0) {
    // 找到明确价格
    const firstPrice = uniquePrices[0];
    
    if (firstPrice.includes('/mo') || firstPrice.includes('/month')) {
      pricing = firstPrice.replace(/\/mo$/, '/month');
      confidence = 'high';
      reason = `找到明确的月付价格: ${firstPrice}`;
    } else if (firstPrice.includes('/yr') || firstPrice.includes('/year')) {
      pricing = firstPrice.replace(/\/yr$/, '/year');
      confidence = 'high';
      reason = `找到明确的年付价格: ${firstPrice}`;
    } else {
      pricing = firstPrice;
      confidence = 'medium';
      reason = `找到价格但不确定周期: ${firstPrice}`;
    }
  } else if (foundKeywords.includes('trial') && (foundKeywords.includes('free') || freeIndicators.length > 0)) {
    // 有试用且有免费信息
    pricing = 'trial';
    confidence = 'medium';
    reason = `找到试用和免费相关信息`;
  } else if (foundKeywords.includes('trial') && !foundKeywords.includes('free') && freeIndicators.length === 0) {
    // 只有试用，没有免费
    pricing = 'trial';
    confidence = 'medium';
    reason = `主要找到试用相关信息，无免费选项`;
  } else if (freeIndicators.length > 0 && (text.includes('pro') || text.includes('premium') || text.includes('upgrade') || text.includes('paid'))) {
    // 有免费版本但也提到了付费版本（但没找到具体价格）
    pricing = 'freemium';
    confidence = 'medium';
    reason = `找到免费版本和付费选项提及，推断为freemium模式`;
  } else if (freeIndicators.length > 0 || foundKeywords.includes('free')) {
    // 只有免费
    pricing = 'free';
    confidence = 'medium';
    reason = `主要找到免费相关信息`;
  }

  // 降低不确定情况的置信度
  if (foundKeywords.length === 0 && uniquePrices.length === 0) {
    confidence = 'low';
    reason = '未找到任何价格或关键词信息';
  }

  return {
    pricing,
    confidence,
    reason,
    foundPrices: uniquePrices,
    foundKeywords
  };
}

// 更新数据库中的工具价格
async function updateToolPricing(toolId: string, newPricing: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client
    .from('tools')
    .update({ pricing: newPricing })
    .eq('id', toolId);

  if (error) {
    throw new Error(`更新工具 ${toolId} 失败: ${error.message}`);
  }
}

// 处理单个工具
async function processTool(tool: Tool): Promise<ReportEntry> {
  const reportEntry: ReportEntry = {
    id: tool.id,
    name: tool.name,
    url: tool.website,
    oldPricing: tool.pricing,
    newPricing: tool.pricing,
    confidence: 'low',
    reason: '',
    foundPrices: [],
    foundKeywords: [],
    status: 'unchanged'
  };

  try {
    console.log(`🔍 正在处理: ${tool.name} (${tool.website})`);
    
    // 获取HTML内容
    const html = await fetchHTML(tool.website);
    
    // 提取价格信息
    const result = extractPricing(html, tool.website);
    
    reportEntry.confidence = result.confidence;
    reportEntry.reason = result.reason;
    reportEntry.foundPrices = result.foundPrices;
    reportEntry.foundKeywords = result.foundKeywords;

    // 只有高置信度或中等置信度且结果不是unknown时才更新
    if ((result.confidence === 'high' || (result.confidence === 'medium' && result.pricing !== 'unknown')) 
        && result.pricing !== tool.pricing) {
      
      await updateToolPricing(tool.id, result.pricing);
      reportEntry.newPricing = result.pricing;
      reportEntry.status = 'updated';
      
      console.log(`✅ 更新成功: ${tool.name} -> ${result.pricing}`);
    } else {
      console.log(`⏭️  跳过更新: ${tool.name} (置信度: ${result.confidence}, 结果: ${result.pricing})`);
    }

  } catch (error) {
    reportEntry.status = 'error';
    reportEntry.error = error instanceof Error ? error.message : String(error);
    console.log(`❌ 处理失败: ${tool.name} - ${reportEntry.error}`);
  }

  return reportEntry;
}

// 并发处理工具
async function processToolsConcurrently(tools: Tool[]): Promise<ReportEntry[]> {
  const results: ReportEntry[] = [];
  
  // 分批处理
  for (let i = 0; i < tools.length; i += CONCURRENCY) {
    const batch = tools.slice(i, i + CONCURRENCY);
    const batchPromises = batch.map(tool => processTool(tool));
    
    console.log(`📦 处理批次 ${Math.floor(i / CONCURRENCY) + 1}/${Math.ceil(tools.length / CONCURRENCY)} (${batch.length} 个工具)`);
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        // 处理Promise失败的情况
        const failedTool = batch[index];
        results.push({
          id: failedTool.id,
          name: failedTool.name,
          url: failedTool.website,
          oldPricing: failedTool.pricing,
          newPricing: failedTool.pricing,
          confidence: 'low',
          reason: '',
          foundPrices: [],
          foundKeywords: [],
          status: 'error',
          error: result.reason instanceof Error ? result.reason.message : String(result.reason)
        });
      }
    });
    
    // 批次间延迟
    if (i + CONCURRENCY < tools.length) {
      await delay(1000);
    }
  }
  
  return results;
}

// 生成报告
async function generateReport(results: ReportEntry[]): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(process.cwd(), `pricing_report_${timestamp}.json`);
  
  // 统计信息
  const stats = {
    total: results.length,
    updated: results.filter(r => r.status === 'updated').length,
    unchanged: results.filter(r => r.status === 'unchanged').length,
    errors: results.filter(r => r.status === 'error').length,
    byPricing: {} as Record<string, number>
  };

  // 按新价格分类统计
  results.forEach(result => {
    const pricing = result.newPricing;
    stats.byPricing[pricing] = (stats.byPricing[pricing] || 0) + 1;
  });

  const report = {
    timestamp: new Date().toISOString(),
    config: {
      concurrency: CONCURRENCY,
      timeout: REQUEST_TIMEOUT,
      retryAttempts: RETRY_ATTEMPTS
    },
    stats,
    results: results.sort((a, b) => {
      // 按状态排序：updated > unchanged > error
      const statusOrder = { updated: 0, unchanged: 1, error: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    })
  };

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  
  console.log(`\n📊 报告统计:`);
  console.log(`📝 总工具数: ${stats.total}`);
  console.log(`✅ 成功更新: ${stats.updated}`);
  console.log(`⏭️  保持不变: ${stats.unchanged}`);
  console.log(`❌ 处理失败: ${stats.errors}`);
  console.log(`\n💰 价格分布:`);
  Object.entries(stats.byPricing).forEach(([pricing, count]) => {
    console.log(`   ${pricing}: ${count} 个工具`);
  });
  console.log(`\n📄 详细报告已保存: ${reportPath}`);
}

// 主函数
async function main() {
  try {
    console.log('🚀 开始批量获取工具价格信息...\n');
    
    // 检查环境变量 - 通过尝试创建客户端来验证
    try {
      getSupabaseClient();
      console.log('✅ Supabase配置验证成功');
    } catch (error) {
      throw new Error('缺少Supabase配置，请检查环境变量');
    }

    // 获取需要处理的工具
    const tools = await fetchTools();
    
    if (tools.length === 0) {
      console.log('✨ 没有需要处理的工具，所有工具的价格信息都已完整！');
      return;
    }

    console.log(`\n⚙️  配置信息:`);
    console.log(`   并发数: ${CONCURRENCY}`);
    console.log(`   超时时间: ${REQUEST_TIMEOUT}ms`);
    console.log(`   重试次数: ${RETRY_ATTEMPTS}`);
    console.log('');

    // 并发处理所有工具
    const results = await processToolsConcurrently(tools);
    
    // 生成报告
    await generateReport(results);
    
    console.log('\n🎉 价格获取任务完成！');
    
  } catch (error) {
    console.error('❌ 任务执行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  // 设置环境变量
  require('dotenv').config({ path: '.env.local' });
  main();
}

export {
  fetchTools,
  extractPricing,
  processTool,
  generateReport,
  main
};