require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

// Language & Translation 新工具数据
const newLanguageTools = [
  {
    name: 'DeepL',
    description: 'AI-powered translation service with superior accuracy for professional documents',
    fullDescription: 'DeepL is a neural machine translation service that offers superior translation quality compared to other translation tools. It uses artificial intelligence and neural networks to understand context and deliver more natural translations. DeepL supports 31 languages and is particularly good at handling professional documents, technical texts, and maintaining the tone and style of the original content.',
    website: 'https://www.deepl.com',
    tags: ['Translation', 'AI', 'Professional', 'Documents', 'Neural Networks'],
    features: ['Professional document translation', 'Business communications', 'Technical content localization', 'Academic paper translation', 'Context-aware translations'],
    pricingModel: 'freemium',
    rating: 4.8,
    category: 'Language & Translation'
  },
  {
    name: 'Whisper by OpenAI',
    description: 'Open-source speech recognition system for transcription and translation',
    fullDescription: 'Whisper is an automatic speech recognition (ASR) system trained on 680,000 hours of multilingual and multitask supervised data collected from the web. It is robust to accents, background noise, and technical language. The system can perform multilingual speech recognition, speech translation, and language identification.',
    website: 'https://openai.com/research/whisper',
    tags: ['Speech-to-Text', 'Translation', 'OpenAI', 'Transcription', 'Open Source'],
    features: ['Audio transcription', 'Multilingual content creation', 'Accessibility services', 'Meeting transcripts', '100+ language support'],
    pricingModel: 'free',
    rating: 4.7,
    category: 'Language & Translation'
  },
  {
    name: 'Papago',
    description: 'Naver AI translation service optimized for Asian languages',
    fullDescription: 'Papago is Naver AI-powered translation service that specializes in Asian languages including Korean, Japanese, Chinese, and more. It offers various translation modes including text, voice, image, and handwriting recognition. The service is particularly strong in understanding cultural context and idiomatic expressions in Asian languages.',
    website: 'https://papago.naver.com',
    tags: ['Translation', 'Asian Languages', 'Image Translation', 'Real-time', 'Cultural Context'],
    features: ['Asian language translation', 'Travel communication', 'Image text translation', 'Real-time conversations', 'Cultural context understanding'],
    pricingModel: 'free',
    rating: 4.5,
    category: 'Language & Translation'
  },
  {
    name: 'Microsoft Translator',
    description: 'Enterprise-grade translation service with 100+ languages',
    fullDescription: 'Microsoft Translator is a cloud-based machine translation service that supports more than 100 languages and dialects. It offers text translation, speech translation, conversation translation, and document translation. The service integrates with Microsoft Office applications and provides APIs for developers.',
    website: 'https://www.microsoft.com/en-us/translator',
    tags: ['Translation', 'Enterprise', 'Real-time', 'Microsoft', 'Office Integration'],
    features: ['Enterprise document translation', 'Multi-language meetings', 'Office integration', 'Developer APIs', 'Real-time conversation translation'],
    pricingModel: 'freemium',
    rating: 4.4,
    category: 'Language & Translation'
  },
  {
    name: 'Reverso',
    description: 'Comprehensive language platform with translation and grammar tools',
    fullDescription: 'Reverso is a comprehensive language platform that offers translation, dictionary, grammar checking, and language learning tools. It provides context examples from real-world sources, helping users understand how words and phrases are used in different situations. The platform also includes conjugation tools and pronunciation guides.',
    website: 'https://www.reverso.net',
    tags: ['Translation', 'Grammar', 'Context Examples', 'Learning', 'Dictionary'],
    features: ['Language learning', 'Translation verification', 'Grammar checking', 'Context understanding', 'Pronunciation guides'],
    pricingModel: 'freemium',
    rating: 4.3,
    category: 'Language & Translation'
  }
];

