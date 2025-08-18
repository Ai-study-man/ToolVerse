'use client';

import { useState } from 'react';
import Image from 'next/image';

// Official logo mapping - using verified high-quality official logos
const SIMPLE_LOGOS: Record<string, string> = {
  // 新上传的官方logo - 优先使用
  'Lovable': '/logos/Lovable.jpeg',
  'Bolt.new': '/logos/bolt.new.svg',
  'Windsurf': '/logos/windsurf.jpeg',
  'Windsurf Editor': '/logos/windsurf.jpeg',
  'v0 by Vercel': '/logos/placeholder-logo.svg',
  'Cursor': '/logos/cursor.jpeg',
  'Reverso': '/logos/reverso.jpeg',
  'Microsoft Translator': '/logos/microsoft translator.jpeg',
  'Papago': '/logos/papago.jpeg',
  'Whisper by OpenAI': '/logos/whisper by openai.jpeg',
  
  // Conversational AI - using stable CDN and official sources
  'ChatGPT': '/logos/chatgpt.svg',
  'Claude': '/logos/claude.svg',
  'Google Gemini': '/logos/google-gemini.png',
  'Character.AI': '/logos/character-ai.png',
  'Perplexity AI': 'https://pplx.ai/favicon.ico',
  'DeepSeek': '/logos/deepseek.png',
  
  // Code Development - using GitHub and official CDNs
  'GitHub Copilot': 'https://github.githubassets.com/favicons/favicon.png',
  'Tabnine': 'https://www.tabnine.com/favicon.ico',
  'Replit AI': '/logos/Replit.jpeg',
  'Codeium': 'https://codeium.com/favicon.svg',
  'CodeT5': 'https://huggingface.co/datasets/huggingface/brand-assets/resolve/main/hf-logo.svg',
  'CodeT5+': 'https://huggingface.co/datasets/huggingface/brand-assets/resolve/main/hf-logo.svg',
  'CodeWhisperer': 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
  'Amazon CodeWhisperer': 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
  'Blackbox AI': '/logos/Blackbox.png',
  'Aider': '/logos/aider.png',
  'Codium AI': '/logos/codium-ai.png',
  'Sourcegraph Cody': 'https://about.sourcegraph.com/favicon.ico',
  
  // Image Generation & Design - using official logo APIs
  'DALL-E 2': '/logos/OpenAI_Icon_0.jpeg', // using OpenAI official logo
  'DALL-E': '/logos/OpenAI_Icon_0.jpeg', // 使用OpenAI官方logo
  'Midjourney': '/logos/midjourney.png',
  'Stable Diffusion': 'https://stability.ai/favicon.ico',
  'Leonardo AI': 'https://app.leonardo.ai/favicon.ico',
  'Adobe Firefly': 'https://www.adobe.com/favicon.ico',
  'Canva AI': '/logos/Canva_Logo_0.svg',
  'Figma AI': 'https://static.figma.com/app/icon/1/favicon.svg',
  'DreamStudio': '/logos/dreamstudio.png',
  'Flux AI': '/logos/flux-ai.png',
  'Ideogram': '/logos/ideogram.png',
  'Imagen 3': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
  'Playground AI': 'https://playgroundai.com/favicon.ico',
  'Looka': 'https://cdn.looka.com/favicon.ico',
  
  // Business & Productivity
  'Notion AI': 'https://www.notion.so/images/favicon.ico',
  'Grammarly': '/logos/grammarly.svg',
  'Jasper AI': '/logos/jasper-ai.png',
  'Copy.ai': '/logos/Copy.ai_idhj7Th-aL_0.svg',
  'Calendly AI': '/logos/calendly-ai.png',
  'Krisp': 'https://cdn.krisp.ai/favicon.ico',
  'Motion': 'https://www.usemotion.com/favicon.ico',
  'Reclaim.ai': 'https://app.reclaim.ai/favicon.ico',
  'Zapier AI': '/logos/zapier-ai.jpeg',
  'Otter.ai': 'https://otter.ai/favicon.ico',
  
  // Video & Audio
  'Runway ML': '/logos/runway-ml.jpeg',
  'Synthesia': '/logos/synthesia.png',
  'Murf AI': '/logos/murf-ai.jpeg',
  'ElevenLabs': '/logos/elevenlabs.jpeg',
  'Descript': '/logos/descript.jpeg',
  'Loom AI': '/logos/loom-ai.jpeg',
  'Pictory AI': '/logos/pictory-ai.jpeg',
  
  // Writing & Content
  'Writesonic': '/logos/Writesonic.jpeg',
  'Rytr': '/logos/Rytr.jpeg',
  'QuillBot': 'https://quillbot.com/favicon.ico',
  'Wordtune': 'https://www.wordtune.com/favicon.svg',
  'ContentBot': '/logos/ContentBot.jpeg',
  
  // Language & Translation
  'DeepL': 'https://static.deepl.com/img/favicon/favicon_96.png',
  'Google Translate AI': 'https://ssl.gstatic.com/translate/favicon.ico',
  'Linguee': 'https://www.linguee.com/favicon.ico',
  
  // Business & Analytics
  'Chatsimple': '/logos/chatsimple.jpeg',
  'Tableau AI': 'https://www.tableau.com/favicon.ico',
  'H2O.ai': 'https://h2o.ai/favicon.ico',
  'Crystal': '/logos/crystal.png',
  'Dataiku': 'https://www.dataiku.com/favicon.ico',
  'MonkeyLearn': 'https://monkeylearn.com/favicon.ico',
  'Qlik Sense AI': '/logos/Qlik.jpeg',
  'Sisense AI': 'https://www.sisense.com/favicon.ico',
  'Medallia': '/logos/Medallia.jpeg',
  
  // Marketing & SEO
  'Alli AI': '/logos/Alli AI.jpeg',
  'BrightEdge': 'https://www.brightedge.com/favicon.ico',
  'Clearscope': '/logos/clearscope.jpeg',
  'ContentKing': 'https://www.contentkingapp.com/favicon.ico',
  'Frase': '/logos/Frase.png',
  'MarketMuse': 'https://www.marketmuse.com/favicon.ico',
  'Semrush AI': 'https://www.semrush.com/favicon.ico',
  'Surfer SEO': '/logos/Surfer.jpeg'
};

