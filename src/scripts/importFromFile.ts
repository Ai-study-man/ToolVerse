#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { parse as parseCSV } from 'csv-parse/sync';
import { Tool } from '../types';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// 网站检测配置
const CHECK_CONFIG = {
  TIMEOUT: parseInt(process.env.CHECK_TIMEOUT || '8000'), // 8秒超时
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES || '2'), // 重试次数
  CONCURRENT_CHECKS: parseInt(process.env.CONCURRENT_CHECKS || '5'), // 并发检测数量（文件导入用较少并发）
  BATCH_DELAY: parseInt(process.env.BATCH_DELAY || '1000'), // 批次间延迟(ms)
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

// 原始工具数据接口
interface RawToolData {
  name?: string;
  url?: string;
  website?: string;
  logo?: string;
  category?: string;
  description?: string;
  pricing?: string;
  pricingModel?: string;
  pricing_model?: string;
  tags?: string | string[];
  features?: string | string[];
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  [key: string]: any; // 允许其他字段
}

// 质量检测结果接口
interface QualityCheckResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
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
  sourceFile: string;
  fileType: string;
  totalParsed: number;
  qualityFiltered: number;
  websiteFiltered: number;
  duplicateFiltered: number;
  successfullyImported: number;
  failedToImport: number;
  validityRate: string;
  websiteCheckEnabled: boolean;
  averageResponseTime?: number;
  batchDetails: BatchResult[];
  qualityIssues: QualityIssue[];
  websiteIssues: WebsiteIssue[];
  duplicateIssues: DuplicateIssue[];
  importFailures: ImportFailure[];
  successfulImports: SuccessfulImport[];
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

// 质量问题接口
interface QualityIssue {
  index: number;
  name: string;
  errors: string[];
  warnings: string[];
}

// 网站问题接口
interface WebsiteIssue {
  index: number;
  name: string;
  url: string;
  reason: string;
  responseTime?: number;
}

// 重复问题接口
interface DuplicateIssue {
  index: number;
  name: string;
  url: string;
  reason: string;
}

// 导入失败接口
interface ImportFailure {
  index: number;
  name: string;
  url: string;
  reason: string;
}

// 成功导入接口
interface SuccessfulImport {
  index: number;
  name: string;
  url: string;
  action: 'inserted' | 'updated';
}

// 读取文件数据
function readFileData(filePath: string): RawToolData[] {
  const absolutePath = path.resolve(filePath);
  
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`文件不存在: ${absolutePath}`);
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf8');
  const fileExtension = path.extname(absolutePath).toLowerCase();

  console.log(`📁 读取文件: ${absolutePath}`);
  console.log(`📄 文件类型: ${fileExtension}`);

  try {
    if (fileExtension === '.json') {
      const data = JSON.parse(fileContent);
      return Array.isArray(data) ? data : [data];
    } else if (fileExtension === '.csv') {
      const records = parseCSV(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
      return records;
    } else {
      throw new Error(`不支持的文件格式: ${fileExtension}。仅支持 .json 和 .csv 文件`);
    }
  } catch (error: any) {
    throw new Error(`解析文件失败: ${error.message}`);
  }
}

