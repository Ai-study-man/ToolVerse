import { Tool } from '@/types';
import DataSyncService from '@/lib/dataSyncService';

/**
 * 根据工具ID获取工具信息（服务器端版本）
 */
export async function getToolByIdOrName(identifier: string): Promise<Tool | null> {
  try {
    // 直接从数据同步服务获取工具
    const tool = await DataSyncService.getToolById(identifier);
    if (tool) return tool;

    // 如果通过ID没找到，尝试通过名称搜索
    const allTools = await DataSyncService.getTools();
    
    // 找到最佳匹配（名称完全匹配或最相似的）
    const exactMatch = allTools.find((tool: Tool) => 
      tool.name.toLowerCase() === identifier.toLowerCase()
    );
    if (exactMatch) return exactMatch;
    
    // 如果没有完全匹配，查找包含该名称的工具
    const partialMatch = allTools.find((tool: Tool) => 
      tool.name.toLowerCase().includes(identifier.toLowerCase()) ||
      identifier.toLowerCase().includes(tool.name.toLowerCase())
    );
    if (partialMatch) return partialMatch;

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
  'fal-ai': 'Fal AI',
  'chatgpt': 'ChatGPT',
  'midjourney': 'Midjourney',
  'stable-diffusion': 'Stable Diffusion',
  'dall-e': 'DALL-E',
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
