#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Tool } from '../types';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// 网站检测配置
const CHECK_CONFIG = {
  TIMEOUT: parseInt(process.env.CHECK_TIMEOUT || '8000'), // 8秒超时
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES || '2'), // 重试次数
  CONCURRENT_CHECKS: parseInt(process.env.CONCURRENT_CHECKS || '8'), // 并发检测数量
  BATCH_DELAY: parseInt(process.env.BATCH_DELAY || '500'), // 批次间延迟(ms)
};

// 初始化 Supabase 客户端（使用 Service Role Key）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  console.error('请确保在 .env.local 文件中设置了：');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 测试AI工具数据
const testAITools = [
  {
    name: 'ChatGPT',
    description: 'OpenAI开发的先进对话AI助手，能够进行自然语言对话、回答问题、协助写作等多种任务。',
    website: 'https://chat.openai.com',
    category: 'Assistant',
    pricingModel: 'freemium',
    pricing: 'Free / $20/month',
    tags: ['AI', 'Chat', 'Assistant', 'Writing']
  },
  {
    name: 'Midjourney',
    description: 'AI驱动的图像生成工具，可以根据文字描述创建高质量的艺术作品和图像。',
    website: 'https://www.midjourney.com',
    category: 'Art & Image Generator',
    pricingModel: 'paid',
    pricing: '$10-60/month',
    tags: ['AI', 'Art', 'Image Generation', 'Creative']
  },
  {
    name: 'GitHub Copilot',
    description: 'AI代码助手，在您编程时提供智能代码建议和自动补全功能。',
    website: 'https://github.com/features/copilot',
    category: 'Code & Database Assistant',
    pricingModel: 'paid',
    pricing: '$10/month',
    tags: ['AI', 'Programming', 'Code', 'Developer']
  },
  {
    name: 'Notion AI',
    description: '集成在Notion中的AI功能，帮助用户写作、总结、翻译和整理内容。',
    website: 'https://www.notion.so/product/ai',
    category: 'Productivity',
    pricingModel: 'freemium',
    pricing: 'Free / $10/month',
    tags: ['AI', 'Productivity', 'Writing', 'Organization']
  },
  {
    name: 'Stable Diffusion',
    description: '开源的AI图像生成模型，可以生成高质量的图像和艺术作品。',
    website: 'https://stability.ai/stable-diffusion',
    category: 'Art & Image Generator',
    pricingModel: 'free',
    pricing: 'Free',
    tags: ['AI', 'Open Source', 'Image Generation', 'Art']
  },
  {
    name: 'Copy.ai',
    description: 'AI写作助手，帮助创建营销文案、博客文章和各种类型的内容。',
    website: 'https://www.copy.ai',
    category: 'Copywriting',
    pricingModel: 'freemium',
    pricing: 'Free / $36/month',
    tags: ['AI', 'Writing', 'Marketing', 'Content']
  },
  {
    name: 'Jasper AI',
    description: '企业级AI写作平台，专为内容营销和企业内容创作设计。',
    website: 'https://www.jasper.ai',
    category: 'Copywriting',
    pricingModel: 'paid',
    pricing: '$39-125/month',
    tags: ['AI', 'Writing', 'Marketing', 'Enterprise']
  },
  {
    name: 'DALL-E 2',
    description: 'OpenAI开发的AI图像生成器，可以根据文字描述创建现实或想象的图像。',
    website: 'https://openai.com/dall-e-2/',
    category: 'Art & Image Generator',
    pricingModel: 'paid',
    pricing: '$0.02/image',
    tags: ['AI', 'Image Generation', 'Art', 'Creative']
  },
  {
    name: 'Grammarly',
    description: 'AI驱动的写作助手，提供语法检查、拼写纠正和写作建议。',
    website: 'https://www.grammarly.com',
    category: 'Writing Assistant',
    pricingModel: 'freemium',
    pricing: 'Free / $12-15/month',
    tags: ['AI', 'Writing', 'Grammar', 'Productivity']
  },
  {
    name: 'RunwayML',
    description: 'AI视频编辑和生成平台，提供各种创意AI工具。',
    website: 'https://runwayml.com',
    category: 'Video',
    pricingModel: 'freemium',
    pricing: 'Free / $12-35/month',
    tags: ['AI', 'Video', 'Creative', 'Editing']
  },
  // 添加一些测试的无效网站
  {
    name: 'Test Dead Link 1',
    description: '这是一个测试死链的工具，用于验证检测功能。',
    website: 'https://this-website-does-not-exist-12345.com',
    category: 'Test',
    pricingModel: 'free',
    pricing: 'Free',
    tags: ['Test', 'Dead Link']
  },
  {
    name: 'Test Dead Link 2',
    description: '另一个测试死链的工具。',
    website: 'https://fake-ai-tool-999.org',
    category: 'Test',
    pricingModel: 'free',
    pricing: 'Free',
    tags: ['Test', 'Dead Link']
  }
];

