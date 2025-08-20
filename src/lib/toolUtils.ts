import { Tool } from '@/types';

/**
 * 根据工具ID或名称获取工具信息（服务器端版本）
 */
export async function getToolByIdOrName(identifier: string): Promise<Tool | null> {
  try {
    // 首先尝试通过名称搜索（更可能匹配）
    const searchResponse = await fetch(`http://localhost:3001/api/tools?search=${encodeURIComponent(identifier)}`, {
      cache: 'force-cache',
    });
    
    if (searchResponse.ok) {
      const { tools } = await searchResponse.json();
      if (tools && tools.length > 0) {
        // 找到最佳匹配（名称完全匹配或最相似的）
        const exactMatch = tools.find((tool: Tool) => 
          tool.name.toLowerCase() === identifier.toLowerCase()
        );
        if (exactMatch) return exactMatch;
        
        // 如果没有完全匹配，查找包含该名称的工具
        const partialMatch = tools.find((tool: Tool) => 
          tool.name.toLowerCase().includes(identifier.toLowerCase()) ||
          identifier.toLowerCase().includes(tool.name.toLowerCase())
        );
        if (partialMatch) return partialMatch;
        
        // 返回第一个结果
        return tools[0];
      }
    }

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
