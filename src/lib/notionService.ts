import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// Notion 客户端配置
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

// Notion 数据库ID
const TOOLS_DATABASE_ID = process.env.NOTION_TOOLS_DATABASE_ID || '';

// Notion 属性映射到我们的 Tool 接口
export interface NotionToolProperties {
  Name: { title: Array<{ plain_text: string }> };
  '简介': { rich_text: Array<{ plain_text: string }> };
  '详细描述': { rich_text: Array<{ plain_text: string }> };
  '网址': { url: string };
  '标签': { multi_select: Array<{ name: string }> };
  '适用场景': { multi_select: Array<{ name: string }> };
  '价格模式': { select: { name: string } };
  '具体价格': { rich_text: Array<{ plain_text: string }> };
  '评分': { number: number };
  '评论数': { number: number };
  '分类': { select: { name: string } };
  '子分类': { select: { name: string } };
  '功能特点': { rich_text: Array<{ plain_text: string }> };
  '官方Logo': { files: Array<{ file?: { url: string }; external?: { url: string } }> };
  '状态': { status: { name: string } };
  '创建时间': { created_time: string };
  '更新时间': { last_edited_time: string };
}

// 工具状态枚举
export type ToolStatus = '进行中' | '未开始' | '已完成' | 'Under Review';

// 价格模式枚举
export type PricingModel = 'free' | 'freemium' | 'paid' | 'subscription' | 'one-time';

// 定价信息中文到英文的翻译映射
const pricingTranslations: { [key: string]: string } = {
  '免费': 'Free',
  '免费版': 'Free',
  '完全免费': 'Free',
  '免费使用': 'Free',
  '开源免费': 'Open Source Free',
  '免费版 + 付费计划': 'Free + Paid Plans',
  '免费版 + Pro版收费': 'Free + Pro Pricing',
  '免费版 + API收费': 'Free + API Pricing',
  '免费版 + Gemini Pro API收费': 'Free + Gemini Pro API Pricing',
  '免费版 + ChatGPT Plus付费': 'Free + ChatGPT Plus Paid',
  '免费版 + $19/月 Pro版': 'Free + $19/month Pro',
  '免费版 + $19/月专业版': 'Free + $19/month Professional',
  '免费版 + $9-19/月': 'Free + $9-19/month',
  '免费版 + Pro版': 'Free + Pro Version',
  '免费版 + $5-15/月': 'Free + $5-15/month',
  '免费版 + $8-18/月': 'Free + $8-18/month',
  '免费版 + $19.99-73.50/月': 'Free + $19.99-73.50/month',
  '免费版 + $8-16/月': 'Free + $8-16/month',
  '免费版 + $8.33-20/月': 'Free + $8.33-20/month',
  '免费版 + $9.99/月 Plus版': 'Free + $9.99/month Plus',
  '免费版 + $20/月 Pro版': 'Free + $20/month Pro',
  '免费版 + API付费使用': 'Free + Paid API Usage',
  '免费版 + $6.99-22.99/月': 'Free + $6.99-22.99/month',
  '免费版 + $5-99/月': 'Free + $5-99/month',
  '免费版 + $12-24/月': 'Free + $12-24/month',
  '免费版 + $19-99/月': 'Free + $19-99/month',
  '免费版 + $15-35/月': 'Free + $15-35/month',
  '免费版 + $299-999/月': 'Free + $299-999/month',
  '免费版 + $49-99/月': 'Free + $49-99/month',
  '免费版 + $0.99-9.99/月': 'Free + $0.99-9.99/month',
  '免费版 + $12/月 Pro版': 'Free + $12/month Pro',
  '免费版 + $7-20/月': 'Free + $7-20/month',
  '免费版 + $12-45/月': 'Free + $12-45/month',
  '免费版 + Creative Cloud 订阅': 'Free + Creative Cloud Subscription',
  '免费版 + $10-48/月': 'Free + $10-48/month',
  '免费版 + $12.99/月 Pro版': 'Free + $12.99/month Pro',
  '免费版 + $24.99/月': 'Free + $24.99/month',
  '免费版 + $9-29/月': 'Free + $9-29/month',
  '免费版 + $8.33-19.95/月': 'Free + $8.33-19.95/month',
  '免费版 + $16-79/月': 'Free + $16-79/month',
  '免费版 + $12-15/月': 'Free + $12-15/month',
  '免费版 + $36/月 Pro版': 'Free + $36/month Pro',
  '免费版 + $20/月 Plus版': 'Free + $20/month Plus',
  '免费个人版 + 企业版': 'Free Personal + Enterprise',
  '开源免费 + 企业版': 'Open Source Free + Enterprise',
  '免费试用': 'Free Trial',
  '免费试用 + 付费计划': 'Free Trial + Paid Plans',
  '免费试用版': 'Free Trial',
  '免费试用 + $15-35/月': 'Free Trial + $15-35/month',
  '基础免费 + 高级付费': 'Basic Free + Premium Paid',
  '基础版免费': 'Basic Free',
  '付费': 'Paid',
  '订阅制': 'Subscription',
  '按需付费': 'Pay-as-you-go',
  '按积分收费，$10起': 'Credit-based pricing, starting from $10',
  '通过Google Cloud API': 'Through Google Cloud API',
  '一次性付费': 'One-time Payment',
  '$19-34/月': '$19-34/month',
  '$19-99/月': '$19-99/month',
  '$30-90/月': '$30-90/month',
  '$39-599/月': '$39-599/month',
  '$299-999/月': '$299-999/month',
  '$14.99-114.99/月': '$14.99-114.99/month',
  '$170-650/月': '$170-650/month',
  '$119.95-449.95/月': '$119.95-449.95/month',
  '$149-599/月': '$149-599/month',
  '$59-239/月': '$59-239/month',
  '$30-70/月': '$30-70/month',
  '$70-150/月': '$70-150/month',
  '$39-125/月': '$39-125/month',
  '$10/月个人版': '$10/month Personal',
  '$10/月 AI 插件': '$10/month AI Add-on',
  '$20-96/次性付费': '$20-96 One-time Payment',
  '$10-60/月订阅制': '$10-60/month Subscription',
  '企业定价': 'Enterprise Pricing',
  '联系销售': 'Contact Sales',
  '联系销售定价': 'Contact Sales for Pricing',
  '价格面议': 'Contact for Pricing'
};

