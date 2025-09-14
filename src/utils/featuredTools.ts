/**
 * 特色工具筛选逻辑
 * 基于工具名称、描述和受欢迎程度来筛选知名AI工具
 */

import { Tool } from '@/types/tool';

// 知名AI工具关键词列表
const FAMOUS_AI_TOOLS = [
  // 顶级AI助手和聊天机器人
  'chatgpt', 'gpt', 'openai', 'claude', 'anthropic', 'gemini', 'bard', 'copilot',
  
  // 图像生成和设计工具
  'midjourney', 'dalle', 'dall-e', 'stable diffusion', 'leonardo', 'canva', 'figma',
  'adobe', 'photoshop', 'illustrator', 'runway', 'artbreeder',
  
  // 视频和音频工具
  'synthesia', 'heygen', 'elevenlabs', 'murf', 'descript', 'luma', 'pika',
  'fliki', 'pictory', 'invideo', 'kapwing',
  
  // 写作和内容工具
  'jasper', 'copy.ai', 'writesonic', 'grammarly', 'notion', 'obsidian',
  'otter.ai', 'transcribe', 'quillbot', 'hemingway',
  
  // 开发者工具
  'github copilot', 'cursor', 'v0', 'bolt', 'replit', 'codeium', 'tabnine',
  
  // 生产力工具
  'clickup', 'monday', 'linear', 'superhuman', 'calendly', 'zapier',
  'automation', 'workflow',
  
  // 营销和SEO工具
  'semrush', 'ahrefs', 'surfer', 'clearscope', 'frase', 'marketmuse',
  'hubspot', 'mailchimp', 'convertkit',
  
  // 数据分析和研究
  'tableau', 'power bi', 'looker', 'amplitude', 'mixpanel', 'hotjar',
  'perplexity', 'you.com', 'consensus'
];

// 高质量工具的特征关键词
const QUALITY_INDICATORS = [
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'automation',
  'generate', 'create', 'assistant', 'chatbot', 'analysis', 'optimization'
];

/**
 * 计算工具的知名度和质量分数
 */
export function calculateToolScore(tool: Tool): number {
  let score = 0;
  
  const name = tool.name.toLowerCase();
  const description = (tool.description || '').toLowerCase();
  const combined = `${name} ${description}`;
  
  // 1. 知名工具加分 (最高30分)
  for (const famousTool of FAMOUS_AI_TOOLS) {
    if (name.includes(famousTool) || description.includes(famousTool)) {
      score += famousTool.length > 5 ? 30 : 20; // 更长的关键词给更高分
      break; // 只计算一次知名工具分数
    }
  }
  
  // 2. 质量指标加分 (最高15分)
  let qualityScore = 0;
  for (const indicator of QUALITY_INDICATORS) {
    if (combined.includes(indicator)) {
      qualityScore += 3;
    }
  }
  score += Math.min(qualityScore, 15);
  
  // 3. 描述完整性加分 (最高10分)
  const descLength = tool.description?.length || 0;
  if (descLength > 100) score += 10;
  else if (descLength > 50) score += 5;
  
  // 4. 有logo加分 (5分)
  if (tool.logo) score += 5;
  
  // 5. 有网站链接加分 (5分)
  if (tool.website) score += 5;
  
  // 6. 免费工具轻微加分 (3分)
  if (tool.pricing?.toLowerCase().includes('free')) score += 3;
  
  // 7. 特定分类加分
  const category = tool.category?.toLowerCase() || '';
  const popularCategories = ['chatbots', 'image generation', 'writing', 'productivity', 'developer tools'];
  if (popularCategories.some(cat => category.includes(cat.replace(' ', '')))) {
    score += 5;
  }
  
  return score;
}

/**
 * 从工具列表中选择特色工具
 */
export function selectFeaturedTools(tools: Tool[], count: number = 8): Tool[] {
  if (!tools || tools.length === 0) return [];
  
  // 计算每个工具的分数并排序
  const scoredTools = tools
    .map(tool => ({
      tool,
      score: calculateToolScore(tool)
    }))
    .sort((a, b) => b.score - a.score);
  
  // 选择分数最高的工具，但确保分类多样性
  const selectedTools: Tool[] = [];
  const usedCategories: Set<string> = new Set();
  
  // 第一轮：选择不同分类的高分工具
  for (const { tool } of scoredTools) {
    if (selectedTools.length >= count) break;
    
    const category = tool.category || 'Other';
    if (!usedCategories.has(category) || usedCategories.size >= count / 2) {
      selectedTools.push(tool);
      usedCategories.add(category);
    }
  }
  
  // 第二轮：如果还没选够，选择剩余的高分工具
  if (selectedTools.length < count) {
    for (const { tool } of scoredTools) {
      if (selectedTools.length >= count) break;
      if (!selectedTools.find(t => t.id === tool.id)) {
        selectedTools.push(tool);
      }
    }
  }
  
  return selectedTools.slice(0, count);
}

/**
 * 获取特色工具的显示配置
 */
export function getFeaturedToolsConfig() {
  return {
    title: "Featured AI Tools",
    subtitle: "Discover the most popular and powerful AI tools that are transforming industries",
    count: 8, // 2行 x 4列
    layout: {
      rows: 2,
      columns: 4
    }
  };
}