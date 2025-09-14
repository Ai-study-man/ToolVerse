#!/usr/bin/env tsx
/**
 * AI Collection Tools Fetcher
 * 
 * 从 ai-collection/ai-collection 仓库获取 AI 工具数据
 * 并生成符合 import-from-file.ts 格式的 JSON 文件
 * 最后自动执行导入
 */

import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import simpleGit from 'simple-git';

// ==================== 类型定义 ====================

/**
 * AI Collection 工具数据格式（原始）
 */
interface AICollectionTool {
  name?: string;
  title?: string;
  website?: string;
  url?: string;
  description?: string;
  pricing?: string | any[];
  category?: string;
  tags?: string[];
  features?: string[];
  [key: string]: any;
}

/**
 * 导入脚本需要的格式
 */
interface ImportToolData {
  name: string;
  url: string;
  category: string;
  description: string;
  pricing: string;
}

/**
 * 统计信息
 */
interface Statistics {
  totalFound: number;
  processed: number;
  skipped: number;
  validTools: number;
  categories: { [key: string]: number };
  pricingTypes: { [key: string]: number };
}

// ==================== 配置 ====================

const CONFIG = {
  REPO_URL: 'https://github.com/ai-collection/ai-collection.git',
  TEMP_DIR: path.join(process.cwd(), 'temp-ai-collection'),
  OUTPUT_FILE: path.join(process.cwd(), 'tools.json'),
  TARGET_COUNT: 100,
  DATA_PATHS: [
    'data/tools',
    'tools',
    'src/data/tools',
    'content/tools'
  ],
  VALID_EXTENSIONS: ['.md', '.yaml', '.yml', '.json'],
  DEFAULT_CATEGORY: 'AI Tools',
  DEFAULT_DESCRIPTION: 'No description provided'
};

// ==================== 工具函数 ====================

/**
 * 清理临时目录
 */
async function cleanupTempDir(): Promise<void> {
  try {
    await fs.rmdir(CONFIG.TEMP_DIR, { recursive: true });
    console.log('🧹 清理临时目录');
  } catch (error) {
    // 目录不存在时忽略错误
  }
}

/**
 * 克隆或更新仓库
 */
async function cloneOrUpdateRepo(): Promise<void> {
  console.log('🔄 获取 AI Collection 仓库...');
  
  await cleanupTempDir();
  
  const git = simpleGit();
  
  try {
    await git.clone(CONFIG.REPO_URL, CONFIG.TEMP_DIR, ['--depth', '1']);
    console.log('✅ 仓库克隆成功');
  } catch (error) {
    console.error('❌ 克隆仓库失败:', error);
    throw error;
  }
}

/**
 * 检查目录是否存在
 */
async function dirExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * 递归读取目录中的文件
 */
async function readFilesRecursive(dirPath: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await readFilesRecursive(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (CONFIG.VALID_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  读取目录失败: ${dirPath}`, error);
  }
  
  return files;
}

/**
 * 解析 Markdown frontmatter
 */
function parseFrontmatter(content: string): AICollectionTool | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  
  try {
    const yaml = require('js-yaml');
    return yaml.load(frontmatterMatch[1]) as AICollectionTool;
  } catch (error) {
    return null;
  }
}

/**
 * 解析README文件中的工具数据
 */
async function parseREADMETools(filePath: string): Promise<ImportToolData[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  const tools: ImportToolData[] = [];
  
  // 更精确的正则表达式匹配工具条目
  const toolPattern = /### (.+?)\n<img[^>]*>\s*\n####\s*(.+?)\n\n\n?\n?\[Visit\]\((https:\/\/thataicollection\.com\/redirect\/([^?]+))/g;
  
  let match;
  while ((match = toolPattern.exec(content)) !== null) {
    const [, name, description, , toolId] = match;
    
    // 推断真实网站URL
    let websiteUrl = '';
    
    // 使用一些启发式规则来构建URL
    const cleanToolId = toolId.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // 常见的URL模式
    const urlPatterns = [
      `https://${cleanToolId}.com`,
      `https://${cleanToolId}.ai`,
      `https://${cleanToolId}.io`,
      `https://www.${cleanToolId}.com`,
      `https://${toolId}.com` // 保持原始格式
    ];
    
    // 选择最可能的URL（这里简单地选择.com）
    websiteUrl = urlPatterns[0];
    
    // 特殊处理一些已知工具
    const specialUrls: { [key: string]: string } = {
      'chatgpt': 'https://chat.openai.com',
      'midjourney': 'https://www.midjourney.com',
      'claude': 'https://claude.ai',
      'notion-ai': 'https://www.notion.so/product/ai',
      'dall-e': 'https://openai.com/dall-e-2',
      'github-copilot': 'https://github.com/features/copilot',
      'figma': 'https://www.figma.com',
      'canva': 'https://www.canva.com',
      'grammarly': 'https://www.grammarly.com'
    };
    
    if (specialUrls[cleanToolId]) {
      websiteUrl = specialUrls[cleanToolId];
    }
    
    tools.push({
      name: name.trim(),
      url: websiteUrl,
      category: 'AI Tools', // 稍后从章节标题中提取
      description: description.trim() || CONFIG.DEFAULT_DESCRIPTION,
      pricing: 'Freemium' // 默认为Freemium，符合大多数AI工具
    });
  }
  
  return tools;
}