// 翻译定价信息
function translatePricing(chinesePricing: string): string {
  try {
    if (!chinesePricing || typeof chinesePricing !== 'string') {
      return 'Contact for pricing';
    }
    return pricingTranslations[chinesePricing] || chinesePricing;
  } catch (error) {
    console.error('Error translating pricing:', error);
    return chinesePricing || 'Contact for pricing';
  }
}

// 工具描述翻译映射
const toolDescriptionTranslations: { [key: string]: { shortDescription: string; description: string } } = {
  // Development 类别工具
  'Replit AI': {
    shortDescription: 'AI programming assistant integrated within Replit',
    description: 'Replit AI is an AI programming assistant integrated within the Replit platform, providing code generation, explanation, and debugging capabilities. It helps developers write code more efficiently by offering intelligent code suggestions, explaining complex code logic, and assisting with debugging. Replit AI supports multiple programming languages and integrates seamlessly with the Replit development environment, making it an ideal tool for both beginners and experienced developers.'
  },
  'CodeT5': {
    shortDescription: 'Open-source code generation and comprehension model',
    description: 'CodeT5 is an open-source code generation and comprehension model that supports multiple programming tasks such as code generation, translation, and summarization. Built on the T5 (Text-to-Text Transfer Transformer) architecture, CodeT5 is specifically trained on code data and can understand and generate code in various programming languages. It excels at tasks like code translation between different programming languages, automatic code summarization, and code completion.'
  },
  'Blackbox AI': {
    shortDescription: 'AI programming assistant designed specifically for developers',
    description: 'Blackbox AI is an AI programming assistant designed specifically for developers, offering code search, generation, and optimization capabilities. It can help developers find relevant code snippets, generate code based on natural language descriptions, and optimize existing code for better performance. Blackbox AI supports multiple programming languages and integrates with popular development environments, making it a valuable tool for improving developer productivity.'
  },
  'Codeium': {
    shortDescription: 'Free AI programming assistant',
    description: 'Codeium is a free AI programming assistant that provides intelligent code completion, search, and chat functionality. It offers real-time code suggestions, helps developers find relevant code examples, and provides interactive chat support for programming questions. Codeium supports over 70 programming languages and integrates with popular IDEs and editors, making it accessible to developers of all skill levels.'
  },
  'Amazon CodeWhisperer': {
    shortDescription: 'AWS AI programming assistant',
    description: 'Amazon CodeWhisperer is an AI programming assistant launched by AWS, providing real-time code suggestions and security scanning functionality. It helps developers write secure, high-quality code by offering intelligent code completions based on comments and existing code. CodeWhisperer also includes built-in security scanning to identify potential security vulnerabilities and provides recommendations for improvement.'
  },

  // Business & Analytics 类别工具
  'Notion AI': {
    shortDescription: 'AI writing assistant integrated within Notion',
    description: 'Notion AI is integrated within Notion workspaces, providing intelligent writing, summarization, translation, and other features to help users improve work efficiency. It can automatically generate content, summarize long documents, translate text between languages, and assist with various writing tasks. Notion AI seamlessly integrates with Notion\'s existing productivity features, making it a powerful tool for knowledge management and collaboration.'
  },
  'Tableau AI': {
    shortDescription: 'AI-integrated data visualization platform',
    description: 'Tableau\'s integrated AI features help users automatically discover data insights, generate visualization charts, and explain data trends. The AI capabilities include automated insights generation, natural language query processing, and intelligent chart recommendations. Tableau AI makes data analysis more accessible to non-technical users while providing advanced analytics capabilities for data professionals.'
  },
  'MonkeyLearn': {
    shortDescription: 'AI text analysis and insights platform',
    description: 'MonkeyLearn is a text analysis platform that uses machine learning to analyze and extract insights from text data. It provides pre-built models for sentiment analysis, keyword extraction, intent detection, and other text classification tasks. MonkeyLearn also allows users to create custom models tailored to their specific needs, making it valuable for businesses looking to analyze customer feedback, social media content, and other text-based data.'
  },
  'Crystal': {
    shortDescription: 'AI personality analysis and communication assistant',
    description: 'Crystal uses AI to analyze personality traits, helping sales and marketing teams better understand and communicate with customers. It provides personality insights based on publicly available information and offers communication recommendations tailored to different personality types. Crystal helps improve sales conversions, customer relationships, and team communication by providing actionable insights into how to best interact with different individuals.'
  },
  'Dataiku': {
    shortDescription: 'Enterprise-level AI data science platform',
    description: 'Dataiku is an enterprise-level data science platform that integrates AI and machine learning capabilities to help organizations build data projects. It provides a collaborative environment for data scientists, analysts, and business users to work together on data projects from data preparation to model deployment. Dataiku offers automated machine learning, visual data preparation, and comprehensive model management capabilities.'
  },
  'Sisense AI': {
    shortDescription: 'AI-driven business intelligence platform',
    description: 'Sisense\'s AI capabilities provide automated insight discovery, intelligent data preparation, and predictive analytics capabilities. The platform uses AI to automatically identify patterns and anomalies in data, suggest relevant visualizations, and provide natural language explanations of data trends. Sisense AI makes business intelligence more accessible and actionable for organizations of all sizes.'
  },
  'H2O.ai': {
    shortDescription: 'Open-source machine learning and AI platform',
    description: 'H2O.ai provides open-source and enterprise-level machine learning platforms to help organizations build and deploy AI models. It offers automated machine learning (AutoML) capabilities, scalable machine learning algorithms, and comprehensive model interpretability tools. H2O.ai supports various use cases including fraud detection, risk management, customer analytics, and predictive maintenance.'
  },
  'Qlik Sense AI': {
    shortDescription: 'AI-enhanced data analytics platform',
    description: 'Qlik Sense\'s AI capabilities provide intelligent search, automated insight generation, and predictive analytics capabilities. The platform uses associative analytics combined with AI to help users explore data relationships, discover hidden patterns, and generate actionable insights. Qlik Sense AI enables self-service analytics while providing enterprise-grade governance and security.'
  },

  // Marketing & SEO 类别工具
  'Surfer SEO': {
    shortDescription: 'AI-driven SEO content optimization tool',
    description: 'Surfer SEO uses AI to analyze search results, provide content optimization suggestions, and keyword strategies to help improve website rankings. It analyzes top-performing pages for target keywords and provides data-driven recommendations for content optimization. Surfer SEO helps content creators and SEO professionals create content that ranks higher in search engine results.'
  },
  'MarketMuse': {
    shortDescription: 'AI content strategy and optimization platform',
    description: 'MarketMuse is an AI content strategy platform that helps marketing teams plan, optimize, and track content performance. It uses AI to analyze content gaps, suggest topic clusters, and provide comprehensive content briefs. MarketMuse helps content teams create more effective content strategies based on data-driven insights and competitive analysis.'
  },
  'Semrush AI': {
    shortDescription: 'AI-enhanced digital marketing toolkit',
    description: 'Semrush\'s integrated AI features provide intelligent keyword suggestions, content optimization, and competitor analysis. The AI capabilities help marketers discover new opportunities, optimize content for better search performance, and gain insights into competitor strategies. Semrush AI makes digital marketing more efficient and effective for businesses of all sizes.'
  },
  'Clearscope': {
    shortDescription: 'AI content optimization and SEO analysis tool',
    description: 'Clearscope uses AI to analyze search intent and provide optimization recommendations for content creators to improve content search performance. It analyzes top-ranking content for target keywords and provides detailed recommendations for improving content relevance and comprehensiveness. Clearscope helps content teams create content that better matches user intent and search engine expectations.'
  },
  'BrightEdge': {
    shortDescription: 'Enterprise-level AI SEO and content marketing platform',
    description: 'BrightEdge is an enterprise-level SEO platform that uses AI to provide content optimization, competitive analysis, and performance tracking. It offers comprehensive SEO insights, automated recommendations, and advanced reporting capabilities. BrightEdge helps large organizations manage complex SEO strategies and measure the impact of their content marketing efforts.'
  },
  'Frase': {
    shortDescription: 'AI content optimization and research tool',
    description: 'Frase is an AI content optimization tool that helps create high-quality content that aligns with search intent. It analyzes search results to provide content briefs, suggests relevant questions and topics, and offers optimization recommendations. Frase streamlines the content creation process by providing data-driven insights into what content performs best for specific keywords and topics.'
  },
  'Alli AI': {
    shortDescription: 'Automated SEO optimization platform',
    description: 'Alli AI is an automated SEO platform that uses artificial intelligence to automatically optimize website technical and content SEO. It provides automated optimization recommendations, bulk implementation capabilities, and comprehensive SEO monitoring. Alli AI helps businesses improve their search engine rankings without requiring extensive SEO expertise.'
  },
  'ContentKing': {
    shortDescription: 'Real-time SEO monitoring and optimization platform',
    description: 'ContentKing is a real-time SEO monitoring platform that uses AI to detect website changes and provide optimization recommendations. It continuously monitors websites for SEO issues, tracks changes that might impact search performance, and provides alerts for critical issues. ContentKing helps maintain optimal SEO performance by providing real-time insights and recommendations.'
  },

  // Video & Audio 类别工具
  'Runway ML': {
    shortDescription: 'Creative AI platform providing video and image processing tools',
    description: 'Runway ML is a creative AI platform that provides video editing, image processing, audio generation, and other AI tools designed specifically for creators. It offers cutting-edge AI capabilities including video generation, background removal, style transfer, and motion graphics. Runway ML makes advanced AI tools accessible to creative professionals, enabling new forms of digital creativity and content production.'
  },
  'Murf AI': {
    shortDescription: 'Professional AI voice generation platform',
    description: 'Murf AI is a professional AI voice generation platform that provides natural text-to-speech services, supporting multiple languages and voice styles. It offers high-quality voice synthesis with customizable parameters like pitch, speed, and emphasis. Murf AI is ideal for creating voiceovers for videos, podcasts, presentations, and other multimedia content.'
  },
  'Descript': {
    shortDescription: 'AI-powered audio and video editing tool',
    description: 'Descript is an AI-driven audio and video editing tool that provides text-based editing, voice cloning, and other innovative features. It allows users to edit audio and video content by editing the transcript, making content editing more intuitive and accessible. Descript also offers advanced features like voice cloning, noise removal, and automatic transcription.'
  },
  'Pictory AI': {
    shortDescription: 'Text-to-video AI tool',
    description: 'Pictory AI can automatically convert text content into videos, providing intelligent scene matching and automatic voiceover functionality. It transforms blog posts, articles, and scripts into engaging videos with relevant visuals, background music, and AI-generated voiceovers. Pictory AI is ideal for content creators, marketers, and educators who want to create video content efficiently.'
  },
  'ElevenLabs': {
    shortDescription: 'Advanced AI voice synthesis and cloning platform',
    description: 'ElevenLabs provides advanced AI voice synthesis technology that can generate extremely realistic human voices and support voice cloning. It offers state-of-the-art neural voice synthesis with emotional control, multilingual support, and custom voice creation capabilities. ElevenLabs is used by content creators, game developers, and media companies for producing high-quality voice content.'
  },

  // Language & Translation 类别工具
  'Google Translate AI': {
    shortDescription: 'AI translation service supporting 100+ languages',
    description: 'Google Translate uses advanced neural machine translation technology to support instant translation of over 100 languages. It provides text, document, website, and real-time conversation translation capabilities. Google Translate AI continuously improves its accuracy through machine learning and offers features like camera translation, handwriting recognition, and offline translation.'
  },
  'Linguee': {
    shortDescription: 'Contextual translation dictionary and search engine',
    description: 'Linguee combines dictionary and translation functionality to provide context-relevant translation suggestions and example sentences. It offers bilingual example sentences from reliable sources, helping users understand how words and phrases are used in different contexts. Linguee is particularly useful for professional translators, language learners, and anyone needing high-quality translation references.'
  }
};

