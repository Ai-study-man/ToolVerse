#!/usr/bin/env npx tsx

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { normalizeCategory } from '../src/utils/normalizeCategory';

/**
 * 工具数据接口，与 import-from-file.ts 兼容
 */
interface ToolData {
  name: string;
  url: string;
  category: string;
  description: string;
  pricing: string;
}

/**
 * 解析结果统计
 */
interface ParseStats {
  totalLines: number;
  validTools: number;
  duplicatesRemoved: number;
  invalidUrls: number;
  categoriesFound: string[];
}

/**
 * GitHub README URL
 */
const README_URL = 'https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md';

/**
 * 输出文件路径
 */
const OUTPUT_FILE = path.join(process.cwd(), 'tools.json');

/**
 * 默认定价
 */
const DEFAULT_PRICING = 'Unknown';

/**
 * 从 GitHub 获取 README.md 内容
 * @returns README 文本内容
 */
async function fetchReadme(): Promise<string> {
  try {
    console.log('📥 正在获取 awesome-ai-tools README...');
    
    const response = await axios.get(README_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'ToolVerse-Fetcher/1.0'
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`GitHub API 返回状态码: ${response.status}`);
    }
    
    console.log(`✅ 成功获取 README，大小: ${Math.round(response.data.length / 1024)}KB`);
    return response.data;
    
  } catch (error: any) {
    console.error('❌ 获取 README 失败:', error.message);
    throw error;
  }
}

/**
 * 从章节标题提取分类名称
 * @param title 原始章节标题
 * @returns 简化的分类名称
 */