/**
 * 从README文件中提取分类信息
 */
function extractCategoryFromREADME(content: string, toolName: string): string {
  // 查找工具在哪个分类章节下
  const lines = content.split('\n');
  let currentCategory = CONFIG.DEFAULT_CATEGORY;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检查是否是分类标题
    if (line.startsWith('## ') && !line.includes('Index') && !line.includes('Latest Additions')) {
      currentCategory = line.replace('## ', '').replace(/[^\w\s]/g, '').trim();
    }
    
    // 检查是否找到了目标工具
    if (line.startsWith(`### ${toolName}`)) {
      return currentCategory;
    }
  }
  
  return CONFIG.DEFAULT_CATEGORY;
}

/**
 * 标准化定价信息
 */
function normalizePricing(pricing: any): string {
  if (!pricing) return 'Free';
  
  if (typeof pricing === 'string') {
    return pricing;
  }
  
  if (Array.isArray(pricing)) {
    return pricing.join(' / ');
  }
  
  if (typeof pricing === 'object') {
    const values = Object.values(pricing).filter(v => v);
    return values.length > 0 ? values.join(' / ') : 'Free';
  }
  
  return String(pricing);
}

/**
 * 提取类别信息
 */
function extractCategory(tool: AICollectionTool, filePath: string): string {
  // 1. 直接的 category 字段
  if (tool.category) return tool.category;
  
  // 2. 从标签中提取
  if (tool.tags && tool.tags.length > 0) {
    return tool.tags[0];
  }
  
  // 3. 从文件路径中提取
  const pathParts = filePath.split(path.sep);
  for (let i = pathParts.length - 2; i >= 0; i--) {
    const part = pathParts[i];
    if (part !== 'tools' && part !== 'data' && !part.startsWith('.')) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
  }
  
  return CONFIG.DEFAULT_CATEGORY;
}

/**
 * 转换为导入格式
 */
function convertToImportFormat(tool: AICollectionTool, filePath: string): ImportToolData | null {
  // 提取名称
  const name = tool.name || tool.title;
  if (!name) return null;
  
  // 提取URL
  const url = tool.website || tool.url;
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return null;
  
  // 提取其他字段
  const category = extractCategory(tool, filePath);
  const description = tool.description || CONFIG.DEFAULT_DESCRIPTION;
  const pricing = normalizePricing(tool.pricing);
  
  return {
    name: name.trim(),
    url: url.trim(),
    category: category.trim(),
    description: description.trim(),
    pricing: pricing.trim()
  };
}

/**
 * 扫描并提取工具数据
 */
