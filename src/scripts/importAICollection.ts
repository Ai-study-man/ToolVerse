import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Tool } from '../types';

// AI Collection 原始数据接口
interface AICollectionTool {
  name: string;
  description: string;
  website: string;
  category?: string;
  pricing?: string;
  tags?: string[];
  featured?: boolean;
  [key: string]: any; // 允许其他字段
}

// 分类映射 - 将AI Collection的分类映射到你的分类
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
    logo: `/logos/${id}.png`, // 先设置默认路径，后续可以补充logo
    website: aiTool.website,
    category,
    pricingModel,
    pricing: aiTool.pricing || 'Contact for pricing',
    rating: 4.0 + Math.random() * 0.9, // 随机生成4.0-4.9的评分
    reviewCount: Math.floor(Math.random() * 100) + 10, // 随机生成10-110的评论数
    tags: aiTool.tags || [],
    features: [], // AI Collection数据中没有features字段，先留空
    createdAt: new Date().toISOString(),
    views: Math.floor(Math.random() * 1000) + 100,
    likes: Math.floor(Math.random() * 50) + 10,
    lastUpdated: new Date().toISOString()
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
    
    // 处理不同的YAML结构
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      // 如果是对象，尝试找到工具数组
      if (data.tools && Array.isArray(data.tools)) {
        return data.tools;
      } else if (data.items && Array.isArray(data.items)) {
        return data.items;
      } else {
        // 如果对象本身就是一个工具
        return [data];
      }
    }
    
    return [];
  } catch (error) {
    console.warn(`解析文件 ${filePath} 失败:`, error);
    return [];
  }
}

// 主导入函数
async function importAICollection() {
  const repoPath = process.argv[2];
  
  if (!repoPath) {
    console.error('请提供AI Collection仓库的本地路径');
    console.error('用法: npx tsx src/scripts/importAICollection.ts <ai-collection-repo-path>');
    process.exit(1);
  }
  
  const toolsDir = path.join(repoPath, 'tools');
  
  if (!fs.existsSync(toolsDir)) {
    console.error(`找不到tools目录: ${toolsDir}`);
    console.error('请确保提供的是AI Collection仓库的根目录路径');
    process.exit(1);
  }
  
  console.log('🔍 开始扫描YAML文件...');
  const yamlFiles = findYamlFiles(toolsDir);
  console.log(`📁 找到 ${yamlFiles.length} 个YAML文件`);
  
  const allTools: Tool[] = [];
  const errors: string[] = [];
  
  for (const filePath of yamlFiles) {
    console.log(`📄 处理文件: ${path.relative(repoPath, filePath)}`);
    
    try {
      const aiTools = parseYamlFile(filePath);
      
      for (const aiTool of aiTools) {
        if (!aiTool.name || !aiTool.description || !aiTool.website) {
          console.warn(`⚠️  跳过不完整的工具数据:`, aiTool);
          continue;
        }
        
        try {
          const tool = convertTool(aiTool);
          allTools.push(tool);
        } catch (error) {
          const errorMsg = `转换工具 ${aiTool.name} 失败: ${error}`;
          console.error(`❌ ${errorMsg}`);
          errors.push(errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = `处理文件 ${filePath} 失败: ${error}`;
      console.error(`❌ ${errorMsg}`);
      errors.push(errorMsg);
    }
  }
  
  console.log(`\n✅ 成功处理 ${allTools.length} 个工具`);
  
  if (errors.length > 0) {
    console.log(`⚠️  遇到 ${errors.length} 个错误:`);
    errors.forEach(error => console.log(`   - ${error}`));
  }
  
  // 保存为JSON文件
  const outputPath = path.join(process.cwd(), 'data', 'ai-collection-tools.json');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(allTools, null, 2), 'utf8');
  console.log(`💾 数据已保存到: ${outputPath}`);
  
  // 生成预览文件（前10个工具）
  const previewTools = allTools.slice(0, 10);
  const previewPath = path.join(process.cwd(), 'data', 'preview.json');
  fs.writeFileSync(previewPath, JSON.stringify(previewTools, null, 2), 'utf8');
  console.log(`👀 预览数据已保存到: ${previewPath} (前 ${previewTools.length} 个工具)`);
  
  // 在终端打印前3个工具的基本信息
  console.log(`\n📋 前 3 个工具预览:`);
  allTools.slice(0, 3).forEach((tool, index) => {
    console.log(`   ${index + 1}. ${tool.name}`);
    console.log(`      网站: ${tool.website}`);
    console.log(`      分类: ${tool.category}`);
    console.log(`      定价: ${tool.pricingModel} - ${tool.pricing}`);
    console.log(`      描述: ${tool.shortDescription}`);
    console.log('');
  });
  
  // 生成统计报告
  const categorySet = new Set(allTools.map(tool => tool.category));
  const categories = Array.from(categorySet);
  const pricingModels = allTools.reduce((acc, tool) => {
    acc[tool.pricingModel] = (acc[tool.pricingModel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📊 导入统计:');
  console.log(`   总工具数: ${allTools.length}`);
  console.log(`   分类数: ${categories.length}`);
  console.log(`   分类分布: ${categories.join(', ')}`);
  console.log(`   定价模式分布:`);
  Object.entries(pricingModels).forEach(([model, count]) => {
    console.log(`     ${model}: ${count}`);
  });
  
  return allTools;
}

// 如果直接运行此脚本
if (require.main === module) {
  importAICollection().catch(console.error);
}

export { importAICollection };
