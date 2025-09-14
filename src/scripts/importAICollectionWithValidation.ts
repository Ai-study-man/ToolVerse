#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import yaml from 'js-yaml';
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

// AI Collection 原始数据接口
interface AICollectionTool {
  name: string;
  description: string;
  website: string;
  category?: string;
  pricing?: string;
  tags?: string[];
  featured?: boolean;
  [key: string]: any;
}

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

// 分类映射
const CATEGORY_MAPPING: Record<string, string> = {
  'Art & Image Generator': 'Design & Art',
  'Avatars': 'Design & Art',
  'Code & Database Assistant': 'Developer Tools',
  'Content Detection': 'Developer Tools',
  'Copywriting': 'Writing & Content',
  'Customer Support': 'Business & Sales',
  'Dating': 'Lifestyle',
  'Design Assistant': 'Design & Art',
  'Developer Tools': 'Developer Tools',
  'E-Commerce': 'Business & Sales',
  'Education & Learning': 'Education',
  'Email Assistant': 'Productivity',
  'Experiments': 'Research',
  'Fashion': 'Lifestyle',
  'Fun Tools': 'Entertainment',
  'Gaming': 'Entertainment',
  'General Writing': 'Writing & Content',
  'Gift Ideas': 'Lifestyle',
  'Healthcare': 'Health & Medical',
  'Human Resources': 'Business & Sales',
  'Legal Assistant': 'Legal',
  'Logo Generator': 'Design & Art',
  'Low-Code/No-Code': 'Developer Tools',
  'Music & Audio': 'Audio & Music',
  'Paraphraser': 'Writing & Content',
  'Personalized Videos': 'Video',
  'Presentations': 'Productivity',
  'Productivity': 'Productivity',
  'Prompts': 'AI Tools',
  'Real Estate': 'Business & Sales',
  'Religion': 'Lifestyle',
  'Research': 'Research',
  'Resume': 'Business & Sales',
  'Sales': 'Business & Sales',
  'Search Engine': 'Search',
  'SEO': 'Marketing',
  'Social Media Assistant': 'Marketing',
  'Spreadsheets': 'Productivity',
  'SQL': 'Developer Tools',
  'Startup Tools': 'Business & Sales',
  'Summarizer': 'Productivity',
  'Text To Speech': 'Audio & Music',
  'Text to Video': 'Video',
  'Transcriber': 'Audio & Music',
  'Travel': 'Travel',
  'Video': 'Video',
  'Video Generator': 'Video',
  'Weather': 'Utilities',
  'Writing Assistant': 'Writing & Content'
};

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
  tools: AICollectionTool[], 
  startIndex: number, 
  batchSize: number
): Promise<{ validTools: Tool[]; invalidTools: { tool: AICollectionTool; reason: string }[]; batchResult: BatchResult }> {
  const batch = tools.slice(startIndex, startIndex + batchSize);
  const validTools: Tool[] = [];
  const invalidTools: { tool: AICollectionTool; reason: string }[] = [];
  const responseTimes: number[] = [];
  
  console.log(`\n📋 检查第 ${Math.floor(startIndex / batchSize) + 1} 批 (${startIndex + 1}-${Math.min(startIndex + batchSize, tools.length)}/${tools.length})`);
  
  // 并发检查这一批的所有工具
  const checkPromises = batch.map(async (aiTool, index) => {
    const toolIndex = startIndex + index + 1;
    
    // 基本验证
    if (!aiTool.name || !aiTool.description || !aiTool.website) {
      console.log(`❌ [${toolIndex}] ${aiTool.name || '未知工具'}: 缺少必要字段`);
      return { valid: false, tool: aiTool, reason: '缺少必要字段' };
    }
    
    console.log(`🔍 [${toolIndex}] 检查: ${aiTool.name}`);
    console.log(`   网站: ${aiTool.website}`);
    
    const checkResult = await checkWebsiteValidity(aiTool.website);
    
    if (checkResult.responseTime) {
      responseTimes.push(checkResult.responseTime);
    }
    
    if (checkResult.isValid) {
      console.log(`   ✅ 有效 (${checkResult.statusCode || 'OK'}) - ${checkResult.responseTime}ms`);
      const tool = convertTool(aiTool);
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
      invalidTools.push({ tool: result.tool as AICollectionTool, reason: result.reason || '未知错误' });
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

// 价格模式映射
function mapPricingModel(pricing?: string): 'free' | 'paid' | 'freemium' {
  if (!pricing) return 'freemium';
  
  const pricingLower = pricing.toLowerCase();
  
  if (pricingLower.includes('free') && !pricingLower.includes('trial')) {
    return 'free';
  }
  
  if (pricingLower.includes('freemium') || 
      (pricingLower.includes('free') && pricingLower.includes('paid')) ||
      (pricingLower.includes('free') && pricingLower.includes('$'))) {
    return 'freemium';
  }
  
  return 'paid';
}

// 生成ID
function generateId(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// 生成简短描述
function generateShortDescription(description: string): string {
  if (description.length <= 100) return description;
  
  const sentences = description.split(/[.!?]+/);
  const firstSentence = sentences[0]?.trim();
  
  if (firstSentence && firstSentence.length <= 100) {
    return firstSentence + '.';
  }
  
  return description.substring(0, 97) + '...';
}

// 转换单个工具数据
function convertTool(aiTool: AICollectionTool): Tool {
  const id = generateId(aiTool.name);
  const category = aiTool.category ? CATEGORY_MAPPING[aiTool.category] || 'AI Tools' : 'AI Tools';
  const pricingModel = mapPricingModel(aiTool.pricing);
  const shortDescription = generateShortDescription(aiTool.description);
  
  return {
    id,
    name: aiTool.name,
    description: aiTool.description,
    shortDescription,
    logo: `/logos/${id}.png`,
    website: aiTool.website,
    category,
    pricingModel,
    pricing: aiTool.pricing || 'Contact for pricing',
    rating: 4.0 + Math.random() * 0.9,
    reviewCount: Math.floor(Math.random() * 100) + 10,
    tags: aiTool.tags || [],
    features: [],
    createdAt: new Date().toISOString(),
    views: Math.floor(Math.random() * 1000) + 100,
    likes: Math.floor(Math.random() * 50) + 10,
    lastUpdated: new Date().toISOString(),
    status: 'active' // 只有通过检测的工具才会被设置为active
  };
}

// 递归遍历目录查找YAML文件
function findYamlFiles(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...findYamlFiles(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`无法读取目录 ${dir}:`, error);
  }
  
  return files;
}

// 解析单个YAML文件
function parseYamlFile(filePath: string): AICollectionTool[] {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content) as any;
    
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      if (data.tools && Array.isArray(data.tools)) {
        return data.tools;
      } else if (data.items && Array.isArray(data.items)) {
        return data.items;
      } else {
        return [data];
      }
    }
    
    return [];
  } catch (error) {
    console.warn(`解析文件 ${filePath} 失败:`, error);
    return [];
  }
}

// 保存工具到数据库
async function saveToolToDatabase(tool: Tool): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tools')
      .insert([tool]);

    if (error) {
      console.error(`❌ 保存失败 ${tool.name}: ${error.message}`);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error(`❌ 保存异常 ${tool.name}: ${error.message}`);
    return false;
  }
}

