import fs from 'fs';
import path from 'path';
import { Tool } from '../types';

// 模拟 AI Collection 数据用于测试
const mockAITools = [
  {
    name: "ChatGPT",
    description: "OpenAI's conversational AI assistant that can help with writing, analysis, math, coding, and more.",
    website: "https://chat.openai.com",
    category: "General Writing",
    pricing: "Free / $20/month",
    tags: ["AI", "Writing", "Assistant", "Conversational"],
    featured: true
  },
  {
    name: "DALL-E 2",
    description: "AI system that can create realistic images and art from a description in natural language.",
    website: "https://openai.com/dall-e-2/",
    category: "Art & Image Generator",
    pricing: "$15 for 115 credits",
    tags: ["AI", "Image Generation", "Art", "Creative"],
    featured: true
  },
  {
    name: "GitHub Copilot",
    description: "AI pair programmer that helps you write code faster with fewer bugs.",
    website: "https://github.com/features/copilot",
    category: "Code & Database Assistant",
    pricing: "$10/month",
    tags: ["AI", "Coding", "Developer Tools", "Programming"],
    featured: false
  },
  {
    name: "Midjourney",
    description: "Independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species.",
    website: "https://www.midjourney.com",
    category: "Art & Image Generator",
    pricing: "$10-$60/month",
    tags: ["AI", "Image Generation", "Art", "Creative", "Discord"],
    featured: true
  },
  {
    name: "Notion AI",
    description: "AI writing assistant built into Notion that helps with writing, editing, summarizing, and more.",
    website: "https://www.notion.so/product/ai",
    category: "General Writing",
    pricing: "$10/month",
    tags: ["AI", "Writing", "Productivity", "Note-taking"],
    featured: false
  },
  {
    name: "Jasper AI",
    description: "AI content platform that helps teams create high-quality content faster.",
    website: "https://www.jasper.ai",
    category: "Copywriting",
    pricing: "$39-$99/month",
    tags: ["AI", "Content Creation", "Marketing", "Writing"],
    featured: false
  },
  {
    name: "Stable Diffusion",
    description: "Open source text-to-image model that generates high-quality images from text descriptions.",
    website: "https://stability.ai/stable-diffusion",
    category: "Art & Image Generator",
    pricing: "Free",
    tags: ["AI", "Image Generation", "Open Source", "Text-to-Image"],
    featured: true
  },
  {
    name: "Grammarly",
    description: "AI-powered writing assistant that helps improve your writing with grammar, spelling, and style suggestions.",
    website: "https://www.grammarly.com",
    category: "General Writing",
    pricing: "Free / $12-$15/month",
    tags: ["AI", "Writing", "Grammar", "Editing"],
    featured: false
  },
  {
    name: "Loom AI",
    description: "AI-powered video messaging tool that transcribes, summarizes, and creates chapters for your videos.",
    website: "https://www.loom.com",
    category: "Video",
    pricing: "Free / $8-$16/month",
    tags: ["AI", "Video", "Transcription", "Communication"],
    featured: false
  },
  {
    name: "Anthropic Claude",
    description: "AI assistant focused on being helpful, harmless, and honest for a wide variety of conversational and text processing tasks.",
    website: "https://www.anthropic.com/claude",
    category: "General Writing",
    pricing: "Free / $20/month",
    tags: ["AI", "Assistant", "Conversational", "Text Processing"],
    featured: true
  },
  {
    name: "RunwayML",
    description: "AI-powered creative toolkit for video editing, image generation, and more.",
    website: "https://runwayml.com",
    category: "Video Generator",
    pricing: "$12-$76/month",
    tags: ["AI", "Video Editing", "Creative", "Generation"],
    featured: false
  },
  {
    name: "Copy.ai",
    description: "AI copywriter that helps you create high-quality content for marketing, sales, and more.",
    website: "https://www.copy.ai",
    category: "Copywriting",
    pricing: "Free / $36-$186/month",
    tags: ["AI", "Copywriting", "Marketing", "Content"],
    featured: false
  }
];

// 从原始脚本导入转换函数
// import { 
//   generateId, 
//   generateShortDescription, 
//   mapPricingModel, 
//   convertTool,
//   CATEGORY_MAPPING 
// } from './importAICollection';

// 重新定义这些函数用于测试
function generateIdLocal(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function generateShortDescriptionLocal(description: string): string {
  if (description.length <= 100) return description;
  
  const sentences = description.split(/[.!?]+/);
  const firstSentence = sentences[0]?.trim();
  
  if (firstSentence && firstSentence.length <= 100) {
    return firstSentence + '.';
  }
  
  return description.substring(0, 97) + '...';
}

function mapPricingModelLocal(pricing?: string): 'free' | 'paid' | 'freemium' {
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

const CATEGORY_MAPPING_LOCAL: Record<string, string> = {
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

function convertToolLocal(aiTool: any): Tool {
  const id = generateIdLocal(aiTool.name);
  const category = aiTool.category ? CATEGORY_MAPPING_LOCAL[aiTool.category] || 'AI Tools' : 'AI Tools';
  const pricingModel = mapPricingModelLocal(aiTool.pricing);
  const shortDescription = generateShortDescriptionLocal(aiTool.description);
  
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
    lastUpdated: new Date().toISOString()
  };
}

// 测试导入函数
async function testImport() {
  console.log('🧪 开始测试数据转换...');
  
  const allTools: Tool[] = [];
  const errors: string[] = [];
  
  for (const aiTool of mockAITools) {
    try {
      const tool = convertToolLocal(aiTool);
      allTools.push(tool);
    } catch (error) {
      const errorMsg = `转换工具 ${aiTool.name} 失败: ${error}`;
      console.error(`❌ ${errorMsg}`);
      errors.push(errorMsg);
    }
  }
  
  console.log(`✅ 成功处理 ${allTools.length} 个工具`);
  
  if (errors.length > 0) {
    console.log(`⚠️  遇到 ${errors.length} 个错误:`);
    errors.forEach(error => console.log(`   - ${error}`));
  }
  
  // 创建 data 目录
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // 保存完整数据
  const outputPath = path.join(dataDir, 'ai-collection-tools.json');
  fs.writeFileSync(outputPath, JSON.stringify(allTools, null, 2), 'utf8');
  console.log(`💾 数据已保存到: ${outputPath}`);
  
  // 生成预览文件（前10个工具）
  const previewTools = allTools.slice(0, 10);
  const previewPath = path.join(dataDir, 'preview.json');
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
  testImport().catch(console.error);
}

export { testImport };
