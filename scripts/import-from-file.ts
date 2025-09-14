#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { parse as parseCSV } from 'csv-parse/sync';
import { normalizeCategory } from '../src/utils/normalizeCategory';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

/**
 * 工具数据接口（从文件读取的原始数据）
 */
interface RawToolData {
  name: string;
  url: string;
  category: string;
  description: string;
  pricing: string;
  logo?: string; // 输入时可选，但不会使用
}

/**
 * 处理后的工具数据接口
 */
interface ProcessedToolData {
  name: string;
  url: string;
  category: string;
  description: string;
  pricing: string;
  logo: string; // 自动生成后必有
}

/**
 * 数据库工具表结构
 */
interface DatabaseTool {
  id?: string;
  name: string;
  website: string; // 注意：数据库中字段名是 website，不是 url
  category: string;
  description: string;
  short_description?: string;
  pricing: string;
  pricing_model: string;
  logo: string;
  rating?: number;
  review_count?: number;
  tags?: string[];
  features?: string[];
  likes?: number;
  views?: number;
  created_at?: string;
  last_updated?: string;
}

/**
 * URL检测结果
 */
interface UrlCheckResult {
  accessible: boolean;
  statusCode?: number;
  responseTime: number;
  error?: string;
}

/**
 * Logo处理结果
 */
interface LogoResult {
  url: string;
  source: 'clearbit' | 'google' | 'default';
}

/**
 * 从定价信息中提取定价模式
 */
function extractPricingModel(pricing: string): 'free' | 'paid' | 'freemium' {
  if (!pricing) return 'freemium';
  
  const lowerPricing = pricing.toLowerCase();
  
  // 完全免费
  if (lowerPricing.includes('free') && !lowerPricing.includes('trial') && !lowerPricing.includes('$') && !lowerPricing.includes('paid')) {
    return 'free';
  }
  
  // Freemium模式：既有免费又有付费选项
  if (lowerPricing.includes('freemium') || 
      (lowerPricing.includes('free') && (lowerPricing.includes('paid') || lowerPricing.includes('$') || lowerPricing.includes('subscription')))) {
    return 'freemium';
  }
  
  // 默认为付费
  return 'paid';
}

/**
 * 工具处理状态枚举
 */
type ToolStatus = 'success' | 'skipped_duplicate' | 'suspected_wrong_site' | 'failed_validation' | 'failed_url_check' | 'failed_import';

/**
 * 工具处理结果
 */
interface ToolResult {
  status: ToolStatus;
  url: string;
  name: string;
  reason?: string;
  details?: {
    logo?: string;
    logoSource?: string;
    action?: 'inserted' | 'updated';
    error?: string;
    pageTitle?: string;
    pageDescription?: string;
  };
}

/**
 * 网站内容校验结果
 */
interface ContentValidationResult {
  isValid: boolean;
  pageTitle: string;
  pageDescription: string;
  reason?: string;
}

/**
 * 导入报告
 */
interface ImportReport {
  timestamp: string;
  mode: 'safe' | 'fast';
  sourceFile: string;
  fileType: 'json' | 'csv';
  statistics: {
    total: number;
    success: number;
    skipped_duplicate: number;
    suspected_wrong_site: number;
    failed: number;
    failed_validation: number;
    failed_url_check: number;
    failed_import: number;
    processingTimeMs: number;
    averageUrlCheckTimeMs?: number;
  };
  logoStatistics: {
    clearbitSuccess: number;
    googleFallback: number;
    defaultFallback: number;
  };
  details: ToolResult[];
}

/**
 * 配置常量
 */
