'use client';

import { useState, useEffect } from 'react';

interface ToolImageProps {
  src?: string;
  alt: string;
  className?: string;
  name: string;
}

export default function ToolImage({ src, alt, className = '', name }: ToolImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // 工具名称到logo文件的映射
  const getLogoFileName = (toolName: string) => {
    // 精确映射表 - 基于mockData.ts中的实际工具名称
    const nameMap: { [key: string]: string } = {
      // mock数据中的确切名称
      'ChatGPT': 'chatgpt.svg',
      'Midjourney': 'Midjourney.png',
      'GitHub Copilot': 'github-copilot.png',
      'Jasper AI': 'jasper-ai.png',
      'Notion AI': 'notion.png',
      'Stable Diffusion': 'dreamstudio.png',
      'Copy.ai': 'Copy.ai_idhj7Th-aL_0.svg',
      'Runway ML': 'runway-ml.jpeg',
      'Framer AI': 'framer.png',
      'Replit AI': 'Replit.jpeg',
      'Grammarly': 'grammarly.svg',
      'Canva AI': 'Canva_Logo_0.svg',
      
      // 新添加的工具
      'Lovable': 'Lovable.jpeg',
      'Bolt.new': 'bolt.new.svg',
      'Windsurf': 'windsurf.jpeg',
      'Windsurf Editor': 'windsurf.jpeg',
      'v0 by Vercel': 'placeholder-logo.svg',
      'Cursor': 'cursor.jpeg',
      'Reverso': 'reverso.jpeg',
      'Microsoft Translator': 'microsoft translator.jpeg',
      'Papago': 'papago.jpeg',
      'Whisper by OpenAI': 'whisper by openai.jpeg',
      
      // 图像处理和增强工具
      'Bigjpg': 'bigjpg.svg',
      'Topaz Gigapixel': 'topaz-gigapixel.jpeg',
      'Topaz Gigapixel AI': 'topaz-gigapixel.jpeg',
      'Remini': 'Remini.jpeg',
      
      // 其他可能的工具名称变体
      'Claude': 'claude.svg',
      'Claude 3': 'claude.svg',
      'Anthropic': 'claude.svg',
      'OpenAI': 'chatgpt.svg',
      'GPT-4': 'chatgpt.svg',
      'GPT-3.5': 'chatgpt.svg',
      'Google Gemini': 'google-gemini.png',
      'Gemini': 'google-gemini.png',
      'ElevenLabs': 'elevenlabs.jpeg',
      'Loom AI': 'loom-ai.jpeg',
      'Aider': 'aider.png',
      'Blackbox AI': 'Blackbox.png',
      'Character.AI': 'character-ai.png',
      'Clearscope': 'Clearscope.jpeg',
      'Codium AI': 'codium-ai.png',
      'ContentBot': 'ContentBot.jpeg',
      'Crystal': 'Crystal.png',
      'DeepSeek': 'deepseek.png',
      'Descript': 'descript.jpeg',
      'DreamStudio': 'dreamstudio.png',
      'Flux AI': 'flux-ai.png',
      'Frase': 'Frase.png',
      'Ideogram': 'ideogram.png',
      'Murf AI': 'murf-ai.jpeg',
      'Pictory AI': 'pictory-ai.jpeg',
      'Calendly AI': 'calendly-ai.png',
      'Alli AI': 'Alli AI.jpeg',
      'Medallia': 'Medallia.jpeg',
      'Replit': 'Replit.jpeg',
      'Rytr': 'Rytr.jpeg',
      'Surfer': 'Surfer.jpeg',
      'Writesonic': 'Writesonic.jpeg'
    };
    
    // 先尝试精确匹配
    if (nameMap[toolName]) {
      return nameMap[toolName];
    }
    
    // 然后尝试小写匹配
    const lowerName = toolName.toLowerCase();
    const lowerMapping: { [key: string]: string } = {
      'chatgpt': 'chatgpt.svg',
      'claude': 'claude.svg',
      'midjourney': 'Midjourney.png',
      'replit': 'Replit.jpeg',
      'grammarly': 'grammarly.svg',
      'canva': 'Canva_Logo_0.svg',
      'jasper': 'jasper-ai.png',
      'notion': 'notion.png',
      'github copilot': 'github-copilot.png',
      'stable diffusion': 'dreamstudio.png',
      'runway ml': 'runway-ml.jpeg',
      'copy.ai': 'Copy.ai_idhj7Th-aL_0.svg',
      'writesonic': 'Writesonic.jpeg',
      // 新工具的小写映射
      'lovable': 'Lovable.jpeg',
      'bolt.new': 'bolt.new.svg',
      'windsurf': 'windsurf.jpeg',
      'windsurf editor': 'windsurf.jpeg',
      'v0 by vercel': 'placeholder-logo.svg',
      'cursor': 'cursor.jpeg',
      'reverso': 'reverso.jpeg',
      'microsoft translator': 'microsoft translator.jpeg',
      'papago': 'papago.jpeg',
      'whisper by openai': 'whisper by openai.jpeg',
      // 图像处理工具的小写映射
      'bigjpg': 'bigjpg.svg',
      'topaz gigapixel': 'topaz-gigapixel.jpeg',
      'topaz gigapixel ai': 'topaz-gigapixel.jpeg',
      'remini': 'Remini.jpeg'
    };
    
    return lowerMapping[lowerName] || null;
  };

  // 处理logo路径 - 确保路径格式正确
  const getImageSrc = (logoPath?: string, toolName?: string) => {
    // 优先使用我们的映射文件 - 这样可以确保使用正确的官方logo
    if (toolName) {
      const logoFile = getLogoFileName(toolName);
      if (logoFile) {
        return `/logos/${logoFile}`;
      }
    }
    
    if (!logoPath) return null;
    
    // 如果是data URI，忽略它，使用占位符
    if (logoPath.startsWith('data:')) {
      return null;
    }
    
    // 如果是完整的URL，直接返回
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    
    // 如果已经以 /logos/ 开头，直接返回
    if (logoPath.startsWith('/logos/')) {
      return logoPath;
    }
    
    // 如果只是文件名，添加 /logos/ 前缀
    if (!logoPath.startsWith('/')) {
      return `/logos/${logoPath}`;
    }
    
    return logoPath;
  };

  const imageSrc = getImageSrc(src, name);

  // 服务器端渲染时使用简单的占位符
  if (!mounted) {
    const placeholderClassName = className
      .replace('object-contain', '')
      .replace('border border-gray-100', '') + 
      ' bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold border border-gray-200';
      
    return (
      <div className={placeholderClassName}>
        <span className={className.includes('w-24') ? 'text-2xl' : 'text-sm'}>
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  // 客户端渲染时，如果没有图片源或图片加载失败，显示首字母占位符
  if (!imageSrc || hasError) {
    const placeholderClassName = className
      .replace('object-contain', '')
      .replace('border border-gray-100', '') + 
      ' bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold border border-gray-200';
      
    return (
      <div className={placeholderClassName}>
        <span className={className.includes('w-24') ? 'text-2xl' : 'text-sm'}>
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={() => {
        setIsLoading(false);
      }}
    />
  );
}