// 翻译工具描述
function translateDescription(toolName: string, chineseText: string, isShort: boolean = false): string {
  const translation = toolDescriptionTranslations[toolName];
  if (translation) {
    return isShort ? translation.shortDescription : translation.description;
  }
  return chineseText; // 如果没有翻译，返回原文
}

// Logo映射配置
const logoMappings: { [key: string]: string } = {
  // 现有的logo文件映射
  'Alli AI': '/logos/Alli AI.jpeg',
  'Blackbox AI': '/logos/Blackbox.png', 
  'Calendly AI': '/logos/calendly-ai.png',
  'Canva AI': '/logos/Canva_Logo_0.svg',
  'Character.AI': '/logos/character-ai.png',
  'Chatsimple': '/logos/chatsimple.jpeg',
  'ChatGPT': '/logos/chatgpt.svg',
  'Claude': '/logos/claude.svg',
  'Clearscope': '/logos/Clearscope.jpeg',
  'ContentBot': '/logos/ContentBot.jpeg',
  'Copy.ai': '/logos/Copy.ai_idhj7Th-aL_0.svg',
  'Crystal': '/logos/Crystal.png',
  'DeepSeek': '/logos/deepseek.png',
  'Descript': '/logos/descript.jpeg',
  'DreamStudio': '/logos/dreamstudio.png',
  'ElevenLabs': '/logos/elevenlabs.jpeg',
  'Flux AI': '/logos/flux-ai.png',
  'Frase': '/logos/Frase.png',
  'Google Gemini': '/logos/google-gemini.png',
  'Grammarly': '/logos/grammarly.svg',
  'Ideogram': '/logos/ideogram.png',
  'Jasper AI': '/logos/jasper-ai.png',
  'Loom AI': '/logos/loom-ai.jpeg',
  'Medallia': '/logos/Medallia.jpeg',
  'Midjourney': '/logos/Midjourney.png',
  'Murf AI': '/logos/murf-ai.jpeg',
  'OpenAI': '/logos/OpenAI_Icon_0.jpeg',
  'Pictory AI': '/logos/pictory-ai.jpeg',
  'Qlik Sense AI': '/logos/Qlik.jpeg',
  'Replit AI': '/logos/Replit.jpeg',
  'Runway ML': '/logos/runway-ml.jpeg',
  'Rytr': '/logos/Rytr.jpeg',
  'Surfer SEO': '/logos/Surfer.jpeg',
  'Synthesia': '/logos/synthesia.png',
  'Writesonic': '/logos/Writesonic.jpeg',
  'Zapier AI': '/logos/zapier-ai.jpeg',
  'Aider': '/logos/aider.png',
  
  // 需要官方logo的工具 - 使用临时SVG占位符
  'Worldtune': '/logos/worldtune.svg',
  'Stable Diffusion': '/logos/stable-diffusion.svg',
  'Leonardo AI': '/logos/leonardo-ai.svg',
  'Looka': '/logos/looka.svg', 
  'CodeT5': '/logos/codet5.svg',
  'Codeium': '/logos/codeium.svg',
  'Notion AI': '/logos/notion-ai.svg',
  'MonkeyLearn': '/logos/monkeylearn.svg',
  'Dataiku': '/logos/dataiku.svg',
  'Semrush AI': '/logos/semrush-ai.svg',
  'ContentKing': '/logos/contentking.svg',
  'Perplexity AI': '/logos/perplexity-ai.svg',
  'Playground AI': '/logos/playground-ai.svg',
  'Otter.ai': '/logos/otter-ai.svg',
  'Motion': '/logos/motion.svg',
  'Reclaim.ai': '/logos/reclaim-ai.svg',
  'Krisp': '/logos/krisp.svg',
  'Windsurf Editor': '/logos/windsurf.svg',
  'CodeT5+': '/logos/code-t5-plus.svg',
  'Sourcegraph Cody': '/logos/sourcegraph-cody.svg'
};

