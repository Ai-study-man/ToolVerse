/**
 * 工具ID到logo文件名的映射
 * 用于在博客中显示相关工具的正确logo
 */
export const toolLogoMapping: Record<string, string> = {
  // AI 代码助手
  'chatgpt': '/logos/chatgpt.svg',
  'cursor': '/logos/cursor.jpeg',
  'codeium': '/logos/codeium.svg',
  'blackbox': '/logos/Blackbox.png',
  'replit': '/logos/Replit.jpeg',
  'sourcegraph-cody': '/logos/sourcegraph-cody.svg',
  'bolt-new': '/logos/bolt.new.svg',
  'windsurf': '/logos/windsurf.jpeg',
  'lovable': '/logos/Lovable.jpeg',
  'aider': '/logos/aider.png',
  
  // AI 写作工具
  'jasper-ai': '/logos/jasper-ai.png',
  'copy-ai': '/logos/Copy.ai_idhj7Th-aL_0.svg',
  'writesonic': '/logos/Writesonic.jpeg',
  'rytr': '/logos/Rytr.jpeg',
  'grammarly': '/logos/grammarly.svg',
  'notion-ai': '/logos/notion-ai.svg',
  'frase': '/logos/Frase.png',
  'contentbot': '/logos/ContentBot.jpeg',
  
  // AI 图像生成
  'midjourney': '/logos/Midjourney.png',
  'stable-diffusion': '/logos/stable-diffusion.png',
  'leonardo-ai': '/logos/leonardo-ai.svg',
  'playground-ai': '/logos/playground-ai.svg',
  'dreamstudio': '/logos/dreamstudio.png',
  'flux-ai': '/logos/flux-ai.png',
  'ideogram': '/logos/ideogram.png',
  'canva': '/logos/Canva_Logo_0.svg',
  // 新添加的工具 - 支持多种匹配方式
  'fal-ai': '/logos/fal AI.jpeg',
  'fal ai': '/logos/fal AI.jpeg',
  'falai': '/logos/fal AI.jpeg',
  'letsenhance': '/logos/letsenhance.jpeg',
  'lets-enhance': '/logos/letsenhance.jpeg',
  'imgcreator-ai': '/logos/IMGCreator ai.jpeg',
  'imgcreator ai': '/logos/IMGCreator ai.jpeg',
  'imgcreator': '/logos/IMGCreator ai.jpeg',
  
  // AI 语音工具
  'elevenlabs': '/logos/elevenlabs.jpeg',
  'murf-ai': '/logos/murf-ai.jpeg',
  'synthesia': '/logos/synthesia.png',
  'whisper-by-openai': '/logos/whisper by openai.jpeg',
  'otter-ai': '/logos/otter-ai.svg',
  'descript': '/logos/descript.jpeg',
  'krisp': '/logos/krisp.svg',
  
  // AI 视频工具
  'runway-ml': '/logos/runway-ml.jpeg',
  'pictory-ai': '/logos/pictory-ai.jpeg',
  'loom-ai': '/logos/loom-ai.jpeg',
  
  // AI 聊天工具
  'claude': '/logos/claude.svg',
  'character-ai': '/logos/character-ai.png',
  'chatsimple': '/logos/chatsimple.png',
  'perplexity-ai': '/logos/perplexity-ai.svg',
  'google-gemini': '/logos/google-gemini.png',
  'gemini': '/logos/google-gemini.png',
  
  // AI 翻译工具
  'microsoft-translator': '/logos/microsoft translator.jpeg',
  'reverso': '/logos/reverso.jpeg',
  'papago': '/logos/papago.jpeg',
  
  // AI 生产力工具
  'motion': '/logos/motion.svg',
  'reclaim-ai': '/logos/reclaim-ai.svg',
  'zapier-ai': '/logos/zapier-ai.jpeg',
  'calendly-ai': '/logos/calendly-ai.png',
  
  // AI SEO 工具
  'semrush-ai': '/logos/semrush-ai.svg',
  'surfer': '/logos/Surfer.jpeg',
  'clearscope': '/logos/Clearscope.jpeg',
  'alli-ai': '/logos/Alli AI.jpeg',
  'contentking': '/logos/contentking.svg',
  
  // AI 数据分析工具
  'dataiku': '/logos/dataiku.svg',
  'qlik': '/logos/Qlik.jpeg',
  'monkeylearn': '/logos/monkeylearn.svg',
  'medallia': '/logos/Medallia.jpeg',
  
  // AI 设计工具
  'looka': '/logos/looka.svg',
  'crystal': '/logos/Crystal.png',
  
  // AI 代码工具
  'deepseek': '/logos/deepseek.png',
  'codium-ai': '/logos/codium-ai.png',
  'code-t5-plus': '/logos/code-t5-plus.svg',
  'codet5': '/logos/codet5.svg',
  
  // 其他
  'worldtune': '/logos/worldtune.svg',
  'openai': '/logos/OpenAI_Icon_0.jpeg',
};

/**
 * 根据工具名称或ID获取logo路径
 */
export function getToolLogo(toolNameOrId: string): string {
  // 首先尝试直接匹配
  if (toolLogoMapping[toolNameOrId]) {
    return toolLogoMapping[toolNameOrId];
  }
  
  // 尝试转换为小写并替换空格和特殊字符
  const normalizedName = toolNameOrId
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
  
  if (toolLogoMapping[normalizedName]) {
    return toolLogoMapping[normalizedName];
  }
  
  // 尝试匹配部分名称
  const partialMatch = Object.keys(toolLogoMapping).find(key => 
    key.includes(normalizedName) || normalizedName.includes(key)
  );
  
  if (partialMatch) {
    return toolLogoMapping[partialMatch];
  }
  
  // 默认返回占位符logo
  return '/logos/placeholder-logo.svg';
}

/**
 * 检查工具是否有可用的logo
 */
export function hasToolLogo(toolNameOrId: string): boolean {
  return getToolLogo(toolNameOrId) !== '/logos/placeholder-logo.svg';
}