const CONFIG = {
  URL_CHECK: {
    TIMEOUT: 8000, // 8秒超时
    CONCURRENT: 8, // 8个并发
    MAX_RETRIES: 2, // 重试2次
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  LOGO: {
    TIMEOUT: 5000, // 5秒超时
    DEFAULT_LOGO: '/logos/default.png'
  }
};

/**
 * Logo缓存（避免重复请求同一域名）
 */
const logoCache = new Map<string, LogoResult>();

/**
 * 初始化 Supabase 客户端
 */
const initSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ 缺少 Supabase 环境变量');
    console.error('请确保在 .env.local 文件中设置了：');
    console.error('- NEXT_PUBLIC_SUPABASE_URL');
    console.error('- SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};

/**
 * 从文件读取工具数据
 */
function readToolsFromFile(filePath: string): RawToolData[] {
  const fullPath = path.resolve(filePath);
  const fileExt = path.extname(fullPath).toLowerCase();
  
  console.log(`📁 读取文件: ${fullPath}`);
  console.log(`📄 文件类型: ${fileExt}`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`文件不存在: ${fullPath}`);
  }
  
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  let rawData: any[];
  
  if (fileExt === '.json') {
    const jsonData = JSON.parse(fileContent);
    rawData = Array.isArray(jsonData) ? jsonData : [jsonData];
  } else if (fileExt === '.csv') {
    rawData = parseCSV(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  } else {
    throw new Error(`不支持的文件格式: ${fileExt}，仅支持 .json 和 .csv`);
  }
  
  // 标准化字段名称（支持 url/website 字段名的兼容）
  const tools: RawToolData[] = rawData.map((item: any) => ({
    name: item.name || '',
    url: item.url || item.website || '',
    category: normalizeCategory(item.category || ''), // 🔧 应用类别标准化
    description: item.description || '',
    pricing: item.pricing || item.pricingModel || '未知'
  }));
  
  console.log(`✅ 成功读取 ${tools.length} 条记录`);
  return tools;
}

/**
 * 验证工具数据的完整性
 */
function validateToolData(tool: RawToolData): string[] {
  const errors: string[] = [];
  
  if (!tool.name || tool.name.trim() === '') {
    errors.push('name 字段不能为空');
  }
  
  if (!tool.url || tool.url.trim() === '') {
    errors.push('url 字段不能为空');
  } else {
    try {
      new URL(tool.url);
    } catch {
      errors.push('url 格式无效');
    }
  }
  
  if (!tool.description || tool.description.trim() === '') {
    errors.push('description 字段不能为空');
  }
  
  if (!tool.category || tool.category.trim() === '') {
    errors.push('category 字段不能为空');
  }
  
  return errors;
}

/**
 * 检测单个URL的可访问性
 */
async function checkUrlAccessibility(url: string, retries = 0): Promise<UrlCheckResult> {
  const startTime = Date.now();
  
  try {
    // 首先尝试 HEAD 请求
    const response = await axios.head(url, {
      timeout: CONFIG.URL_CHECK.TIMEOUT,
      headers: {
        'User-Agent': CONFIG.URL_CHECK.USER_AGENT
      },
      validateStatus: (status) => {
        // 200-399 为成功，403 特殊情况也允许
        return (status >= 200 && status < 400) || status === 403;
      }
    });
    
    return {
      accessible: true,
      statusCode: response.status,
      responseTime: Date.now() - startTime
    };
  } catch (error: any) {
    // HEAD 失败，尝试 GET 请求
    try {
      const getResponse = await axios.get(url, {
        timeout: CONFIG.URL_CHECK.TIMEOUT,
        headers: {
          'User-Agent': CONFIG.URL_CHECK.USER_AGENT
        },
        validateStatus: (status) => (status >= 200 && status < 400) || status === 403,
        maxRedirects: 5
      });
      
      return {
        accessible: true,
        statusCode: getResponse.status,
        responseTime: Date.now() - startTime
      };
    } catch (getError: any) {
      // 重试逻辑
      if (retries < CONFIG.URL_CHECK.MAX_RETRIES) {
        console.log(`⚠️  重试 ${retries + 1}/${CONFIG.URL_CHECK.MAX_RETRIES}: ${url}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
        return checkUrlAccessibility(url, retries + 1);
      }
      
      return {
        accessible: false,
        responseTime: Date.now() - startTime,
        error: getError.code || getError.message || '连接失败'
      };
    }
  }
}

/**
 * 并发检测多个URL的可访问性
 */
async function checkUrlsInBatches(urls: string[]): Promise<Map<string, UrlCheckResult>> {
  const results = new Map<string, UrlCheckResult>();
  const batches: string[][] = [];
  
  // 分批处理
  for (let i = 0; i < urls.length; i += CONFIG.URL_CHECK.CONCURRENT) {
    batches.push(urls.slice(i, i + CONFIG.URL_CHECK.CONCURRENT));
  }
  
  console.log(`🌐 开始检测 ${urls.length} 个URL，${CONFIG.URL_CHECK.CONCURRENT}个并发，共${batches.length}批`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`📋 检查第 ${i + 1} 批 (${i * CONFIG.URL_CHECK.CONCURRENT + 1}-${Math.min((i + 1) * CONFIG.URL_CHECK.CONCURRENT, urls.length)}/${urls.length})`);
    
    const batchPromises = batch.map(async (url) => {
      const result = await checkUrlAccessibility(url);
      results.set(url, result);
      
      if (result.accessible) {
        console.log(`   ✅ ${url} (${result.statusCode}) - ${result.responseTime}ms`);
      } else {
        console.log(`   ❌ ${url} - ${result.error} - ${result.responseTime}ms`);
      }
      
      return result;
    });
    
    await Promise.all(batchPromises);
    
    // 批次间延迟
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
}

/**
 * 规范化域名，移除无关的部分并统一格式
 */
function normalizeDomain(domain: string): string {
  return domain
    .toLowerCase() // 转为小写
    .replace(/^www\d*\./, '') // 移除www. www1. www2. 等前缀
    .replace(/\.+$/, '') // 移除末尾的点
    .replace(/^\.+/, '') // 移除开头的点
    .replace(/\.(com?|net|org|io|ai|app)\..+$/, '.$1') // 简化国家顶级域名，如 .com.cn -> .com
    .trim(); // 移除首尾空格
}

/**
 * 从URL提取域名并规范化
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return normalizeDomain(urlObj.hostname);
  } catch {
    return '';
  }
}

/**
 * 检查网站内容是否与工具名称匹配
 * 抓取页面的 title 和 meta description，检查是否包含工具名称关键词
 */
async function validateWebsiteContent(url: string, toolName: string, retries = 0): Promise<ContentValidationResult> {
  try {
    console.log(`🔍 验证网站内容: ${url}`);
    
    // 获取完整的页面内容
    const response = await axios.get(url, {
      timeout: CONFIG.URL_CHECK.TIMEOUT,
      headers: {
        'User-Agent': CONFIG.URL_CHECK.USER_AGENT
      },
      maxRedirects: 5
    });
    
    // 解析 HTML 内容
    const html = response.data;
    
    // 提取 title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : '';
    
    // 提取 meta description
    const descMatch = html.match(/<meta[^>]*name=['"]*description['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
    const pageDescription = descMatch ? descMatch[1].trim() : '';
    
    // 清理和规范化文本
    const cleanTitle = pageTitle.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');
    const cleanDescription = pageDescription.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');
    const cleanToolName = toolName.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');
    
    // 提取工具名称的关键词（忽略常见词汇）
    const stopWords = new Set(['ai', 'app', 'tool', 'software', 'platform', 'service', 'the', 'a', 'an', 'and', 'or', 'but', 'for', 'to', 'of', 'in', 'on', 'at']);
    const toolKeywords = cleanToolName
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .filter(word => word.trim() !== '');
    
    // 检查关键词是否在标题或描述中出现
    let matchedKeywords = 0;
    let totalKeywords = toolKeywords.length;
    
    if (totalKeywords === 0) {
      // 如果没有有效关键词，使用完整工具名称进行模糊匹配
      const isInTitle = cleanTitle.includes(cleanToolName);
      const isInDescription = cleanDescription.includes(cleanToolName);
      
      return {
        isValid: isInTitle || isInDescription,
        pageTitle,
        pageDescription,
        reason: isInTitle || isInDescription ? 
          `工具名称 "${toolName}" 在页面内容中找到` : 
          `工具名称 "${toolName}" 在页面标题或描述中未找到`
      };
    }
    
    // 计算关键词匹配度
    for (const keyword of toolKeywords) {
      if (cleanTitle.includes(keyword) || cleanDescription.includes(keyword)) {
        matchedKeywords++;
      }
    }
    
    const matchRatio = matchedKeywords / totalKeywords;
    const isValid = matchRatio >= 0.5; // 至少50%的关键词匹配
    
    return {
      isValid,
      pageTitle,
      pageDescription,
      reason: isValid ? 
        `${matchedKeywords}/${totalKeywords} 关键词匹配，匹配度: ${(matchRatio * 100).toFixed(1)}%` :
        `仅 ${matchedKeywords}/${totalKeywords} 关键词匹配，匹配度过低: ${(matchRatio * 100).toFixed(1)}%`
    };
    
  } catch (error: any) {
    // 重试逻辑
    if (retries < CONFIG.URL_CHECK.MAX_RETRIES) {
      console.log(`⚠️  内容验证重试 ${retries + 1}/${CONFIG.URL_CHECK.MAX_RETRIES}: ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
      return validateWebsiteContent(url, toolName, retries + 1);
    }
    
    return {
      isValid: false,
      pageTitle: '',
      pageDescription: '',
      reason: `无法获取页面内容: ${error.code || error.message || '未知错误'}`
    };
  }
}
async function generateLogoUrl(url: string): Promise<LogoResult> {
  const domain = extractDomain(url);
  
  if (!domain) {
    return { url: CONFIG.LOGO.DEFAULT_LOGO, source: 'default' };
  }
  
  // 检查缓存
  if (logoCache.has(domain)) {
    return logoCache.get(domain)!;
  }
  
  // 尝试 Clearbit Logo API
  const clearbitUrl = `https://logo.clearbit.com/${domain}`;
  try {
    const response = await axios.head(clearbitUrl, { 
      timeout: CONFIG.LOGO.TIMEOUT,
      validateStatus: (status) => status === 200
    });
    
    if (response.status === 200) {
      const result = { url: clearbitUrl, source: 'clearbit' as const };
      logoCache.set(domain, result);
      return result;
    }
  } catch {
    // Clearbit 失败，继续尝试 Google
  }
  
  // 尝试 Google Favicon API
  const googleUrl = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
  try {
    const response = await axios.head(googleUrl, { 
      timeout: CONFIG.LOGO.TIMEOUT,
      validateStatus: (status) => status === 200
    });
    
    if (response.status === 200) {
      const result = { url: googleUrl, source: 'google' as const };
      logoCache.set(domain, result);
      return result;
    }
  } catch {
    // Google 也失败，使用默认
  }
  
  // 使用默认Logo
  const result = { url: CONFIG.LOGO.DEFAULT_LOGO, source: 'default' as const };
  logoCache.set(domain, result);
  return result;
}

/**
 * 检查数据库中是否存在重复的网站
 * 返回已存在的URL集合
 */
async function checkDuplicateWebsites(supabase: any, websites: string[]): Promise<Set<string>> {
  try {
    console.log(`🔍 检查 ${websites.length} 个URL是否在数据库中已存在...`);
    
    const duplicateUrls = new Set<string>();
    const batchSize = 50; // 每批处理50个URL，避免查询过长
    
    // 分批查询，避免单次查询URL过多
    for (let i = 0; i < websites.length; i += batchSize) {
      const batch = websites.slice(i, i + batchSize);
      
      try {
        const { data: existingTools, error } = await supabase
          .from('tools')
          .select('website')
          .in('website', batch);
        
        if (error) {
          console.error(`❌ 批次 ${Math.floor(i/batchSize) + 1} 查询错误:`, error);
          continue; // 继续处理下一批
        }
        
        // 将找到的重复URL添加到集合中
        existingTools?.forEach((tool: any) => {
          if (tool.website) {
            duplicateUrls.add(tool.website);
          }
        });
        
        // 添加小延迟，避免请求过于频繁
        if (i + batchSize < websites.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (batchError) {
        console.error(`❌ 批次 ${Math.floor(i/batchSize) + 1} 处理异常:`, batchError);
        continue; // 继续处理下一批
      }
    }
    
    console.log(`📊 发现 ${duplicateUrls.size} 个URL在数据库中已存在`);
    return duplicateUrls;
    
  } catch (error) {
    console.error('❌ 检查重复网站时出错:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : '',
      hint: '尝试使用 fast 模式跳过重复检查',
      code: error instanceof Error && 'code' in error ? error.code : ''
    });
    return new Set<string>();
  }
}

/**
 * 将工具保存到数据库
 */
async function saveToolToDatabase(supabase: any, tool: ProcessedToolData): Promise<{ success: boolean; action: 'inserted' | 'updated'; error?: string }> {
  try {
    // 准备数据库记录 - 生成UUID作为ID，包含所有必需字段
    const dbTool = {
      id: crypto.randomUUID(), // 生成新的UUID
      name: tool.name,
      website: tool.url, // 注意：数据库字段是 website
      category: tool.category,
      description: tool.description,
      short_description: tool.description.length > 100 ? tool.description.substring(0, 100) + '...' : tool.description,
      pricing: tool.pricing,
      pricing_model: extractPricingModel(tool.pricing), // 从pricing字段提取定价模式
      logo: tool.logo,
      rating: 0,
      review_count: 0,
      tags: [],
      features: [],
      likes: 0,
      views: 0,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    };
    
    // 使用 upsert 避免重复插入
    const { data, error } = await supabase
      .from('tools')
      .upsert(dbTool, {
        onConflict: 'website',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      return { success: false, action: 'inserted', error: error.message };
    }
    
    // 判断是插入还是更新
    const action = data && data.length > 0 ? 'updated' : 'inserted';
    return { success: true, action };
  } catch (error: any) {
    return { success: false, action: 'inserted', error: error.message };
  }
}

/**
 * 生成导入报告
 */
/**
 * 生成导入报告
 */
function generateImportReport(
  mode: 'safe' | 'fast',
  sourceFile: string,
  statistics: ImportReport['statistics'],
  logoStatistics: ImportReport['logoStatistics'],
  details: ToolResult[]
): ImportReport {
  return {
    timestamp: new Date().toISOString(),
    mode,
    sourceFile: path.basename(sourceFile),
    fileType: path.extname(sourceFile).slice(1) as 'json' | 'csv',
    statistics,
    logoStatistics,
    details
  };
}

/**
 * 保存导入报告到文件
 */
function saveImportReport(report: ImportReport): void {
  const reportPath = path.join(process.cwd(), 'import_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`📄 详细导入报告已生成: ${reportPath}`);
}

/**
 * 主函数
 */
async function main() {
  const startTime = Date.now();
  
  // 解析命令行参数
  const args = process.argv.slice(2);
  const skipWebsiteCheck = args.includes('--skip-website-check');
  const mode: 'safe' | 'fast' = skipWebsiteCheck ? 'fast' : 'safe';
  const filePath = skipWebsiteCheck ? args[args.length - 1] : args[0];
  
  if (!filePath) {
    console.error('❌ 请提供文件路径');
    console.error('用法: npm run import-from-file-safe <file> 或 npm run import-from-file-fast <file>');
    process.exit(1);
  }
  
  console.log('🚀 开始批量导入AI工具数据...');
  console.log(`📁 文件路径: ${filePath}`);
  console.log(`⚙️  导入模式: ${mode} ${mode === 'safe' ? '(严格模式：完整检测)' : '(快速模式：跳过检测)'}`);
  console.log('');
  
  const supabase = initSupabase();
  const results: ToolResult[] = [];
  const logoStatistics = { clearbitSuccess: 0, googleFallback: 0, defaultFallback: 0 };
  let urlCheckResults: Map<string, UrlCheckResult> = new Map();
  
  try {
    // 第一阶段：读取和验证文件数据
    console.log('📁 第一阶段：读取和验证文件数据...');
    const rawTools = readToolsFromFile(filePath);
    console.log('');
    
    // 第二阶段：数据完整性验证
    console.log('🔍 第二阶段：数据完整性验证...');
    const validTools: RawToolData[] = [];
    
    for (let i = 0; i < rawTools.length; i++) {
      const tool = rawTools[i];
      const validationErrors = validateToolData(tool);
      
      if (validationErrors.length > 0) {
        console.log(`❌ [${i + 1}] 验证失败: ${tool.name || '未知工具'}`);
        validationErrors.forEach(error => console.log(`   - ${error}`));
        
        results.push({
          status: 'failed_validation',
          url: tool.url || '',
          name: tool.name || '未知工具',
          reason: validationErrors.join(', ')
        });
      } else {
        validTools.push(tool);
        console.log(`✅ [${i + 1}] 验证通过: ${tool.name}`);
      }
    }
    
    console.log(`📊 验证结果: ✅ ${validTools.length} 个通过, ❌ ${rawTools.length - validTools.length} 个失败`);
    console.log('');
    
    // 第三阶段：数据库重复检查
    console.log('🔍 第三阶段：数据库重复检查...');
    const websites = validTools.map(tool => tool.url);
    const duplicateUrls = await checkDuplicateWebsites(supabase, websites);
    
    // 过滤重复工具
    const uniqueTools = validTools.filter(tool => {
      if (duplicateUrls.has(tool.url)) {
        console.log(`⚠️  [${tool.name}] 数据库中已存在相同URL，跳过导入`);
        
        results.push({
          status: 'skipped_duplicate',
          url: tool.url,
          name: tool.name,
          reason: '数据库中已存在相同URL'
        });
        return false;
      }
      return true;
    });
    
    console.log(`📊 重复检查结果: ✅ ${uniqueTools.length} 个唯一, ⚠️  ${validTools.length - uniqueTools.length} 个重复`);
    console.log('');
    
    // 第四阶段：URL可访问性检测（仅 safe 模式）
    let accessibleTools = uniqueTools;
    if (mode === 'safe' && uniqueTools.length > 0) {
      console.log('🌐 第四阶段：URL可访问性检测...');
      const urls = uniqueTools.map(tool => tool.url);
      urlCheckResults = await checkUrlsInBatches(urls);
      
      accessibleTools = uniqueTools.filter(tool => {
        const result = urlCheckResults.get(tool.url);
        if (!result?.accessible) {
          console.log(`❌ [${tool.name}] URL不可访问: ${result?.error || '未知错误'}`);
          
          results.push({
            status: 'failed_url_check',
            url: tool.url,
            name: tool.name,
            reason: result?.error || '无法访问'
          });
          return false;
        }
        return true;
      });
      
      console.log(`📊 URL检测结果: ✅ ${accessibleTools.length} 个可访问, ❌ ${uniqueTools.length - accessibleTools.length} 个无法访问`);
      console.log('');
    }
    
    // 第五阶段：网站内容校验（仅 safe 模式）
    let contentValidTools = accessibleTools;
    if (mode === 'safe' && accessibleTools.length > 0) {
      console.log('🔍 第五阶段：网站内容校验...');
      contentValidTools = [];
      
      for (let i = 0; i < accessibleTools.length; i++) {
        const tool = accessibleTools[i];
        console.log(`🔄 [${i + 1}/${accessibleTools.length}] 验证内容: ${tool.name}`);
        
        const contentResult = await validateWebsiteContent(tool.url, tool.name);
        
        if (contentResult.isValid) {
          contentValidTools.push(tool);
          console.log(`   ✅ 内容验证通过: ${contentResult.reason}`);
        } else {
          console.log(`   ⚠️  疑似错误网站: ${contentResult.reason}`);
          
          results.push({
            status: 'suspected_wrong_site',
            url: tool.url,
            name: tool.name,
            reason: contentResult.reason,
            details: {
              pageTitle: contentResult.pageTitle,
              pageDescription: contentResult.pageDescription
            }
          });
        }
      }
      
      console.log(`📊 内容校验结果: ✅ ${contentValidTools.length} 个通过, ⚠️  ${accessibleTools.length - contentValidTools.length} 个疑似错误网站`);
      console.log('');
    }
    
    // 第六阶段：Logo生成和数据库保存
    if (contentValidTools.length > 0) {
      console.log('💾 第六阶段：Logo生成和数据库保存...');
      console.log(`📤 准备处理 ${contentValidTools.length} 个工具`);
      
      for (let i = 0; i < contentValidTools.length; i++) {
        const tool = contentValidTools[i];
        console.log(`🔄 [${i + 1}/${contentValidTools.length}] 处理: ${tool.name}`);
        
        try {
          // 生成Logo
          const logoResult = await generateLogoUrl(tool.url);
          console.log(`   🎨 Logo来源: ${logoResult.source} (${logoResult.url})`);
          
          // 统计Logo结果
          switch (logoResult.source) {
            case 'clearbit': logoStatistics.clearbitSuccess++; break;
            case 'google': logoStatistics.googleFallback++; break;
            case 'default': logoStatistics.defaultFallback++; break;
          }
          
          // 准备完整的工具数据
          const processedTool: ProcessedToolData = {
            ...tool,
            logo: logoResult.url
          };
          
          // 保存到数据库
          const saveResult = await saveToolToDatabase(supabase, processedTool);
          
          if (saveResult.success) {
            results.push({
              status: 'success',
              url: tool.url,
              name: tool.name,
              details: {
                logo: logoResult.url,
                logoSource: logoResult.source,
                action: saveResult.action
              }
            });
            console.log(`   ✅ ${saveResult.action === 'inserted' ? '插入' : '更新'}成功`);
          } else {
            results.push({
              status: 'failed_import',
              url: tool.url,
              name: tool.name,
              reason: saveResult.error || '未知数据库错误'
            });
            console.log(`   ❌ 保存失败: ${saveResult.error}`);
          }
        } catch (error: any) {
          results.push({
            status: 'failed_import',
            url: tool.url,
            name: tool.name,
            reason: error.message || '处理过程中发生未知错误'
          });
          console.log(`   ❌ 处理失败: ${error.message}`);
        }
        
        console.log('');
      }
    } else {
      console.log('⚠️  没有可导入的工具，跳过数据库保存阶段');
    }
    
  } catch (error: any) {
    console.error('💥 导入过程中发生错误:', error.message);
    // 这里可以记录全局错误
  }
  
  // 生成统计信息
  const processingTime = Date.now() - startTime;
  const totalResponseTime = Array.from(urlCheckResults.values()).reduce((sum, result) => sum + result.responseTime, 0);
  const averageUrlCheckTime = urlCheckResults.size > 0 ? Math.round(totalResponseTime / urlCheckResults.size) : undefined;
  
  const statistics: ImportReport['statistics'] = {
    total: results.length > 0 ? results.length : 0,
    success: results.filter(r => r.status === 'success').length,
    skipped_duplicate: results.filter(r => r.status === 'skipped_duplicate').length,
    suspected_wrong_site: results.filter(r => r.status === 'suspected_wrong_site').length,
    failed: results.filter(r => r.status.startsWith('failed')).length,
    failed_validation: results.filter(r => r.status === 'failed_validation').length,
    failed_url_check: results.filter(r => r.status === 'failed_url_check').length,
    failed_import: results.filter(r => r.status === 'failed_import').length,
    processingTimeMs: processingTime,
    averageUrlCheckTimeMs: averageUrlCheckTime
  };
  
  // 生成和保存报告
  const report = generateImportReport(
    mode,
    filePath,
    statistics,
    logoStatistics,
    results
  );
  
  saveImportReport(report);
  
  // 输出最终结果
  console.log('📊 导入总结:');
  console.log(`   📁 源文件: ${report.sourceFile} (.${report.fileType})`);
  console.log(`   ⚙️  导入模式: ${mode}`);
  console.log(`   📄 总工具数: ${statistics.total} 个`);
  console.log(`   ✅ 成功导入: ${statistics.success} 个`);
  console.log(`   ⚠️  跳过重复: ${statistics.skipped_duplicate} 个`);
  console.log(`   🚫 疑似错误: ${statistics.suspected_wrong_site} 个`);
  console.log(`   ❌ 失败总数: ${statistics.failed} 个`);
  console.log(`     - 验证失败: ${statistics.failed_validation} 个`);
  console.log(`     - URL检测失败: ${statistics.failed_url_check} 个`);
  console.log(`     - 导入失败: ${statistics.failed_import} 个`);
  console.log(`   📈 成功率: ${statistics.total > 0 ? ((statistics.success / statistics.total) * 100).toFixed(2) : 0}%`);
  console.log(`   ⏱️  总耗时: ${(processingTime / 1000).toFixed(2)}秒`);
  
  console.log('');
  console.log('🎨 Logo处理统计:');
  console.log(`   🌐 Clearbit成功: ${logoStatistics.clearbitSuccess} 个`);
  console.log(`   🔍 Google降级: ${logoStatistics.googleFallback} 个`);
  console.log(`   🖼️  默认图片: ${logoStatistics.defaultFallback} 个`);
  
  const failedResults = results.filter(r => r.status.startsWith('failed'));
  if (failedResults.length > 0) {
    console.log('');
    console.log('❌ 失败详情:');
    failedResults.forEach(result => {
      console.log(`   - ${result.name}: ${result.reason}`);
    });
  }
  
  console.log('');
  console.log('🎉 批量导入流程完成！');
}

// 执行主函数
if (require.main === module) {
  main().catch(error => {
    console.error('💥 程序执行失败:', error);
    process.exit(1);
  });
}

export { main };