// 获取工具logo
function getToolLogo(toolName: string, notionLogoUrl: string): string {
  // 首先检查本地logo映射
  if (logoMappings[toolName]) {
    return logoMappings[toolName];
  }
  
  // 如果Notion有logo URL且不为空，使用Notion的logo
  if (notionLogoUrl && notionLogoUrl.trim() && !notionLogoUrl.startsWith('data:image/svg+xml')) {
    return notionLogoUrl;
  }
  
  // 为缺失官方logo的工具提供临时备选方案
  const tempMappings: { [key: string]: string } = {
    'Worldtune': '/logos/OpenAI_Icon_0.jpeg',
    'Stable Diffusion': '/logos/dreamstudio.png',
    'Leonardo AI': '/logos/Midjourney.png',
    'Looka': '/logos/Canva_Logo_0.svg',
    'CodeT5': '/logos/codium-ai.png',
    'Codeium': '/logos/codium-ai.png',
    'Notion AI': '/logos/OpenAI_Icon_0.jpeg',
    'MonkeyLearn': '/logos/OpenAI_Icon_0.jpeg',
    'Dataiku': '/logos/OpenAI_Icon_0.jpeg',
    'Semrush AI': '/logos/Surfer.jpeg',
    'ContentKing': '/logos/Surfer.jpeg',
    'Perplexity AI': '/logos/OpenAI_Icon_0.jpeg',
    'Playground AI': '/logos/OpenAI_Icon_0.jpeg',
    'Otter.ai': '/logos/OpenAI_Icon_0.jpeg',
    'Motion': '/logos/OpenAI_Icon_0.jpeg',
    'Reclaim.ai': '/logos/OpenAI_Icon_0.jpeg',
    'Krisp': '/logos/OpenAI_Icon_0.jpeg',
    'Windsurf Editor': '/logos/codium-ai.png',
    'CodeT5+': '/logos/codium-ai.png',
    'Sourcegraph Cody': '/logos/codium-ai.png'
  };
  
  if (tempMappings[toolName]) {
    return tempMappings[toolName];
  }
  
  // 否则生成默认logo
  const firstLetter = toolName.charAt(0).toUpperCase();
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='gradient' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%232563eb'/%3E%3Cstop offset='100%25' stop-color='%237c3aed'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='12' fill='url(%23gradient)'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-size='28' font-weight='bold' fill='white'%3E${firstLetter}%3C/text%3E%3C/svg%3E`;
}