// 网站检测结果接口
interface WebsiteCheckResult {
  isValid: boolean;
  statusCode?: number;
  error?: string;
  responseTime?: number;
}

// 导入报告接口
interface ImportReport {
  generatedAt: string;
  totalParsed: number;
  validTools: number;
  invalidTools: number;
  skippedTools: number;
  validityRate: string;
  websiteCheckEnabled: boolean;
  averageResponseTime?: number;
  batchDetails: BatchResult[];
  validToolsDetails: Array<{
    name: string;
    website: string;
    statusCode?: number;
    responseTime?: number;
  }>;
  invalidToolsDetails: Array<{
    name: string;
    website: string;
    reason: string;
  }>;
  errors: string[];
}

// 批次结果接口
interface BatchResult {
  batchNumber: number;
  processed: number;
  valid: number;
  invalid: number;
  averageResponseTime: number;
}

// 检查网站是否可访问
async function checkWebsiteValidity(url: string, retryCount = 0): Promise<WebsiteCheckResult> {
  const startTime = Date.now();
  
  try {
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // 先尝试HEAD请求
    let response;
    try {
      response = await axios.head(normalizedUrl, {
        timeout: CHECK_CONFIG.TIMEOUT,
        headers: {
          'User-Agent': CHECK_CONFIG.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        validateStatus: function (status) {
          return true;
        },
        maxRedirects: 5,
      });
    } catch (headError: any) {
      // HEAD失败，尝试GET请求
      console.log(`   HEAD失败，尝试GET请求: ${normalizedUrl}`);
      response = await axios.get(normalizedUrl, {
        timeout: CHECK_CONFIG.TIMEOUT,
        headers: {
          'User-Agent': CHECK_CONFIG.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        validateStatus: function (status) {
          return true;
        },
        maxRedirects: 5,
        maxContentLength: 1024 * 1024, // 限制1MB
      });
    }

    const responseTime = Date.now() - startTime;

    // 判断是否有效
    if (response.status >= 200 && response.status < 300) {
      return { isValid: true, statusCode: response.status, responseTime };
    } else if (response.status >= 300 && response.status < 400) {
      return { isValid: true, statusCode: response.status, responseTime }; // 重定向也认为有效
    } else if (response.status === 403) {
      return { isValid: true, statusCode: response.status, error: '403 - 可能被反爬虫保护', responseTime }; // 403认为有效
    } else if (response.status === 404) {
      return { isValid: false, statusCode: response.status, error: '页面不存在', responseTime };
    } else if (response.status >= 500) {
      return { isValid: false, statusCode: response.status, error: '服务器错误', responseTime };
    } else {
      return { isValid: false, statusCode: response.status, error: `HTTP ${response.status}`, responseTime };
    }

  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    // 重试逻辑
    if (retryCount < CHECK_CONFIG.MAX_RETRIES) {
      console.log(`   重试 ${url} (剩余${CHECK_CONFIG.MAX_RETRIES - retryCount}次)`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return checkWebsiteValidity(url, retryCount + 1);
    }

    if (error.code === 'ECONNABORTED') {
      return { isValid: false, error: '请求超时', responseTime };
    } else if (error.code === 'ECONNRESET') {
      return { isValid: false, error: '连接被重置', responseTime };
    } else if (error.code === 'ENOTFOUND') {
      return { isValid: false, error: '域名不存在', responseTime };
    } else if (error.response?.status === 403) {
      return { isValid: true, statusCode: 403, error: '403 - 可能被反爬虫保护', responseTime };
    } else {
      return { isValid: false, error: error.message || 'Unknown error', responseTime };
    }
  }
}

// 并发检查网站有效性
async function checkWebsitesBatch(
  tools: typeof testAITools, 
  startIndex: number, 
  batchSize: number
): Promise<{ validTools: Tool[]; invalidTools: { tool: typeof testAITools[0]; reason: string }[]; batchResult: BatchResult }> {
  const batch = tools.slice(startIndex, startIndex + batchSize);
  const validTools: Tool[] = [];
  const invalidTools: { tool: typeof testAITools[0]; reason: string }[] = [];
  const responseTimes: number[] = [];
  
  console.log(`\n📋 检查第 ${Math.floor(startIndex / batchSize) + 1} 批 (${startIndex + 1}-${Math.min(startIndex + batchSize, tools.length)}/${tools.length})`);
  
  // 并发检查这一批的所有工具
  const checkPromises = batch.map(async (aiTool, index) => {
    const toolIndex = startIndex + index + 1;
    
    console.log(`🔍 [${toolIndex}] 检查: ${aiTool.name}`);
    console.log(`   网站: ${aiTool.website}`);
    
    const checkResult = await checkWebsiteValidity(aiTool.website);
    
    if (checkResult.responseTime) {
      responseTimes.push(checkResult.responseTime);
    }
    
    if (checkResult.isValid) {
      console.log(`   ✅ 有效 (${checkResult.statusCode || 'OK'}) - ${checkResult.responseTime}ms`);
      const tool: Tool = {
        id: aiTool.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: aiTool.name,
        description: aiTool.description,
        shortDescription: aiTool.description.substring(0, 100) + (aiTool.description.length > 100 ? '...' : ''),
        logo: `/logos/${aiTool.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`,
        website: aiTool.website,
        category: aiTool.category,
        pricingModel: aiTool.pricingModel as 'free' | 'freemium' | 'paid',
        pricing: aiTool.pricing,
        rating: 4.0 + Math.random(),
        reviewCount: Math.floor(Math.random() * 1000) + 50,
        tags: aiTool.tags,
        features: [],
        createdAt: new Date().toISOString(),
        views: Math.floor(Math.random() * 5000) + 100,
        likes: Math.floor(Math.random() * 200) + 10,
        lastUpdated: new Date().toISOString()
      };
      return { valid: true, tool, checkResult };
    } else {
      console.log(`   ❌ 无效: ${checkResult.error} - ${checkResult.responseTime}ms`);
      return { valid: false, tool: aiTool, reason: checkResult.error || '网站检测失败' };
    }
  });
  
  // 等待所有检查完成
  const results = await Promise.all(checkPromises);
  
  // 分类结果
  for (const result of results) {
    if (result.valid && 'checkResult' in result) {
      validTools.push(result.tool as Tool);
    } else {
      invalidTools.push({ tool: result.tool as typeof testAITools[0], reason: result.reason || '未知错误' });
    }
  }
  
  const averageResponseTime = responseTimes.length > 0 
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;
  
  console.log(`📊 批次结果: ✅${validTools.length} ❌${invalidTools.length} ⏱️${averageResponseTime}ms`);
  
  const batchResult: BatchResult = {
    batchNumber: Math.floor(startIndex / batchSize) + 1,
    processed: batch.length,
    valid: validTools.length,
    invalid: invalidTools.length,
    averageResponseTime,
  };
  
  return { validTools, invalidTools, batchResult };
}

// 保存工具到数据库
async function saveToolsToDatabase(tools: Tool[]): Promise<{ success: number; failed: number }> {
  let successCount = 0;
  let failedCount = 0;
  
  console.log(`\n💾 第三阶段：保存到数据库...`);
  console.log(`📤 准备保存 ${tools.length} 个有效工具到数据库`);
  
  // 分批保存以避免一次性插入太多数据
  const batchSize = 10;
  for (let i = 0; i < tools.length; i += batchSize) {
    const batch = tools.slice(i, i + batchSize);
    
    try {
      // 先检查是否已存在，如果存在则更新，否则插入
      for (const tool of batch) {
        const { data: existingTool, error: fetchError } = await supabase
          .from('tools')
          .select('id')
          .eq('id', tool.id)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error(`❌ 检查工具 ${tool.name} 是否存在时出错:`, fetchError);
          failedCount++;
          continue;
        }
        
        if (existingTool) {
          // 更新现有工具
          const { error: updateError } = await supabase
            .from('tools')
            .update({
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
              views: tool.views,
              likes: tool.likes,
              last_updated: tool.lastUpdated
            })
            .eq('id', tool.id);
          
          if (updateError) {
            console.error(`❌ 更新工具 ${tool.name} 失败:`, updateError);
            failedCount++;
          } else {
            console.log(`✅ 更新工具: ${tool.name}`);
            successCount++;
          }
        } else {
          // 插入新工具
          const { error: insertError } = await supabase
            .from('tools')
            .insert({
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
              views: tool.views,
              likes: tool.likes,
              last_updated: tool.lastUpdated
            });
          
          if (insertError) {
            console.error(`❌ 插入工具 ${tool.name} 失败:`, insertError);
            failedCount++;
          } else {
            console.log(`✅ 插入工具: ${tool.name}`);
            successCount++;
          }
        }
      }
    } catch (error) {
      console.error(`❌ 保存批次失败:`, error);
      failedCount += batch.length;
    }
  }
  
  return { success: successCount, failed: failedCount };
}

// 主导入函数
async function importRealAITools() {
  console.log('🚀 开始真实AI工具导入流程（带死链检测）...\n');
  
  const validTools: Tool[] = [];
  const invalidTools: { tool: typeof testAITools[0]; reason: string }[] = [];
  const errors: string[] = [];
  const batchResults: BatchResult[] = [];
  
  console.log(`📊 测试数据统计:`);
  console.log(`   📄 工具总数: ${testAITools.length} 个`);
  console.log(`   💡 包含真实工具: ${testAITools.filter(t => !t.name.includes('Test')).length} 个`);
  console.log(`   🧪 包含测试死链: ${testAITools.filter(t => t.name.includes('Test')).length} 个\n`);
  
  // 批量检测网站有效性
  console.log('🌐 开始批量检测网站有效性...');
  console.log(`⚙️  配置: ${CHECK_CONFIG.CONCURRENT_CHECKS}个并发检测，每批间隔${CHECK_CONFIG.BATCH_DELAY}ms`);
  console.log(`⏱️  预计需要时间: ${Math.ceil(testAITools.length / CHECK_CONFIG.CONCURRENT_CHECKS * (CHECK_CONFIG.TIMEOUT + CHECK_CONFIG.BATCH_DELAY) / 1000 / 60)} 分钟\n`);
  
  let totalValidCount = 0;
  let totalInvalidCount = 0;
  
  // 分批处理
  for (let i = 0; i < testAITools.length; i += CHECK_CONFIG.CONCURRENT_CHECKS) {
    const { validTools: batchValidTools, invalidTools: batchInvalidTools, batchResult } = 
      await checkWebsitesBatch(testAITools, i, CHECK_CONFIG.CONCURRENT_CHECKS);
    
    // 累计结果
    validTools.push(...batchValidTools);
    invalidTools.push(...batchInvalidTools);
    batchResults.push(batchResult);
    totalValidCount += batchValidTools.length;
    totalInvalidCount += batchInvalidTools.length;
    
    // 如果不是最后一批，等待一下
    if (i + CHECK_CONFIG.CONCURRENT_CHECKS < testAITools.length) {
      console.log(`⏳ 等待${CHECK_CONFIG.BATCH_DELAY}ms...\n`);
      await new Promise(resolve => setTimeout(resolve, CHECK_CONFIG.BATCH_DELAY));
    }
  }
  
  console.log('\n📊 网站检测完成统计:');
  console.log(`   ✅ 有效工具: ${totalValidCount} 个`);
  console.log(`   ❌ 无效工具: ${totalInvalidCount} 个`);
  console.log(`   📈 有效率: ${((totalValidCount / testAITools.length) * 100).toFixed(1)}%`);
  
  // 计算平均响应时间
  const avgResponseTime = batchResults.length > 0 
    ? Math.round(batchResults.reduce((sum: number, batch: BatchResult) => sum + batch.averageResponseTime, 0) / batchResults.length)
    : 0;
  console.log(`   ⏱️  平均响应时间: ${avgResponseTime}ms`);
  
  console.log('\n📋 分批处理详情:');
  batchResults.forEach(batch => {
    console.log(`   批次${batch.batchNumber}: 处理${batch.processed}个, ✅${batch.valid} ❌${batch.invalid} (${batch.averageResponseTime}ms)`);
  });
  
  // 保存到数据库
  const { success, failed } = await saveToolsToDatabase(validTools);
  
  console.log('\n📊 数据库保存结果:');
  console.log(`   ✅ 成功保存: ${success} 个工具`);
  console.log(`   ❌ 保存失败: ${failed} 个工具`);
  
  // 生成详细报告文件
  const reportPath = path.join(process.cwd(), 'import_report.json');
  
  const report: ImportReport = {
    generatedAt: new Date().toISOString(),
    totalParsed: testAITools.length,
    validTools: validTools.length,
    invalidTools: invalidTools.length,
    skippedTools: invalidTools.filter(item => item.reason === '缺少必要字段').length,
    validityRate: ((validTools.length / testAITools.length) * 100).toFixed(2) + '%',
    websiteCheckEnabled: true,
    averageResponseTime: avgResponseTime,
    batchDetails: batchResults,
    validToolsDetails: validTools.map(tool => ({
      name: tool.name,
      website: tool.website,
      statusCode: undefined,
      responseTime: undefined
    })),
    invalidToolsDetails: invalidTools.map(item => ({
      name: item.tool.name || '未知工具',
      website: item.tool.website || '未知网站',
      reason: item.reason
    })),
    errors: errors
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n📄 详细导入报告已生成: ${reportPath}`);
  
  // 显示简要总结
  console.log('\n📊 导入总结:');
  console.log(`   🔍 测试的工具总数: ${testAITools.length} 个`);
  console.log(`   ✅ 有效工具: ${validTools.length} 个`);
  console.log(`   ❌ 无效工具: ${invalidTools.length} 个`);
  console.log(`   📈 有效率: ${((validTools.length / testAITools.length) * 100).toFixed(1)}%`);
  console.log(`   ⏱️  平均响应时间: ${avgResponseTime}ms`);
  console.log(`   💾 数据库保存成功率: ${((success / validTools.length) * 100).toFixed(1)}%`);
  
  console.log('\n🎉 真实AI工具导入流程完成！');
  
  if (invalidTools.length > 0) {
    console.log('\n❌ 无效工具列表:');
    invalidTools.forEach(item => {
      console.log(`   • ${item.tool.name}: ${item.reason}`);
    });
  }
}

if (require.main === module) {
  importRealAITools().catch(console.error);
}

export { importRealAITools };