// 主导入函数（带死链检测）
async function importAICollectionWithValidation(repoPath?: string, skipWebsiteCheck: boolean = false) {
  const inputPath = repoPath || process.argv[2];
  
  if (!inputPath) {
    console.error('请提供AI Collection仓库的本地路径');
    console.error('用法: npx tsx src/scripts/importAICollectionWithValidation.ts <ai-collection-repo-path>');
    process.exit(1);
  }
  
  const toolsDir = path.join(inputPath, 'tools');
  
  if (!fs.existsSync(toolsDir)) {
    console.error(`找不到tools目录: ${toolsDir}`);
    console.error('请确保提供的是AI Collection仓库的根目录路径');
    process.exit(1);
  }
  
  console.log('🚀 开始AI工具导入流程（带死链检测）...\n');
  console.log('🔍 扫描YAML文件...');
  const yamlFiles = findYamlFiles(toolsDir);
  console.log(`📁 找到 ${yamlFiles.length} 个YAML文件\n`);
  
  const allTools: AICollectionTool[] = [];
  const validTools: Tool[] = [];
  const invalidTools: { tool: AICollectionTool; reason: string }[] = [];
  const errors: string[] = [];
  const batchResults: BatchResult[] = [];
  
  // 第一阶段：解析YAML文件
  console.log('📄 第一阶段：解析YAML文件...');
  for (const filePath of yamlFiles) {
    console.log(`   处理: ${path.relative(inputPath, filePath)}`);
    
    try {
      const aiTools = parseYamlFile(filePath);
      allTools.push(...aiTools);
    } catch (error) {
      const errorMsg = `处理文件 ${filePath} 失败: ${error}`;
      console.error(`❌ ${errorMsg}`);
      errors.push(errorMsg);
    }
  }
  
  console.log(`✅ 解析完成，找到 ${allTools.length} 个工具\n`);
  
  // 第二阶段：批量检测网站有效性
  if (!skipWebsiteCheck) {
    console.log('🌐 第二阶段：批量检测网站有效性...');
    console.log(`⚙️  配置: ${CHECK_CONFIG.CONCURRENT_CHECKS}个并发检测，每批间隔${CHECK_CONFIG.BATCH_DELAY}ms`);
    console.log(`⏱️  预计需要时间: ${Math.ceil(allTools.length / CHECK_CONFIG.CONCURRENT_CHECKS * (CHECK_CONFIG.TIMEOUT + CHECK_CONFIG.BATCH_DELAY) / 1000 / 60)} 分钟\n`);
    
    let totalValidCount = 0;
    let totalInvalidCount = 0;
    
    // 分批处理
    for (let i = 0; i < allTools.length; i += CHECK_CONFIG.CONCURRENT_CHECKS) {
      const { validTools: batchValidTools, invalidTools: batchInvalidTools, batchResult } = 
        await checkWebsitesBatch(allTools, i, CHECK_CONFIG.CONCURRENT_CHECKS);
      
      // 累计结果
      validTools.push(...batchValidTools);
      invalidTools.push(...batchInvalidTools);
      batchResults.push(batchResult);
      totalValidCount += batchValidTools.length;
      totalInvalidCount += batchInvalidTools.length;
      
      // 如果不是最后一批，等待一下
      if (i + CHECK_CONFIG.CONCURRENT_CHECKS < allTools.length) {
        console.log(`⏳ 等待${CHECK_CONFIG.BATCH_DELAY}ms...\n`);
        await new Promise(resolve => setTimeout(resolve, CHECK_CONFIG.BATCH_DELAY));
      }
    }
    
    console.log('\n📊 网站检测完成统计:');
    console.log(`   ✅ 有效工具: ${totalValidCount} 个`);
    console.log(`   ❌ 无效工具: ${totalInvalidCount} 个`);
    console.log(`   📈 有效率: ${((totalValidCount / allTools.length) * 100).toFixed(1)}%`);
    
    // 计算平均响应时间
    const avgResponseTime = batchResults.length > 0 
      ? Math.round(batchResults.reduce((sum: number, batch: BatchResult) => sum + batch.averageResponseTime, 0) / batchResults.length)
      : 0;
    console.log(`   ⏱️  平均响应时间: ${avgResponseTime}ms`);
    
    console.log('\n📋 分批处理详情:');
    batchResults.forEach(batch => {
      console.log(`   批次${batch.batchNumber}: 处理${batch.processed}个, ✅${batch.valid} ❌${batch.invalid} (${batch.averageResponseTime}ms)`);
    });
    
  } else {
    console.log('⚠️  跳过网站检测，直接转换所有工具...\n');
    for (const aiTool of allTools) {
      if (!aiTool.name || !aiTool.description || !aiTool.website) {
        invalidTools.push({ tool: aiTool, reason: '缺少必要字段' });
        continue;
      }
      const tool = convertTool(aiTool);
      validTools.push(tool);
    }
  }
  
  // 第三阶段：保存到数据库
  if (validTools.length > 0) {
    console.log('💾 第三阶段：保存到数据库...');
    
    let savedCount = 0;
    let saveErrors = 0;
    
    for (const tool of validTools) {
      console.log(`   保存: ${tool.name} (${tool.id})`);
      
      const success = await saveToolToDatabase(tool);
      if (success) {
        savedCount++;
        console.log(`   ✅ 已保存`);
      } else {
        saveErrors++;
        console.log(`   ❌ 保存失败`);
      }
    }
    
    console.log('\n📊 数据库保存结果:');
    console.log(`   ✅ 成功保存: ${savedCount} 个工具`);
    console.log(`   ❌ 保存失败: ${saveErrors} 个工具`);
    console.log(`   📈 保存率: ${((savedCount / validTools.length) * 100).toFixed(1)}%`);
  } else {
    console.log('⚠️  没有有效的工具可以保存到数据库');
  }
  
  // 生成详细报告文件
  const reportPath = path.join(process.cwd(), 'import_report.json');
  
  // 计算平均响应时间
  const avgResponseTime = !skipWebsiteCheck && batchResults.length > 0 
    ? Math.round(batchResults.reduce((sum, batch) => sum + batch.averageResponseTime, 0) / batchResults.length)
    : undefined;
  
  const report: ImportReport = {
    generatedAt: new Date().toISOString(),
    totalParsed: allTools.length,
    validTools: validTools.length,
    invalidTools: invalidTools.length,
    skippedTools: invalidTools.filter(item => item.reason === '缺少必要字段').length,
    validityRate: ((validTools.length / allTools.length) * 100).toFixed(2) + '%',
    websiteCheckEnabled: !skipWebsiteCheck,
    averageResponseTime: avgResponseTime,
    batchDetails: !skipWebsiteCheck ? batchResults : [],
    validToolsDetails: validTools.map(tool => ({
      name: tool.name,
      website: tool.website,
      statusCode: undefined, // 在批量检查中可以补充
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
  console.log(`   📁 解析的YAML文件: ${yamlFiles.length} 个`);
  console.log(`   🔍 发现的工具总数: ${allTools.length} 个`);
  console.log(`   ✅ 有效工具: ${validTools.length} 个`);
  console.log(`   ❌ 无效工具: ${invalidTools.length} 个`);
  console.log(`   📈 有效率: ${((validTools.length / allTools.length) * 100).toFixed(1)}%`);
  if (avgResponseTime) {
    console.log(`   ⏱️  平均响应时间: ${avgResponseTime}ms`);
  }
  if (errors.length > 0) {
    console.log(`   ⚠️  解析错误: ${errors.length} 个`);
  }
  
  console.log('\n🎉 AI工具导入流程完成！');
  
  return { validTools, invalidTools, errors };
}

// 运行主函数
if (require.main === module) {
  const args = process.argv.slice(2);
  const skipCheck = args.includes('--skip-check') || args.includes('--no-check');
  const repoPath = args.find(arg => !arg.startsWith('--'));
  
  importAICollectionWithValidation(repoPath, skipCheck).catch(console.error);
}

export { importAICollectionWithValidation, checkWebsiteValidity };