// 质量检测
function performQualityCheck(data: RawToolData, index: number): QualityCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 必需字段检查
  if (!data.name || data.name.trim() === '') {
    errors.push('缺少工具名称 (name)');
  }

  const url = data.url || data.website;
  if (!url || url.trim() === '') {
    errors.push('缺少网站地址 (url/website)');
  }

  if (!data.description || data.description.trim() === '') {
    errors.push('缺少工具描述 (description)');
  }

  if (!data.category || data.category.trim() === '') {
    errors.push('缺少工具分类 (category)');
  }

  // 警告检查
  if (!data.logo || data.logo.trim() === '') {
    warnings.push('缺少Logo (logo)');
  }

  if (!data.pricing && !data.pricingModel && !data.pricing_model) {
    warnings.push('缺少定价信息 (pricing)');
  }

  // URL格式检查
  if (url) {
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(url.trim())) {
      errors.push('URL格式无效，必须以http://或https://开头');
    }
  }

  // 名称长度检查
  if (data.name && data.name.length > 100) {
    warnings.push('工具名称过长（超过100字符）');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
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
    if (response.status >= 200 && response.status < 400) {
      return { isValid: true, statusCode: response.status, responseTime };
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

// 转换为标准工具格式
function convertToTool(data: RawToolData, index: number): Tool {
  const url = data.url || data.website || '';
  const pricingModel = data.pricingModel || data.pricing_model || 'unknown';
  
  // 处理标签
  let tags: string[] = [];
  if (data.tags) {
    if (Array.isArray(data.tags)) {
      tags = data.tags;
    } else if (typeof data.tags === 'string') {
      tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
  }

  // 处理功能
  let features: string[] = [];
  if (data.features) {
    if (Array.isArray(data.features)) {
      features = data.features;
    } else if (typeof data.features === 'string') {
      features = data.features.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0);
    }
  }

  const tool: Tool = {
    id: data.name!.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
    name: data.name!,
    description: data.description!,
    shortDescription: data.description!.substring(0, 150) + (data.description!.length > 150 ? '...' : ''),
    logo: data.logo || `/logos/${data.name!.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`,
    website: url,
    category: data.category!,
    pricingModel: ['free', 'freemium', 'paid'].includes(pricingModel) ? pricingModel as 'free' | 'freemium' | 'paid' : 'unknown' as any,
    pricing: data.pricing || 'Contact for pricing',
    rating: data.rating || (3.5 + Math.random() * 1.5),
    reviewCount: data.reviewCount || data.review_count || Math.floor(Math.random() * 500) + 50,
    tags,
    features,
    createdAt: new Date().toISOString(),
    views: Math.floor(Math.random() * 1000) + 100,
    likes: Math.floor(Math.random() * 100) + 10,
    lastUpdated: new Date().toISOString()
  };

  return tool;
}

// 批量网站检测
async function checkWebsitesBatch(
  validData: { data: RawToolData; index: number }[],
  startIndex: number,
  batchSize: number,
  skipWebsiteCheck: boolean
): Promise<{
  validTools: { tool: Tool; index: number }[];
  websiteIssues: WebsiteIssue[];
  batchResult: BatchResult;
}> {
  const batch = validData.slice(startIndex, startIndex + batchSize);
  const validTools: { tool: Tool; index: number }[] = [];
  const websiteIssues: WebsiteIssue[] = [];
  const responseTimes: number[] = [];

  console.log(`\n📋 检查第 ${Math.floor(startIndex / batchSize) + 1} 批 (${startIndex + 1}-${Math.min(startIndex + batchSize, validData.length)}/${validData.length})`);

  if (skipWebsiteCheck) {
    // 跳过网站检测，直接转换
    for (const { data, index } of batch) {
      const tool = convertToTool(data, index);
      validTools.push({ tool, index });
      console.log(`⚡ [${index + 1}] 跳过检测: ${data.name}`);
    }
  } else {
    // 并发检查这一批的所有工具
    const checkPromises = batch.map(async ({ data, index }) => {
      const url = data.url || data.website || '';
      
      console.log(`🔍 [${index + 1}] 检查: ${data.name}`);
      console.log(`   网站: ${url}`);
      
      const checkResult = await checkWebsiteValidity(url);
      
      if (checkResult.responseTime) {
        responseTimes.push(checkResult.responseTime);
      }
      
      if (checkResult.isValid) {
        console.log(`   ✅ 有效 (${checkResult.statusCode || 'OK'}) - ${checkResult.responseTime}ms`);
        const tool = convertToTool(data, index);
        return { valid: true, tool, index };
      } else {
        console.log(`   ❌ 无效: ${checkResult.error} - ${checkResult.responseTime}ms`);
        websiteIssues.push({
          index,
          name: data.name || '未知工具',
          url,
          reason: checkResult.error || '网站检测失败',
          responseTime: checkResult.responseTime
        });
        return { valid: false, data, index };
      }
    });
    
    // 等待所有检查完成
    const results = await Promise.all(checkPromises);
    
    // 分类结果
    for (const result of results) {
      if (result.valid && 'tool' in result) {
        validTools.push({ tool: result.tool, index: result.index });
      }
    }
  }

  const averageResponseTime = responseTimes.length > 0 
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;

  console.log(`📊 批次结果: ✅${validTools.length} ❌${websiteIssues.length} ⏱️${averageResponseTime}ms`);

  const batchResult: BatchResult = {
    batchNumber: Math.floor(startIndex / batchSize) + 1,
    processed: batch.length,
    valid: validTools.length,
    invalid: websiteIssues.length,
    averageResponseTime,
  };

  return { validTools, websiteIssues, batchResult };
}

// 检查数据库中的重复
async function checkDuplicates(tools: { tool: Tool; index: number }[]): Promise<{
  uniqueTools: { tool: Tool; index: number }[];
  duplicates: DuplicateIssue[];
}> {
  const uniqueTools: { tool: Tool; index: number }[] = [];
  const duplicates: DuplicateIssue[] = [];

  console.log('\n🔍 检查数据库重复...');

  for (const { tool, index } of tools) {
    // 检查数据库中是否已存在相同网站的工具
    const { data: existingTool, error } = await supabase
      .from('tools')
      .select('id, name, website')
      .eq('website', tool.website)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(`❌ 检查重复时出错 [${index + 1}] ${tool.name}:`, error);
      // 继续处理，不因为检查错误而跳过
      uniqueTools.push({ tool, index });
      continue;
    }

    if (existingTool) {
      console.log(`⚠️  [${index + 1}] 重复: ${tool.name} (已存在: ${existingTool.name})`);
      duplicates.push({
        index,
        name: tool.name,
        url: tool.website,
        reason: `与现有工具重复: ${existingTool.name}`
      });
    } else {
      console.log(`✅ [${index + 1}] 唯一: ${tool.name}`);
      uniqueTools.push({ tool, index });
    }
  }

  return { uniqueTools, duplicates };
}

// 保存工具到数据库
async function saveToolsToDatabase(tools: { tool: Tool; index: number }[]): Promise<{
  successfulImports: SuccessfulImport[];
  importFailures: ImportFailure[];
}> {
  const successfulImports: SuccessfulImport[] = [];
  const importFailures: ImportFailure[] = [];

  console.log(`\n💾 第四阶段：保存到数据库...`);
  console.log(`📤 准备保存 ${tools.length} 个工具到数据库`);

  for (const { tool, index } of tools) {
    try {
      // 先检查是否已存在（通过ID检查）
      const { data: existingTool, error: fetchError } = await supabase
        .from('tools')
        .select('id')
        .eq('id', tool.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`❌ [${index + 1}] 检查工具 ${tool.name} 是否存在时出错:`, fetchError);
        importFailures.push({
          index,
          name: tool.name,
          url: tool.website,
          reason: `检查失败: ${fetchError.message}`
        });
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
          console.error(`❌ [${index + 1}] 更新工具 ${tool.name} 失败:`, updateError);
          importFailures.push({
            index,
            name: tool.name,
            url: tool.website,
            reason: `更新失败: ${updateError.message}`
          });
        } else {
          console.log(`✅ [${index + 1}] 更新工具: ${tool.name}`);
          successfulImports.push({
            index,
            name: tool.name,
            url: tool.website,
            action: 'updated'
          });
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
          console.error(`❌ [${index + 1}] 插入工具 ${tool.name} 失败:`, insertError);
          importFailures.push({
            index,
            name: tool.name,
            url: tool.website,
            reason: `插入失败: ${insertError.message}`
          });
        } else {
          console.log(`✅ [${index + 1}] 插入工具: ${tool.name}`);
          successfulImports.push({
            index,
            name: tool.name,
            url: tool.website,
            action: 'inserted'
          });
        }
      }
    } catch (error: any) {
      console.error(`❌ [${index + 1}] 保存工具 ${tool.name} 时发生异常:`, error);
      importFailures.push({
        index,
        name: tool.name,
        url: tool.website,
        reason: `异常: ${error.message}`
      });
    }
  }

  return { successfulImports, importFailures };
}