// Development 新工具数据
const newDevelopmentTools = [
  {
    name: 'Cursor',
    description: 'AI-first code editor built on VSCode with advanced programming assistance',
    fullDescription: 'Cursor is an AI-first code editor built on VSCode that provides advanced AI assistance for programming. It features intelligent code completion, natural language to code conversion, codebase-wide understanding, and AI-powered refactoring. Cursor can understand your entire codebase and provide contextually relevant suggestions.',
    website: 'https://cursor.sh',
    tags: ['Code Editor', 'AI Programming', 'VSCode', 'Pair Programming', 'Refactoring'],
    features: ['AI pair programming', 'Code refactoring', 'Natural language coding', 'Codebase exploration', 'Intelligent code completion'],
    pricingModel: 'freemium',
    rating: 4.8,
    category: 'Development'
  },
  {
    name: 'v0 by Vercel',
    description: 'AI-powered UI generator for React components from text prompts',
    fullDescription: 'v0 is an AI-powered user interface generator that creates React components and web applications from text descriptions. It generates clean, production-ready code using modern web technologies like React, Tailwind CSS, and TypeScript. The tool is tightly integrated with Vercel deployment infrastructure.',
    website: 'https://v0.dev',
    tags: ['UI Generation', 'React', 'AI', 'Vercel', 'Components'],
    features: ['Rapid prototyping', 'UI component generation', 'React development', 'Design to code', 'Tailwind CSS integration'],
    pricingModel: 'freemium',
    rating: 4.6,
    category: 'Development'
  },
  {
    name: 'Windsurf',
    description: 'AI-powered code editor by Codeium with multi-file editing',
    fullDescription: 'Windsurf is Codeium AI-powered code editor that provides advanced AI assistance for software development. It features multi-file editing capabilities, intelligent code suggestions, and deep understanding of programming contexts. The editor supports multiple programming languages and frameworks.',
    website: 'https://codeium.com/windsurf',
    tags: ['Code Editor', 'AI Assistant', 'Multi-file', 'Codeium', 'Programming'],
    features: ['Multi-file development', 'AI code assistance', 'Programming productivity', 'Code navigation', 'Language support'],
    pricingModel: 'free',
    rating: 4.5,
    category: 'Development'
  },
  {
    name: 'Bolt.new',
    description: 'AI-powered full-stack development platform for web applications',
    fullDescription: 'Bolt.new is an AI-powered development platform that can create full-stack web applications from natural language descriptions. It handles both frontend and backend development, database setup, and deployment. Users can describe what they want to build, and Bolt will generate and deploy a working application.',
    website: 'https://bolt.new',
    tags: ['Full-stack', 'AI Development', 'Web Apps', 'Deployment', 'Natural Language'],
    features: ['Rapid app development', 'Full-stack prototyping', 'Natural language programming', 'Quick deployment', 'Database setup'],
    pricingModel: 'freemium',
    rating: 4.4,
    category: 'Development'
  },
  {
    name: 'Lovable',
    description: 'AI software engineer for complete application development',
    fullDescription: 'Lovable is an AI software engineer that can build complete applications from high-level specifications. It handles everything from frontend user interfaces to backend APIs, database design, and deployment. The AI can iterate on feedback and make changes across the entire application stack.',
    website: 'https://lovable.dev',
    tags: ['AI Engineer', 'Full Application', 'Frontend', 'Backend', 'Deployment'],
    features: ['Complete app development', 'AI software engineering', 'End-to-end solutions', 'Application architecture', 'Iterative development'],
    pricingModel: 'paid',
    rating: 4.7,
    category: 'Development'
  }
];

async function addToolsToNotion() {
  console.log('🚀 开始添加新工具到 Notion 数据库...\n');
  
  const allTools = [...newLanguageTools, ...newDevelopmentTools];
  let successCount = 0;
  let failCount = 0;
  
  console.log(`总共要添加 ${allTools.length} 个工具\n`);
  
  for (const tool of allTools) {
    try {
      console.log(`📝 添加工具: ${tool.name}`);
      
      const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          'Name': {
            title: [
              {
                text: {
                  content: tool.name,
                },
              },
            ],
          },
          '简介': {
            rich_text: [
              {
                text: {
                  content: tool.description,
                },
              },
            ],
          },
          '详细描述': {
            rich_text: [
              {
                text: {
                  content: tool.fullDescription,
                },
              },
            ],
          },
          '网址': {
            url: tool.website,
          },
          '标签': {
            multi_select: tool.tags.map(tag => ({ name: tag })),
          },
          '适用场景': {
            multi_select: tool.features.map(feature => ({ name: feature })),
          },
          '价格模式': {
            select: {
              name: tool.pricingModel,
            },
          },
          '评分': {
            number: tool.rating,
          },
          '分类': {
            select: {
              name: tool.category,
            },
          },
          '状态': {
            status: {
              name: '已完成',
            },
          },
        },
      });
      
      console.log(`✅ 成功添加: ${tool.name}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ 添加 ${tool.name} 时出错:`, error.message);
      failCount++;
    }
    
    // 延迟一下避免 API 限制
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  console.log('\n=== 添加结果汇总 ===');
  console.log(`✅ 成功添加: ${successCount} 个工具`);
  console.log(`❌ 失败: ${failCount} 个工具`);
  
  if (successCount > 0) {
    console.log('\n📚 Language & Translation 新增工具:');
    newLanguageTools.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name} - ${tool.rating}⭐`);
    });
    
    console.log('\n💻 Development 新增工具:');
    newDevelopmentTools.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name} - ${tool.rating}⭐`);
    });
    
    console.log('\n🎉 新工具已成功添加到 Notion 数据库！');
    console.log('💡 前端页面将在几分钟内自动显示新工具');
    console.log('🔄 如需立即看到效果，请重启开发服务器');
  }
}

// 检查环境变量
if (!process.env.NOTION_API_TOKEN || !process.env.NOTION_TOOLS_DATABASE_ID) {
  console.error('❌ 错误: 请确保设置了 NOTION_API_TOKEN 和 NOTION_TOOLS_DATABASE_ID 环境变量');
  console.log('💡 检查 .env.local 文件是否包含正确的配置');
  process.exit(1);
}

addToolsToNotion().catch(error => {
  console.error('💥 执行失败:', error);
});