function extractCategory(title: string): string {
  // 移除标题前缀（# ## ### 等）
  const cleanTitle = title.replace(/^#+\s*/, '').trim();
  
  // 使用统一的分类标准化函数
  return normalizeCategory(cleanTitle);
}

/**
 * 解析 README 内容，提取工具信息
 * @param readmeContent README 文本内容
 * @returns 解析出的工具列表
 */
function parseTools(readmeContent: string): { tools: ToolData[], stats: ParseStats } {
  console.log('🔍 开始解析工具列表...');
  
  const tools: ToolData[] = [];
  const stats: ParseStats = {
    totalLines: 0,
    validTools: 0,
    duplicatesRemoved: 0,
    invalidUrls: 0,
    categoriesFound: []
  };
  
  const lines = readmeContent.split('\n');
  let currentCategory = 'Miscellaneous';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    stats.totalLines++;
    
    // 跳过空行和非内容行
    if (!line || line.startsWith('<!--') || line.startsWith('[![')) {
      continue;
    }
    
    // 检测章节标题
    if (line.startsWith('#')) {
      const newCategory = extractCategory(line);
      if (newCategory !== currentCategory) {
        currentCategory = newCategory;
        if (!stats.categoriesFound.includes(currentCategory)) {
          stats.categoriesFound.push(currentCategory);
        }
        console.log(`📂 发现分类: ${currentCategory}`);
      }
      continue;
    }
    
    // 解析工具条目 - 支持多种 Markdown 链接格式
    const linkPatterns = [
      // 标准格式: - [Tool Name](https://example.com) - Description
      /^[-*]\s*\[([^\]]+)\]\(([^)]+)\)\s*[-–—]\s*(.+)$/,
      // 简化格式: - [Tool Name](https://example.com): Description  
      /^[-*]\s*\[([^\]]+)\]\(([^)]+)\):\s*(.+)$/,
      // 纯链接格式: - [Tool Name](https://example.com)
      /^[-*]\s*\[([^\]]+)\]\(([^)]+)\)\s*$/,
      // 带描述的格式: - [Tool Name](https://example.com) Description
      /^[-*]\s*\[([^\]]+)\]\(([^)]+)\)\s+(.+)$/
    ];
    
    let match: RegExpMatchArray | null = null;
    let matchedPatternIndex = -1;
    
    // 尝试匹配不同的模式
    for (let j = 0; j < linkPatterns.length; j++) {
      match = line.match(linkPatterns[j]);
      if (match) {
        matchedPatternIndex = j;
        break;
      }
    }
    
    if (match) {
      const name = match[1].trim();
      const url = match[2].trim();
      let description = '';
      
      // 根据匹配的模式处理描述
      if (matchedPatternIndex === 0 || matchedPatternIndex === 1 || matchedPatternIndex === 3) {
        description = match[3]?.trim() || '';
      } else {
        // 对于纯链接格式，尝试从工具名推断描述
        description = `AI tool: ${name}`;
      }
      
      // 验证 URL 格式
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        stats.invalidUrls++;
        continue;
      }
      
      // 清理描述文本
      description = description
        .replace(/^[-–—]\s*/, '') // 移除开头的破折号
        .replace(/\*\*/g, '') // 移除粗体标记
        .replace(/`([^`]+)`/g, '$1') // 移除代码标记
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除内联链接，保留文本
        .trim();
      
      // 如果描述为空，使用默认描述
      if (!description) {
        description = `${name} - AI-powered tool`;
      }
      
      // 创建工具对象
      const tool: ToolData = {
        name: name,
        url: url,
        category: currentCategory,
        description: description,
        pricing: DEFAULT_PRICING
      };
      
      tools.push(tool);
      stats.validTools++;
      
      if (stats.validTools % 50 === 0) {
        console.log(`📊 已解析 ${stats.validTools} 个工具...`);
      }
    }
  }
  
  console.log(`✅ 解析完成，共找到 ${stats.validTools} 个有效工具`);
  console.log(`📁 发现 ${stats.categoriesFound.length} 个分类: ${stats.categoriesFound.join(', ')}`);
  
  return { tools, stats };
}

/**
 * 清洗数据：去重、验证、过滤
 * @param tools 原始工具列表
 * @returns 清洗后的工具列表
 */
function cleanData(tools: ToolData[]): { cleaned: ToolData[], duplicatesRemoved: number } {
  console.log('🧹 开始数据清洗...');
  
  const urlsSeen = new Set<string>();
  const cleaned: ToolData[] = [];
  let duplicatesRemoved = 0;
  
  for (const tool of tools) {
    // 标准化 URL（移除末尾斜杠，转换为小写域名）
    let normalizedUrl = tool.url.toLowerCase();
    if (normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    // 检查重复
    if (urlsSeen.has(normalizedUrl)) {
      duplicatesRemoved++;
      console.log(`🗑️  移除重复工具: ${tool.name} (${tool.url})`);
      continue;
    }
    
    // 验证必要字段
    if (!tool.name || !tool.url || !tool.description) {
      console.log(`⚠️  跳过无效工具: ${tool.name || 'Unknown'}`);
      continue;
    }
    
    // 验证 URL 格式
    try {
      new URL(tool.url);
    } catch {
      console.log(`⚠️  跳过无效URL: ${tool.url}`);
      continue;
    }
    
    urlsSeen.add(normalizedUrl);
    cleaned.push({
      name: tool.name.trim(),
      url: tool.url,
      category: normalizeCategory(tool.category.trim()),
      description: tool.description.trim(),
      pricing: tool.pricing.trim()
    });
  }
  
  console.log(`✅ 数据清洗完成，移除 ${duplicatesRemoved} 个重复项`);
  console.log(`📊 最终有效工具数: ${cleaned.length}`);
  
  return { cleaned, duplicatesRemoved };
}

/**
 * 保存工具列表到 JSON 文件
 * @param tools 清洗后的工具列表
 * @param stats 解析统计信息
 */
function saveJson(tools: ToolData[], stats: ParseStats): void {
  try {
    console.log(`💾 正在保存到 ${OUTPUT_FILE}...`);
    
    // 创建格式化的 JSON 内容
    const jsonContent = JSON.stringify(tools, null, 2);
    
    // 写入文件
    fs.writeFileSync(OUTPUT_FILE, jsonContent, 'utf-8');
    
    // 验证文件创建
    const fileStats = fs.statSync(OUTPUT_FILE);
    const fileSizeKB = Math.round(fileStats.size / 1024);
    
    console.log(`✅ 成功保存 ${tools.length} 个工具到 tools.json`);
    console.log(`📄 文件大小: ${fileSizeKB}KB`);
    console.log(`📁 文件位置: ${OUTPUT_FILE}`);
    
  } catch (error: any) {
    console.error('❌ 保存文件失败:', error.message);
    throw error;
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log('🚀 开始获取 awesome-ai-tools 数据...');
    console.log('');
    
    // 第一步：获取 README
    const readmeContent = await fetchReadme();
    console.log('');
    
    // 第二步：解析工具
    const { tools, stats } = parseTools(readmeContent);
    console.log('');
    
    // 第三步：清洗数据
    const { cleaned, duplicatesRemoved } = cleanData(tools);
    stats.duplicatesRemoved = duplicatesRemoved;
    console.log('');
    
    // 第四步：保存 JSON
    saveJson(cleaned, stats);
    console.log('');
    
    // 第五步：输出总结
    const processingTime = Math.round((Date.now() - startTime) / 1000);
    
    console.log('📊 处理总结:');
    console.log(`   📄 README 总行数: ${stats.totalLines}`);
    console.log(`   🔍 解析出工具数: ${stats.validTools}`);
    console.log(`   🗑️  移除重复数: ${stats.duplicatesRemoved}`);
    console.log(`   ❌ 无效 URL 数: ${stats.invalidUrls}`);
    console.log(`   ✅ 最终工具数: ${cleaned.length}`);
    console.log(`   📁 分类数: ${stats.categoriesFound.length}`);
    console.log(`   ⏱️  处理耗时: ${processingTime}秒`);
    console.log('');
    
    console.log('🎉 awesome-ai-tools 数据获取完成！');
    console.log(`📋 生成的 tools.json 文件可直接用于: npm run import-from-file-safe tools.json`);
    
  } catch (error: any) {
    console.error('💥 处理失败:', error.message);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main().catch(error => {
    console.error('💥 程序执行失败:', error);
    process.exit(1);
  });
}

export { main, fetchReadme, parseTools, cleanData, saveJson };