// Notion工具数据转换为应用工具数据
export function transformNotionToolToAppTool(page: PageObjectResponse): any {
  const properties = page.properties as unknown as NotionToolProperties;
  
  // 安全获取属性值的辅助函数
  const getTitle = (prop: any) => prop?.title?.[0]?.plain_text || '';
  const getRichText = (prop: any) => prop?.rich_text?.map((t: any) => t.plain_text).join(' ') || '';
  const getSelect = (prop: any) => prop?.select?.name || '';
  const getStatus = (prop: any) => prop?.status?.name || '';
  const getMultiSelect = (prop: any) => prop?.multi_select?.map((s: any) => s.name) || [];
  
  // 标签翻译映射
  const tagTranslations: { [key: string]: string } = {
    // 中文标签到英文的映射
    'AI助手': 'AI Assistant',
    'AI洞察': 'AI Insights',
    'AI特效': 'AI Effects',
    'AI编程': 'AI Programming',
    'SEO优化': 'SEO Optimization',
    'SEO分析': 'SEO Analysis',
    'SEO监控': 'SEO Monitoring',
    'SEO研究': 'SEO Research',
    '上下文翻译': 'Contextual Translation',
    '个性分析': 'Personality Analysis',
    '代码优化': 'Code Optimization',
    '代码安全': 'Code Security',
    '代码搜索': 'Code Search',
    '代码理解': 'Code Understanding',
    '代码生成': 'Code Generation',
    '代码补全': 'Code Completion',
    '企业SEO': 'Enterprise SEO',
    '企业级': 'Enterprise Grade',
    '例句搜索': 'Example Search',
    '免费工具': 'Free Tool',
    '免费翻译': 'Free Translation',
    '关键词分析': 'Keyword Analysis',
    '关键词研究': 'Keyword Research',
    '内容优化': 'Content Optimization',
    '内容分析': 'Content Analysis',
    '内容创作': 'Content Creation',
    '内容总结': 'Content Summarization',
    '内容策略': 'Content Strategy',
    '内容营销': 'Content Marketing',
    '内容规划': 'Content Planning',
    '内容转换': 'Content Conversion',
    '写作助手': 'Writing Assistant',
    '创意工具': 'Creative Tool',
    '协作开发': 'Collaborative Development',
    '即时翻译': 'Instant Translation',
    '商业智能': 'Business Intelligence',
    '图像处理': 'Image Processing',
    '图像翻译': 'Image Translation',
    '在线编程': 'Online Programming',
    '多语言': 'Multilingual',
    '多语言支持': 'Multi-language Support',
    '实时分析': 'Real-time Analysis',
    '实时建议': 'Real-time Suggestions',
    '客户关系': 'Customer Relations',
    '工作效率': 'Work Efficiency',
    '开发助手': 'Development Assistant',
    '开源': 'Open Source',
    '性能追踪': 'Performance Tracking',
    '情感分析': 'Sentiment Analysis',
    '技术SEO': 'Technical SEO',
    '技术优化': 'Technical Optimization',
    '排名提升': 'Ranking Improvement',
    '搜索意图': 'Search Intent',
    '数字营销': 'Digital Marketing',
    '数据准备': 'Data Preparation',
    '数据分析': 'Data Analysis',
    '数据可视化': 'Data Visualization',
    '数据挖掘': 'Data Mining',
    '数据科学': 'Data Science',
    '数据管道': 'Data Pipeline',
    '文本分析': 'Text Analysis',
    '文本编辑': 'Text Editing',
    '文本转视频': 'Text-to-Video',
    '文本转语音': 'Text-to-Speech',
    '智能搜索': 'Smart Search',
    '机器学习': 'Machine Learning',
    '模型部署': 'Model Deployment',
    '沟通优化': 'Communication Optimization',
    '研究工具': 'Research Tool',
    '竞争分析': 'Competitive Analysis',
    '网站优化': 'Website Optimization',
    '网站审计': 'Website Audit',
    '翻译': 'Translation',
    '翻译词典': 'Translation Dictionary',
    '自动化SEO': 'Automated SEO',
    '自动洞察': 'Automated Insights',
    '自动配音': 'Auto Voiceover',
    '营销视频': 'Marketing Video',
    '视频编辑': 'Video Editing',
    '语音克隆': 'Voice Cloning',
    '语音合成': 'Voice Synthesis',
    '语音生成': 'Voice Generation',
    '逼真人声': 'Realistic Voice',
    '销售助手': 'Sales Assistant',
    '问答优化': 'Q&A Optimization',
    '音频编辑': 'Audio Editing',
    '预测分析': 'Predictive Analytics',
    
    // 其他常用标签
    '聊天机器人': 'Chatbot',
    '对话AI': 'Conversational AI',
    '客服': 'Customer Service',
    '销售': 'Sales',
    '营销': 'Marketing',
    '写作': 'Writing',
    '代码': 'Coding',
    '开发': 'Development',
    '设计': 'Design',
    '图像生成': 'Image Generation',
    '配音': 'Voiceover',
    '专业': 'Professional',
    '免费': 'Free',
    '付费': 'Paid',
    '搜索引擎优化': 'SEO',
    '分析': 'Analytics',
    '研究': 'Research',
    '优化': 'Optimization',
    '线索生成': 'Lead Generation',
    '语音': 'Voice',
    '人工智能': 'AI',
    '深度学习': 'Deep Learning',
    '自然语言处理': 'NLP',
    '计算机视觉': 'Computer Vision',
    '自动化': 'Automation',
    '效率工具': 'Productivity',
    '协作': 'Collaboration',
    '团队': 'Team',
    '项目管理': 'Project Management',
    '时间管理': 'Time Management',
    '日程安排': 'Scheduling',
    '语言': 'Language',
    '文档': 'Documentation',
    '知识管理': 'Knowledge Management',
    
    // Use Cases specific translations (avoiding duplicates)
    '大规模优化': 'Large-scale Optimization',
    '自动化营销': 'Marketing Automation',
    '电子商务': 'E-commerce',
    '社交媒体': 'Social Media',
    '品牌管理': 'Brand Management',
    '用户体验': 'User Experience',
    '界面设计': 'UI Design',
    '原型设计': 'Prototyping',
    '测试优化': 'Testing & Optimization',
    '性能监控': 'Performance Monitoring',
    '安全防护': 'Security Protection',
    '云计算': 'Cloud Computing',
    '数据库管理': 'Database Management',
    'API开发': 'API Development',
    '移动开发': 'Mobile Development',
    '网站建设': 'Website Development',
    '前端开发': 'Frontend Development',
    '后端开发': 'Backend Development',
    '全栈开发': 'Full-stack Development',
    'DevOps': 'DevOps',
    '持续集成': 'Continuous Integration',
    '版本控制': 'Version Control',
    '代码审查': 'Code Review',
    '文档管理': 'Documentation Management',
    '学习平台': 'Learning Platform',
    '在线教育': 'Online Education',
    '技能培训': 'Skill Training',
    '认证考试': 'Certification Exam',
    '语言学习': 'Language Learning',
    '翻译服务': 'Translation Service',
    '国际化': 'Internationalization',
    '本地化': 'Localization'
  };
  
  // 翻译标签函数
  const translateTags = (tags: string[]): string[] => {
    return tags.map(tag => tagTranslations[tag] || tag);
  };

  // 翻译适用场景函数
  const translateUseCases = (useCases: string[]): string[] => {
    return useCases.map(useCase => tagTranslations[useCase] || useCase);
  };
  
  const getNumber = (prop: any) => prop?.number || 0;
  const getUrl = (prop: any) => prop?.url || '';
  const getFiles = (prop: any) => prop?.files?.[0]?.file?.url || prop?.files?.[0]?.external?.url || '';

  // 处理功能特点，转换为数组
  const featuresText = getRichText(properties['功能特点']);
  const features = featuresText 
    ? featuresText.split('\n').filter((f: string) => f.trim()).map((f: string) => f.replace(/^[-•*]\s*/, ''))
    : [];

  // 处理适用场景
  const useCases = translateUseCases(getMultiSelect(properties['适用场景']));

  // 生成工具ID（使用Notion页面ID或基于名称生成）
  const toolId = page.id.replace(/-/g, '');

  // 获取工具名称
  const toolName = getTitle(properties.Name);
  
  // 获取Notion中的Logo URL
  const notionLogoUrl = getFiles(properties['官方Logo']);
  
  // 使用新的logo获取逻辑
  const logo = getToolLogo(toolName, notionLogoUrl);

  // 获取原始中文描述
  const originalShortDesc = getRichText(properties['简介']);
  const originalDescription = getRichText(properties['详细描述']) || originalShortDesc;

  return {
    id: toolId,
    name: toolName,
    shortDescription: translateDescription(toolName, originalShortDesc, true),
    description: translateDescription(toolName, originalDescription, false),
    website: getUrl(properties['网址']),
    logo: logo,
    category: getSelect(properties['分类']),
    subcategory: getSelect(properties['子分类']) || undefined,
    tags: translateTags(getMultiSelect(properties['标签'])),
    useCases: useCases,
    features: features,
    pricingModel: getSelect(properties['价格模式']).toLowerCase() as PricingModel || 'freemium',
    pricing: translatePricing(getRichText(properties['具体价格'])) || 'Contact for pricing',
    rating: getNumber(properties['评分']) || 4.0,
    reviewCount: getNumber(properties['评论数']) || 0,
    status: getStatus(properties['状态']) as ToolStatus || '进行中',
    createdAt: properties['创建时间']?.created_time || new Date().toISOString(),
    updatedAt: properties['更新时间']?.last_edited_time || new Date().toISOString(),
    
    // 兼容现有接口的字段
    featured: false, // 可以后续通过Notion属性控制
    verified: getStatus(properties['状态']) === '进行中',
  };
}