// 主导入函数
async function importFromFile(filePath: string, skipWebsiteCheck = false) {
  console.log('🚀 开始文件批量导入流程...\n');

  // 检查参数
  if (!filePath) {
    console.error('❌ 请提供文件路径');
    console.error('用法: npx tsx src/scripts/importFromFile.ts <file-path> [--skip-check]');
    process.exit(1);
  }

  const errors: string[] = [];
  let rawData: RawToolData[] = [];

  try {
    // 第一阶段：读取文件
    console.log('📁 第一阶段：读取文件数据...');
    rawData = readFileData(filePath);
    console.log(`✅ 成功读取 ${rawData.length} 条记录\n`);
  } catch (error: any) {
    console.error('❌ 读取文件失败:', error.message);
    process.exit(1);
  }

  // 第二阶段：质量检测
  console.log('🔍 第二阶段：质量检测和筛选...');
  const qualityIssues: QualityIssue[] = [];
  const validData: { data: RawToolData; index: number }[] = [];

  rawData.forEach((data, index) => {
    const qualityResult = performQualityCheck(data, index);
    
    if (!qualityResult.isValid) {
      console.log(`❌ [${index + 1}] 质量检测失败: ${data.name || '未知工具'}`);
      console.log(`   错误: ${qualityResult.errors.join(', ')}`);
      qualityIssues.push({
        index,
        name: data.name || '未知工具',
        errors: qualityResult.errors,
        warnings: qualityResult.warnings
      });
    } else {
      if (qualityResult.warnings.length > 0) {
        console.log(`⚠️  [${index + 1}] 质量警告: ${data.name}`);
        console.log(`   警告: ${qualityResult.warnings.join(', ')}`);
      } else {
        console.log(`✅ [${index + 1}] 质量检测通过: ${data.name}`);
      }
      validData.push({ data, index });
    }
  });

  console.log(`\n📊 质量检测结果:`);
  console.log(`   ✅ 通过检测: ${validData.length} 个`);
  console.log(`   ❌ 质量问题: ${qualityIssues.length} 个`);

  if (validData.length === 0) {
    console.log('\n❌ 没有工具通过质量检测，导入终止。');
    process.exit(1);
  }

  // 第三阶段：网站可访问性检测
  let websiteValidTools: { tool: Tool; index: number }[] = [];
  let websiteIssues: WebsiteIssue[] = [];
  let batchResults: BatchResult[] = [];

  if (!skipWebsiteCheck) {
    console.log('\n🌐 第三阶段：网站可访问性检测...');
    console.log(`⚙️  配置: ${CHECK_CONFIG.CONCURRENT_CHECKS}个并发检测，每批间隔${CHECK_CONFIG.BATCH_DELAY}ms`);
    console.log(`⏱️  预计需要时间: ${Math.ceil(validData.length / CHECK_CONFIG.CONCURRENT_CHECKS * (CHECK_CONFIG.TIMEOUT + CHECK_CONFIG.BATCH_DELAY) / 1000 / 60)} 分钟`);

    // 分批处理
    for (let i = 0; i < validData.length; i += CHECK_CONFIG.CONCURRENT_CHECKS) {
      const { validTools: batchValidTools, websiteIssues: batchWebsiteIssues, batchResult } = 
        await checkWebsitesBatch(validData, i, CHECK_CONFIG.CONCURRENT_CHECKS, false);

      websiteValidTools.push(...batchValidTools);
      websiteIssues.push(...batchWebsiteIssues);
      batchResults.push(batchResult);

      // 如果不是最后一批，等待一下
      if (i + CHECK_CONFIG.CONCURRENT_CHECKS < validData.length) {
        console.log(`⏳ 等待${CHECK_CONFIG.BATCH_DELAY}ms...\n`);
        await new Promise(resolve => setTimeout(resolve, CHECK_CONFIG.BATCH_DELAY));
      }
    }

    console.log('\n📊 网站检测结果:');
    console.log(`   ✅ 网站有效: ${websiteValidTools.length} 个`);
    console.log(`   ❌ 网站无效: ${websiteIssues.length} 个`);
  } else {
    console.log('\n⚡ 第三阶段：跳过网站检测...');
    const { validTools, websiteIssues: issues, batchResult } = 
      await checkWebsitesBatch(validData, 0, validData.length, true);
    websiteValidTools = validTools;
    websiteIssues = issues;
    batchResults = [batchResult];
  }

  if (websiteValidTools.length === 0) {
    console.log('\n❌ 没有工具通过网站检测，导入终止。');
    process.exit(1);
  }

  // 第四阶段：检查重复
  console.log('\n🔍 第四阶段：检查数据库重复...');
  const { uniqueTools, duplicates } = await checkDuplicates(websiteValidTools);
  
  console.log(`📊 重复检测结果:`);
  console.log(`   ✅ 唯一工具: ${uniqueTools.length} 个`);
  console.log(`   ⚠️  重复工具: ${duplicates.length} 个`);

  if (uniqueTools.length === 0) {
    console.log('\n❌ 所有工具都已存在于数据库中，导入终止。');
    process.exit(1);
  }

  // 第五阶段：保存到数据库
  const { successfulImports, importFailures } = await saveToolsToDatabase(uniqueTools);

  console.log('\n📊 数据库保存结果:');
  console.log(`   ✅ 成功保存: ${successfulImports.length} 个工具`);
  console.log(`   ❌ 保存失败: ${importFailures.length} 个工具`);

  // 生成报告
  const reportPath = path.join(process.cwd(), 'import_report.json');
  const avgResponseTime = batchResults.length > 0 
    ? Math.round(batchResults.reduce((sum, batch) => sum + batch.averageResponseTime, 0) / batchResults.length)
    : undefined;

  const report: ImportReport = {
    generatedAt: new Date().toISOString(),
    sourceFile: path.resolve(filePath),
    fileType: path.extname(filePath).toLowerCase(),
    totalParsed: rawData.length,
    qualityFiltered: qualityIssues.length,
    websiteFiltered: websiteIssues.length,
    duplicateFiltered: duplicates.length,
    successfullyImported: successfulImports.length,
    failedToImport: importFailures.length,
    validityRate: ((successfulImports.length / rawData.length) * 100).toFixed(2) + '%',
    websiteCheckEnabled: !skipWebsiteCheck,
    averageResponseTime: avgResponseTime,
    batchDetails: batchResults,
    qualityIssues,
    websiteIssues,
    duplicateIssues: duplicates,
    importFailures,
    successfulImports,
    errors
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n📄 详细导入报告已生成: ${reportPath}`);

  // 显示总结
  console.log('\n📊 导入总结:');
  console.log(`   📁 源文件: ${path.basename(filePath)} (${report.fileType})`);
  console.log(`   📄 总记录数: ${rawData.length} 个`);
  console.log(`   🔍 质量筛选: 过滤 ${qualityIssues.length} 个`);
  if (!skipWebsiteCheck) {
    console.log(`   🌐 网站检测: 过滤 ${websiteIssues.length} 个`);
    console.log(`   ⏱️  平均响应时间: ${avgResponseTime}ms`);
  }
  console.log(`   🔄 重复检测: 过滤 ${duplicates.length} 个`);
  console.log(`   ✅ 成功导入: ${successfulImports.length} 个`);
  console.log(`   ❌ 导入失败: ${importFailures.length} 个`);
  console.log(`   📈 成功率: ${report.validityRate}`);

  console.log('\n🎉 文件批量导入流程完成！');

  // 显示详细的失败信息
  if (qualityIssues.length > 0) {
    console.log('\n❌ 质量问题详情:');
    qualityIssues.slice(0, 5).forEach(issue => {
      console.log(`   [${issue.index + 1}] ${issue.name}: ${issue.errors.join(', ')}`);
    });
    if (qualityIssues.length > 5) {
      console.log(`   ... 还有 ${qualityIssues.length - 5} 个质量问题`);
    }
  }

  if (websiteIssues.length > 0) {
    console.log('\n🌐 网站问题详情:');
    websiteIssues.slice(0, 5).forEach(issue => {
      console.log(`   [${issue.index + 1}] ${issue.name}: ${issue.reason}`);
    });
    if (websiteIssues.length > 5) {
      console.log(`   ... 还有 ${websiteIssues.length - 5} 个网站问题`);
    }
  }

  if (duplicates.length > 0) {
    console.log('\n⚠️  重复工具详情:');
    duplicates.slice(0, 5).forEach(duplicate => {
      console.log(`   [${duplicate.index + 1}] ${duplicate.name}: ${duplicate.reason}`);
    });
    if (duplicates.length > 5) {
      console.log(`   ... 还有 ${duplicates.length - 5} 个重复工具`);
    }
  }
}

// 主函数
if (require.main === module) {
  const args = process.argv.slice(2);
  const filePath = args[0];
  const skipWebsiteCheck = args.includes('--skip-check');

  if (!filePath) {
    console.error('❌ 请提供文件路径');
    console.error('用法: npx tsx src/scripts/importFromFile.ts <file-path> [--skip-check]');
    process.exit(1);
  }

  importFromFile(filePath, skipWebsiteCheck).catch(console.error);
}

export { importFromFile };