async function extractToolsData(): Promise<{ tools: ImportToolData[], stats: Statistics }> {
  console.log('🔍 扫描工具数据...');
  
  const tools: ImportToolData[] = [];
  const stats: Statistics = {
    totalFound: 0,
    processed: 0,
    skipped: 0,
    validTools: 0,
    categories: {},
    pricingTypes: {}
  };
  
  // 查找README文件
  const readmeFiles = [
    'README.md',
    'FULL_README.md',
    'README.zh-CN.md',
    'FULL_README.zh-CN.md'
  ];
  
  let readmeContent = '';
  let readmeFile = '';
  
  for (const filename of readmeFiles) {
    const filePath = path.join(CONFIG.TEMP_DIR, filename);
    try {
      readmeContent = await fs.readFile(filePath, 'utf-8');
      readmeFile = filename;
      console.log(`� 使用文件: ${filename}`);
      break;
    } catch (error) {
      continue;
    }
  }
  
  if (!readmeContent) {
    console.error('❌ 未找到README文件');
    return { tools, stats };
  }
  
  // 解析README中的工具数据
  const extractedTools = await parseREADMETools(path.join(CONFIG.TEMP_DIR, readmeFile));
  stats.totalFound = extractedTools.length;
  console.log(`📄 从 ${readmeFile} 中找到 ${extractedTools.length} 个工具`);
  
  // 随机打乱并选择目标数量的工具
  const shuffledTools = extractedTools.sort(() => Math.random() - 0.5);
  const selectedTools = shuffledTools.slice(0, CONFIG.TARGET_COUNT);
  
  // 为每个工具添加分类信息并验证
  for (const tool of selectedTools) {
    stats.processed++;
    
    // 提取分类信息
    tool.category = extractCategoryFromREADME(readmeContent, tool.name);
    
    // 简单验证
    if (!tool.name || !tool.url || !tool.description) {
      stats.skipped++;
      continue;
    }
    
    // 去重检查
    const exists = tools.some(t => 
      t.url === tool.url || 
      t.name.toLowerCase() === tool.name.toLowerCase()
    );
    
    if (exists) {
      stats.skipped++;
      continue;
    }
    
    tools.push(tool);
    stats.validTools++;
    
    // 统计
    stats.categories[tool.category] = (stats.categories[tool.category] || 0) + 1;
    stats.pricingTypes[tool.pricing] = (stats.pricingTypes[tool.pricing] || 0) + 1;
    
    if (tools.length % 10 === 0) {
      console.log(`📊 已提取 ${tools.length} 个工具`);
    }
  }
  
  return { tools, stats };
}

/**
 * 保存工具数据到文件
 */
async function saveToolsData(tools: ImportToolData[]): Promise<void> {
  console.log(`💾 保存 ${tools.length} 个工具到 ${CONFIG.OUTPUT_FILE}`);
  
  const jsonData = JSON.stringify(tools, null, 2);
  await fs.writeFile(CONFIG.OUTPUT_FILE, jsonData, 'utf-8');
  
  console.log('✅ 工具数据保存成功');
}

/**
 * 打印统计信息
 */
function printStatistics(stats: Statistics): void {
  console.log('\n📊 统计信息:');
  console.log(`   📄 扫描文件: ${stats.totalFound}`);
  console.log(`   🔄 处理文件: ${stats.processed}`);
  console.log(`   ⏭️  跳过文件: ${stats.skipped}`);
  console.log(`   ✅ 有效工具: ${stats.validTools}`);
  
  console.log('\n📂 分类分布:');
  Object.entries(stats.categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });
  
  console.log('\n💰 定价分布:');
  Object.entries(stats.pricingTypes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([pricing, count]) => {
      console.log(`   ${pricing}: ${count}`);
    });
}

/**
 * 执行导入命令
 */
async function executeImport(): Promise<void> {
  console.log('\n🚀 开始自动导入...');
  
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'import-from-file-safe', 'tools.json'], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ 自动导入完成');
        resolve();
      } else {
        console.error(`❌ 导入失败，退出码: ${code}`);
        reject(new Error(`导入进程退出码: ${code}`));
      }
    });
    
    child.on('error', (error) => {
      console.error('❌ 启动导入进程失败:', error);
      reject(error);
    });
  });
}

// ==================== 主函数 ====================

async function main(): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log('🎯 AI Collection 工具获取器');
    console.log(`📋 目标数量: ${CONFIG.TARGET_COUNT} 个工具`);
    console.log(`📁 输出文件: ${CONFIG.OUTPUT_FILE}`);
    console.log('');
    
    // 1. 克隆仓库
    await cloneOrUpdateRepo();
    
    // 2. 提取工具数据
    const { tools, stats } = await extractToolsData();
    
    if (tools.length === 0) {
      console.error('❌ 未找到任何有效的工具数据');
      return;
    }
    
    // 3. 保存数据
    await saveToolsData(tools);
    
    // 4. 打印统计
    printStatistics(stats);
    
    // 5. 清理临时目录
    await cleanupTempDir();
    
    // 6. 执行自动导入
    await executeImport();
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n🎉 完成！总耗时: ${duration}秒`);
    
  } catch (error) {
    console.error('💥 执行过程中发生错误:', error);
    await cleanupTempDir();
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

export default main;