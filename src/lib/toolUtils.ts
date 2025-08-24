import { Tool } from '@/types';
import DataSyncService from '@/lib/dataSyncService';

/**
 * 根据工具ID获取工具信息（服务器端版本）
 */
export async function getToolByIdOrName(identifier: string): Promise<Tool | null> {
  try {
    // 优先从所有工具中搜索，避免单独的Notion查询
    const allTools = await DataSyncService.getTools();
    
    // 首先通过ID精确匹配
    let exactMatch = allTools.find((tool: Tool) => tool.id === identifier);
    if (exactMatch) return exactMatch;
    
    // 尝试使用名称映射
    const mappedName = TOOL_NAME_MAPPING[identifier.toLowerCase()];
    if (mappedName) {
      exactMatch = allTools.find((tool: Tool) => 
        tool.name.toLowerCase() === mappedName.toLowerCase()
      );
      if (exactMatch) return exactMatch;
    }
    
    // 通过名称完全匹配
    exactMatch = allTools.find((tool: Tool) => 
      tool.name.toLowerCase() === identifier.toLowerCase()
    );
    if (exactMatch) return exactMatch;
    
    // 如果没有完全匹配，查找包含该名称的工具
    const partialMatch = allTools.find((tool: Tool) => 
      tool.name.toLowerCase().includes(identifier.toLowerCase()) ||
      identifier.toLowerCase().includes(tool.name.toLowerCase())
    );
    if (partialMatch) return partialMatch;

    // 最后尝试单独的Notion查询（作为备用）
    const tool = await DataSyncService.getToolById(identifier);
    if (tool) return tool;

    return null;
  } catch (error) {
    console.error('Error fetching tool:', error);
    return null;
  }
}

/**
 * 批量获取多个工具的信息
 */
export async function getMultipleTools(identifiers: string[]): Promise<(Tool | null)[]> {
  const promises = identifiers.map(id => getToolByIdOrName(id));
  return Promise.all(promises);
}

/**
 * 预定义的工具ID到名称的映射
 * 用于处理常见的工具引用
 */
export const TOOL_NAME_MAPPING: Record<string, string> = {
  'fal-ai': 'Fal.ai',
  'chatgpt': 'ChatGPT',
  'midjourney': 'Midjourney',
  'stable-diffusion': 'Stable Diffusion',
  'dall-e': 'DALL-E 3',
  'dall-e-3': 'DALL-E 3',
  'dalle-3': 'DALL-E 3',
  'imgcreator-ai': 'ImgCreator.ai',
  'lets-enhance': 'Let\'s Enhance',
  'upscale-ai': 'Upscale.ai',
  'waifu2x': 'Waifu2x',
  'real-esrgan': 'Real-ESRGAN',
  'claude': 'Claude',
  'gemini': 'Gemini',
  'copilot': 'GitHub Copilot',
  'cursor': 'Cursor',
  'v0': 'v0 by Vercel',
  'bolt': 'Bolt.new',
  'windsurf': 'Windsurf',
  'lovable': 'Lovable',
};

/**
 * 标准化工具标识符
 */
export function normalizeToolIdentifier(identifier: string): string {
  const lowerCase = identifier.toLowerCase().replace(/[-_\s]/g, '-');
  return TOOL_NAME_MAPPING[lowerCase] || identifier;
}
