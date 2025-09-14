import fs from 'fs';
import path from 'path';
import { Tool } from '../types';

// 生成大量测试数据用于演示批量导入
const categories = [
  'Writing & Content', 'Design & Art', 'Developer Tools', 'Video', 'Audio & Music',
  'Business & Sales', 'Marketing', 'Productivity', 'Education', 'Health & Medical',
  'Legal', 'Search', 'Research', 'Entertainment', 'Lifestyle', 'Travel', 'Utilities'
];

const pricingModels: Array<'free' | 'paid' | 'freemium'> = ['free', 'paid', 'freemium'];

const toolNames = [
  'AI Writer Pro', 'Smart Designer', 'Code Assistant Plus', 'Video Creator AI',
  'Voice Generator', 'Business Analytics', 'Marketing Genius', 'Task Manager AI',
  'Learning Companion', 'Health Tracker', 'Legal Advisor AI', 'Search Expert',
  'Research Helper', 'Fun Creator', 'Life Organizer', 'Trip Planner', 'Tool Master',
  'Content Wizard', 'Art Generator', 'Dev Helper', 'Video Editor Pro', 'Audio Enhancer',
  'Sales Booster', 'Ad Creator', 'Focus Helper', 'Study Buddy', 'Wellness AI',
  'Contract Helper', 'Info Finder', 'Data Analyzer', 'Game Creator', 'Style Guide',
  'Travel Buddy', 'Quick Tools', 'Text Master', 'Image AI', 'Code Reviewer',
  'Stream Creator', 'Music Maker', 'CRM Helper', 'Social Media AI', 'Time Tracker',
  'Course Builder', 'Fitness AI', 'Document AI', 'Knowledge Base', 'Insight Engine',
  'Entertainment Hub', 'Daily Planner', 'Journey AI', 'Swiss Army AI', 'Writing Assistant',
  'Creative Studio', 'Programming Buddy', 'Video Suite', 'Audio Studio', 'Business Hub',
  'Growth Hacker', 'Efficiency AI', 'Learning Lab', 'Health Hub', 'Legal Tech',
  'Discovery Engine', 'Analysis Pro', 'Fun Factory', 'Life Assistant', 'Adventure AI',
  'Utility Belt', 'Content Factory', 'Design Studio', 'Developer Console', 'Media Creator'
];

const descriptions = [
  'Advanced AI-powered tool that revolutionizes your workflow with cutting-edge technology.',
  'Intelligent assistant designed to boost productivity and streamline complex tasks.',
  'Next-generation platform that combines machine learning with intuitive user experience.',
  'Professional-grade solution for modern businesses and creative professionals.',
  'Innovative AI system that automates repetitive tasks and enhances creativity.',
  'Smart technology that adapts to your needs and learns from your preferences.',
  'Powerful tool that integrates seamlessly with your existing workflow and tools.',
  'State-of-the-art AI that delivers exceptional results with minimal effort required.',
  'Comprehensive solution that transforms how you approach your daily challenges.',
  'Revolutionary platform that combines efficiency with powerful AI capabilities.'
];

function generateId(name: string, index: number): string {
  return `${name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}-${index}`;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomTools(count: number): Tool[] {
  const tools: Tool[] = [];
  
  for (let i = 0; i < count; i++) {
    const name = getRandomItem(toolNames);
    const category = getRandomItem(categories);
    const pricingModel = getRandomItem(pricingModels);
    const description = getRandomItem(descriptions);
    const id = generateId(name, i + 1);
    
    // 根据定价模式生成合理的价格
    let pricing: string;
    switch (pricingModel) {
      case 'free':
        pricing = 'Free';
        break;
      case 'freemium':
        pricing = `Free / $${Math.floor(Math.random() * 50) + 10}/month`;
        break;
      case 'paid':
        pricing = `$${Math.floor(Math.random() * 100) + 20}/month`;
        break;
    }
    
    const tool: Tool = {
      id,
      name: `${name} ${i + 1}`,
      description,
      shortDescription: description.substring(0, 100),
      logo: `/logos/${id}.png`,
      website: `https://${id}.com`, // 使用完整ID确保唯一性
      category,
      pricingModel,
      pricing,
      rating: 3.5 + Math.random() * 1.5, // 3.5-5.0
      reviewCount: Math.floor(Math.random() * 500) + 10,
      tags: [
        'AI',
        category.split(' ')[0],
        pricingModel === 'free' ? 'Free' : 'Premium',
        ['Popular', 'New', 'Trending', 'Featured'][Math.floor(Math.random() * 4)]
      ],
      features: [],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      views: Math.floor(Math.random() * 5000) + 100,
      likes: Math.floor(Math.random() * 200) + 10,
      lastUpdated: new Date().toISOString()
    };
    
    tools.push(tool);
  }
  
  return tools;
}

async function generateLargeDataset() {
  console.log('🎲 生成大型测试数据集...');
  
  const toolCount = 150; // 生成150个工具用于测试
  const tools = generateRandomTools(toolCount);
  
  // 创建 data 目录
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // 保存完整数据
  const outputPath = path.join(dataDir, 'ai-collection-tools.json');
  fs.writeFileSync(outputPath, JSON.stringify(tools, null, 2), 'utf8');
  console.log(`💾 生成了 ${tools.length} 个工具，保存到: ${outputPath}`);
  
  // 生成统计报告
  const categoryStats = tools.reduce((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const pricingStats = tools.reduce((acc, tool) => {
    acc[tool.pricingModel] = (acc[tool.pricingModel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📊 数据集统计:');
  console.log(`   总工具数: ${tools.length}`);
  console.log(`   分类数: ${Object.keys(categoryStats).length}`);
  
  console.log('\n📈 分类分布:');
  Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([category, count]) => {
      console.log(`     ${category}: ${count} 个工具`);
    });
  
  console.log('\n💰 定价模式分布:');
  Object.entries(pricingStats).forEach(([model, count]) => {
    console.log(`     ${model}: ${count} 个工具`);
  });
  
  return tools;
}

// 如果直接运行此脚本
if (require.main === module) {
  generateLargeDataset().catch(console.error);
}

export { generateLargeDataset };