// 工具品牌颜色映射
const BRAND_COLORS: Record<string, string> = {
  'ChatGPT': '/logos/chatgpt.svg',
  'Claude': '/logos/claude.svg',
  'Google Gemini': '/logos/google-gemini.png',
  'GitHub Copilot': '#000000',
  'Midjourney': '/logos/midjourney.png',
  'DALL-E 2': '#10A37F',
  'Notion AI': '#000000',
  'Grammarly': '/logos/grammarly.svg',
  'Adobe Firefly': '#FF0000',
  'Canva AI': '#00C4CC',
  'Stable Diffusion': '#000000',
  'Leonardo AI': '#8B5CF6',
  'Figma AI': '#F24E1E',
  'Runway ML': '/logos/runway-ml.jpeg',
  'Synthesia': '/logos/synthesia.png',
  'ElevenLabs': '/logos/elevenlabs.jpeg'
};

// emoji映射作为最后的备用方案
const EMOJI_LOGOS: Record<string, string> = {
  // 新上传的官方logo
  'Lovable': '/logos/Lovable.jpeg',
  'Bolt.new': '/logos/bolt.new.svg',
  'Windsurf': '/logos/windsurf.jpeg',
  'Windsurf Editor': '/logos/windsurf.jpeg',
  'v0 by Vercel': '/logos/placeholder-logo.svg',
  'Cursor': '/logos/cursor.jpeg',
  'Reverso': '/logos/reverso.jpeg',
  'Microsoft Translator': '/logos/microsoft translator.jpeg',
  'Papago': '/logos/papago.jpeg',
  'Whisper by OpenAI': '/logos/whisper by openai.jpeg',
  
  'ChatGPT': '/logos/chatgpt.svg',
  'Claude': '/logos/claude.svg',
  'Google Gemini': '/logos/google-gemini.png',
  'Character.AI': '/logos/character-ai.png',
  'Perplexity AI': '🔍',
  'DeepSeek': '/logos/deepseek.png',
  'GitHub Copilot': '👨‍💻',
  'Tabnine': '📝',
  'Replit AI': '/logos/Replit.jpeg',
  'Codeium': '💡',
  'CodeT5': '🤗',
  'CodeT5+': '🤗',
  'CodeWhisperer': '☁️',
  'Amazon CodeWhisperer': '☁️',
  'Blackbox AI': '/logos/Blackbox.png',
  'Aider': '/logos/aider.png',
  'Codium AI': '/logos/codium-ai.png',
  'Sourcegraph Cody': '📊',
  'DALL-E 2': '/logos/OpenAI_Icon_0.jpeg',
  'DALL-E': '/logos/OpenAI_Icon_0.jpeg',
  'Midjourney': '/logos/midjourney.png',
  'Stable Diffusion': '🎯',
  'Leonardo AI': '🖌️',
  'Adobe Firefly': '🔥',
  'Canva AI': '/logos/Canva_Logo_0.svg',
  'Figma AI': '🎨',
  'DreamStudio': '/logos/dreamstudio.png',
  'Flux AI': '/logos/flux-ai.png',
  'Ideogram': '/logos/ideogram.png',
  'Imagen 3': '📸',
  'Playground AI': '🎮',
  'Looka': '👁️',
  'Notion AI': '📝',
  'Grammarly': '/logos/grammarly.svg',
  'Jasper AI': '/logos/jasper-ai.png',
  'Copy.ai': '/logos/Copy.ai_idhj7Th-aL_0.svg',
  'Calendly AI': '/logos/calendly-ai.png',
  'Krisp': '🔇',
  'Motion': '⚡',
  'Reclaim.ai': '⏰',
  'Zapier AI': '/logos/zapier-ai.jpeg',
  'Otter.ai': '🦦',
  'Runway ML': '/logos/runway-ml.jpeg',
  'Synthesia': '/logos/synthesia.png',
  'Murf AI': '/logos/murf-ai.jpeg',
  'ElevenLabs': '/logos/elevenlabs.jpeg',
  'Descript': '/logos/descript.jpeg',
  'Loom AI': '/logos/loom-ai.jpeg',
  'Pictory AI': '/logos/pictory-ai.jpeg',
  'Writesonic': '/logos/Writesonic.jpeg',
  'Rytr': '/logos/Rytr.jpeg',
  'QuillBot': '🪶',
  'Wordtune': '🎵',
  'ContentBot': '/logos/ContentBot.jpeg',
  'DeepL': '🌐',
  'Google Translate AI': '🔄',
  'Linguee': '📚',
  'Chatsimple': '💬',
  'Tableau AI': '📊',
  'H2O.ai': '💧',
  'Crystal': '/logos/crystal.png',
  'Dataiku': '📈',
  'MonkeyLearn': '🐵',
  'Qlik Sense AI': '/logos/Qlik.jpeg',
  'Sisense AI': '📋',
  'Medallia': '/logos/Medallia.jpeg',
  'Alli AI': '/logos/Alli AI.jpeg',
  'BrightEdge': '⭐',
  'Clearscope': '/logos/clearscope.jpeg',
  'ContentKing': '👑',
  'Frase': '/logos/Frase.png',
  'MarketMuse': '🎯',
  'Semrush AI': '📈',
  'Surfer SEO': '/logos/Surfer.jpeg'
};