/**
 * Notion API 服务类
 */
export class NotionToolsService {
  
  /**
   * 获取所有已发布的工具（包括所有状态的工具以确保最大数据覆盖）
   */
  static async getAllPublishedTools() {
    try {
      let allResults: any[] = [];
      let hasMore = true;
      let nextCursor: string | undefined;

      // 使用分页获取所有工具
      while (hasMore) {
        const queryOptions: any = {
          database_id: TOOLS_DATABASE_ID,
          sorts: [
            {
              timestamp: 'last_edited_time',
              direction: 'descending'
            }
          ],
          page_size: 100
        };

        // 如果有下一页游标，添加到查询中
        if (nextCursor) {
          queryOptions.start_cursor = nextCursor;
        }

        const response = await notion.databases.query(queryOptions);
        
        // 添加当前页面的结果
        allResults = allResults.concat(response.results);
        
        // 检查是否还有更多页面
        hasMore = response.has_more;
        nextCursor = response.next_cursor || undefined;
        
        console.log(`Fetched ${response.results.length} tools (page), total so far: ${allResults.length}`);
      }

      console.log(`Found ${allResults.length} total tools in Notion database (all pages)`);

      const filteredResults = allResults.filter((page): page is PageObjectResponse => 'properties' in page);
      console.log(`After filtering: ${filteredResults.length} valid page objects`);

      const transformedTools = filteredResults.map(transformNotionToolToAppTool);
      console.log(`After transformation: ${transformedTools.length} tools`);

      // 检查是否有无效工具被过滤
      const validTools = transformedTools.filter(tool => tool && tool.name && tool.description);
      console.log(`After validation: ${validTools.length} valid tools`);

      return validTools;

    } catch (error) {
      console.error('Error fetching tools from Notion:', error);
      throw error;
    }
  }

  /**
   * 获取所有工具（包括未发布的）
   */
  static async getAllTools() {
    try {
      let allResults: any[] = [];
      let hasMore = true;
      let nextCursor: string | undefined;

      // 使用分页获取所有工具
      while (hasMore) {
        const queryOptions: any = {
          database_id: TOOLS_DATABASE_ID,
          sorts: [
            {
              timestamp: 'last_edited_time',
              direction: 'descending'
            }
          ],
          page_size: 100
        };

        // 如果有下一页游标，添加到查询中
        if (nextCursor) {
          queryOptions.start_cursor = nextCursor;
        }

        const response = await notion.databases.query(queryOptions);
        
        // 添加当前页面的结果
        allResults = allResults.concat(response.results);
        
        // 检查是否还有更多页面
        hasMore = response.has_more;
        nextCursor = response.next_cursor || undefined;
        
        console.log(`Fetched ${response.results.length} tools (page), total so far: ${allResults.length}`);
      }

      console.log(`Found ${allResults.length} total tools (all statuses) in Notion database (all pages)`);

      return allResults
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(transformNotionToolToAppTool);

    } catch (error) {
      console.error('Error fetching all tools from Notion:', error);
      throw error;
    }
  }

  /**
   * 根据分类获取工具
   */
  static async getToolsByCategory(category: string) {
    try {
      const response = await notion.databases.query({
        database_id: TOOLS_DATABASE_ID,
        filter: {
          and: [
            {
              property: '状态',
              status: {
                equals: '进行中'
              }
            },
            {
              property: '分类',
              select: {
                equals: category
              }
            }
          ]
        },
        sorts: [
          {
            property: '评分',
            direction: 'descending'
          }
        ]
      });

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(transformNotionToolToAppTool);

    } catch (error) {
      console.error('Error fetching tools by category from Notion:', error);
      throw error;
    }
  }