// 生成emoji备用logo
function generateEmojiLogo(toolName: string): string {
  const emoji = EMOJI_LOGOS[toolName] || toolName.charAt(0).toUpperCase();
  const color = BRAND_COLORS[toolName] || '#2563eb';
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='${color}'/%3E%3Ctext x='32' y='40' text-anchor='middle' font-family='Arial' font-size='24' fill='white'%3E${emoji}%3C/text%3E%3C/svg%3E`;
}

// 简化版生成默认logo函数
function generateSimpleLogo(toolName: string): string {
  const firstLetter = toolName.charAt(0).toUpperCase();
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%232563eb'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='Arial' font-size='28' font-weight='bold' fill='white'%3E${firstLetter}%3C/text%3E%3C/svg%3E`;
}

// 获取工具logo函数 - 优化性能，优先本地logo
function getSimpleToolLogo(toolName: string, originalLogo?: string): string {
  // 1. 优先从本地映射中获取官方logo（最快）
  const mappedLogo = SIMPLE_LOGOS[toolName];
  if (mappedLogo && mappedLogo.startsWith('/logos/')) {
    return mappedLogo;
  }
  
  // 2. 如果有其他映射的官方logo
  if (mappedLogo) {
    return mappedLogo;
  }
  
  // 3. 如果有原始logo且不是我们生成的
  if (originalLogo && !originalLogo.includes('data:image/svg+xml')) {
    return originalLogo;
  }
  
  // 4. 使用emoji备用方案（无需网络请求）
  if (EMOJI_LOGOS[toolName] && EMOJI_LOGOS[toolName].startsWith('/logos/')) {
    return EMOJI_LOGOS[toolName];
  }
  
  // 5. 最后备用：生成简单字母logo（即时生成）
  return generateSimpleLogo(toolName);
}

interface ToolLogoProps {
  name: string;
  logo?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function ToolLogo({ name, logo, size = 'md', className = '' }: ToolLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 尺寸映射
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };
  
  // 字体尺寸映射
  const fontSizes = {
    sm: 'text-xs',
    md: 'text-lg',
    lg: 'text-xl', 
    xl: 'text-2xl'
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // 使用logo服务获取最佳的logo
  const finalLogo = getSimpleToolLogo(name, logo);
  const isLocalLogo = finalLogo.startsWith('/logos/');
  const isDataUrl = finalLogo.startsWith('data:image/svg+xml');
  const showPlaceholder = imageError || isDataUrl;

  return (
    <div className={`${sizeClasses[size]} rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative ${className}`}>
      {/* 加载指示器 */}
      {isLoading && !isDataUrl && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {showPlaceholder ? (
        // 使用SVG作为背景或显示默认占位符
        isDataUrl ? (
          <img
            src={finalLogo}
            alt={`${name} logo`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          // 默认占位符：显示工具名称的首字母
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <span className={`text-white font-bold ${fontSizes[size]}`}>
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )
      ) : (
        // 使用Next.js Image组件优化加载
        isLocalLogo ? (
          <Image
            src={finalLogo}
            alt={`${name} logo`}
            fill
            className="object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            priority={size === 'xl'} // 大尺寸logo优先加载
            sizes={`${size === 'sm' ? '32px' : size === 'md' ? '48px' : size === 'lg' ? '64px' : '80px'}`}
          />
        ) : (
          // 外部URL使用普通img标签但优化加载
          <img
            src={finalLogo}
            alt={`${name} logo`}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
            decoding="async"
          />
        )
      )}
    </div>
  );
}