  /**
   * 搜索工具
   */
  static async searchTools(query: string) {
    try {
      const response = await notion.databases.query({
        database_id: TOOLS_DATABASE_ID,
        filter: {
          and: [
            {
              property: '状态',
              status: {
                equals: '进行中'
              }
            },
            {
              or: [
                {
                  property: 'Name',
                  title: {
                    contains: query
                  }
                },
                {
                  property: '简介',
                  rich_text: {
                    contains: query
                  }
                },
                {
                  property: '标签',
                  multi_select: {
                    contains: query
                  }
                }
              ]
            }
          ]
        }
      });

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(transformNotionToolToAppTool);

    } catch (error) {
      console.error('Error searching tools in Notion:', error);
      throw error;
    }
  }

  /**
   * 获取单个工具详情
   */
  static async getToolById(id: string) {
    try {
      console.log(`获取工具详情，原始ID: ${id}`);
      
      // 将简化的ID转换回Notion页面ID格式
      const notionId = `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20, 32)}`;
      console.log(`转换后的Notion ID: ${notionId}`);
      
      const page = await notion.pages.retrieve({ page_id: notionId });
      console.log(`成功获取Notion页面`);
      
      if ('properties' in page) {
        const tool = transformNotionToolToAppTool(page as PageObjectResponse);
        console.log(`成功转换工具数据: ${tool.name}`);
        return tool;
      }
      
      console.log('页面没有properties属性');
      return null;
    } catch (error: any) {
      console.error('Error fetching tool by ID from Notion:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status
      });
      return null;
    }
  }

  /**
   * 获取所有分类
   */
  static async getAllCategories() {
    try {
      // 获取所有工具，不过滤状态
      const response = await notion.databases.query({
        database_id: TOOLS_DATABASE_ID,
        sorts: [
          {
            timestamp: 'last_edited_time',
            direction: 'descending'
          }
        ]
      });

      const categoryCount = new Map<string, number>();
      
      response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .forEach(page => {
          const properties = page.properties as unknown as NotionToolProperties;
          const category = properties['分类']?.select?.name;
          if (category) {
            categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
          }
        });

      // 定义类别图标映射
      const categoryIcons: { [key: string]: string } = {
        'Writing & Content': '✍️',
        'Design & Art': '🎨',
        'Development': '💻',
        'Business & Analytics': '📊',
        'Marketing & SEO': '📈',
        'Video & Audio': '🎥',
        'Language & Translation': '🌐',
        'Image Generation': '🖼️',
        'Productivity': '⚡',
        'Code Development': '⌨️',
        'Conversational AI': '💬'
      };

      return Array.from(categoryCount.entries()).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
        description: `Discover ${name} tools`,
        icon: categoryIcons[name] || '🔧',
        toolCount: count
      }));

    } catch (error) {
      console.error('Error fetching categories from Notion:', error);
      throw error;
    }
  }

  /**
   * 删除工具
   */
  static async deleteTool(id: string) {
    try {
      console.log(`正在删除工具 ID: ${id}`);
      
      // 使用 Notion API 删除页面（实际是归档）
      await notion.pages.update({
        page_id: id,
        archived: true
      });
      
      console.log(`✅ 工具 ${id} 已归档删除`);
      return true;
    } catch (error) {
      console.error(`❌ 删除工具 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 获取数据库结构信息
   */
  static async getDatabaseSchema() {
    try {
      const database = await notion.databases.retrieve({
        database_id: TOOLS_DATABASE_ID
      });
      
      return database.properties;
    } catch (error) {
      console.error('Error fetching database schema:', error);
      throw error;
    }
  }
}

export default NotionToolsService;
