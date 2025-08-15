const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

// 初始化 Notion 客户端
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN, // 修正环境变量名称
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

// Language & Translation 新工具数据
const newLanguageTools = [
  {
    name: 'DeepL',
    category: 'Language & Translation',
    description: 'AI-powered translation service with superior accuracy for professional documents, supporting 31 languages with context-aware translations.',
    fullDescription: 'DeepL is a neural machine translation service that offers superior translation quality compared to other translation tools. It uses artificial intelligence and neural networks to understand context and deliver more natural translations. DeepL supports 31 languages and is particularly good at handling professional documents, technical texts, and maintaining the tone and style of the original content.',
    tags: ['Translation', 'AI', 'Professional', 'Documents', 'Neural Networks'],
    pricing: 'freemium',
    website: 'https://www.deepl.com',
    logoUrl: 'https://static.deepl.com/img/logo/deepl-logo-blue.svg',
    useCases: ['Professional document translation', 'Business communications', 'Technical content localization', 'Academic paper translation']
  },
  {
    name: 'Whisper by OpenAI',
    category: 'Language & Translation',
    description: 'Open-source speech recognition system that can transcribe and translate audio in 100+ languages with remarkable accuracy.',
    fullDescription: 'Whisper is an automatic speech recognition (ASR) system trained on 680,000 hours of multilingual and multitask supervised data collected from the web. It is robust to accents, background noise, and technical language. The system can perform multilingual speech recognition, speech translation, and language identification.',
    tags: ['Speech-to-Text', 'Translation', 'OpenAI', 'Transcription', 'Open Source'],
    pricing: 'free',
    website: 'https://openai.com/research/whisper',
    logoUrl: 'https://cdn.openai.com/assets/logo-social-card.jpg',
    useCases: ['Audio transcription', 'Multilingual content creation', 'Accessibility services', 'Meeting transcripts']
  },
  {
    name: 'Papago',
    category: 'Language & Translation',
    description: 'Naver AI translation service optimized for Asian languages, featuring image translation and real-time conversation modes.',
    fullDescription: 'Papago is Naver\'s AI-powered translation service that specializes in Asian languages including Korean, Japanese, Chinese, and more. It offers various translation modes including text, voice, image, and handwriting recognition. The service is particularly strong in understanding cultural context and idiomatic expressions in Asian languages.',
    tags: ['Translation', 'Asian Languages', 'Image Translation', 'Real-time', 'Cultural Context'],
    pricing: 'free',
    website: 'https://papago.naver.com',
    logoUrl: 'https://papago.naver.com/static/img/papago_og.png',
    useCases: ['Asian language translation', 'Travel communication', 'Image text translation', 'Real-time conversations']
  },
  {
    name: 'Microsoft Translator',
    category: 'Language & Translation',
    description: 'Enterprise-grade translation service with 100+ languages, real-time conversation translation, and Office integration.',
    fullDescription: 'Microsoft Translator is a cloud-based machine translation service that supports more than 100 languages and dialects. It offers text translation, speech translation, conversation translation, and document translation. The service integrates with Microsoft Office applications and provides APIs for developers.',
    tags: ['Translation', 'Enterprise', 'Real-time', 'Microsoft', 'Office Integration'],
    pricing: 'freemium',
    website: 'https://www.microsoft.com/en-us/translator',
    logoUrl: 'https://www.microsoft.com/translator/static/img/microsoft-translator-logo.png',
    useCases: ['Enterprise document translation', 'Multi-language meetings', 'Office integration', 'Developer APIs']
  },
  {
    name: 'Reverso',
    category: 'Language & Translation',
    description: 'Comprehensive language platform with translation, grammar check, and context examples from authentic sources.',
    fullDescription: 'Reverso is a comprehensive language platform that offers translation, dictionary, grammar checking, and language learning tools. It provides context examples from real-world sources, helping users understand how words and phrases are used in different situations. The platform also includes conjugation tools and pronunciation guides.',
    tags: ['Translation', 'Grammar', 'Context Examples', 'Learning', 'Dictionary'],
    pricing: 'freemium',
    website: 'https://www.reverso.net',
    logoUrl: 'https://dictionary.reverso.net/favicon.ico',
    useCases: ['Language learning', 'Translation verification', 'Grammar checking', 'Context understanding']
  }
];

// Development 新工具数据
const newDevelopmentTools = [
  {
    name: 'Cursor',
    category: 'Development',
    description: 'AI-first code editor built on VSCode with advanced AI pair programming, codebase understanding, and intelligent refactoring.',
    fullDescription: 'Cursor is an AI-first code editor built on VSCode that provides advanced AI assistance for programming. It features intelligent code completion, natural language to code conversion, codebase-wide understanding, and AI-powered refactoring. Cursor can understand your entire codebase and provide contextually relevant suggestions.',
    tags: ['Code Editor', 'AI Programming', 'VSCode', 'Pair Programming', 'Refactoring'],
    pricing: 'freemium',
    website: 'https://cursor.sh',
    logoUrl: 'https://cursor.sh/favicon.ico',
    useCases: ['AI pair programming', 'Code refactoring', 'Natural language coding', 'Codebase exploration']
  },
  {
    name: 'v0 by Vercel',
    category: 'Development',
    description: 'AI-powered UI generator that creates React components from text prompts, integrated with Vercel deployment pipeline.',
    fullDescription: 'v0 is an AI-powered user interface generator that creates React components and web applications from text descriptions. It generates clean, production-ready code using modern web technologies like React, Tailwind CSS, and TypeScript. The tool is tightly integrated with Vercel\'s deployment infrastructure.',
    tags: ['UI Generation', 'React', 'AI', 'Vercel', 'Components'],
    pricing: 'freemium',
    website: 'https://v0.dev',
    logoUrl: 'https://v0.dev/favicon.ico',
    useCases: ['Rapid prototyping', 'UI component generation', 'React development', 'Design to code']
  },
  {
    name: 'Windsurf',
    category: 'Development',
    description: 'AI-powered code editor by Codeium with advanced AI assistance, multi-file editing, and intelligent code suggestions.',
    fullDescription: 'Windsurf is Codeium\'s AI-powered code editor that provides advanced AI assistance for software development. It features multi-file editing capabilities, intelligent code suggestions, and deep understanding of programming contexts. The editor supports multiple programming languages and frameworks.',
    tags: ['Code Editor', 'AI Assistant', 'Multi-file', 'Codeium', 'Programming'],
    pricing: 'free',
    website: 'https://codeium.com/windsurf',
    logoUrl: 'https://codeium.com/favicon.ico',
    useCases: ['Multi-file development', 'AI code assistance', 'Programming productivity', 'Code navigation']
  },
  {
    name: 'Bolt.new',
    category: 'Development',
    description: 'AI-powered full-stack development platform that can build, deploy, and iterate on web applications from natural language.',
    fullDescription: 'Bolt.new is an AI-powered development platform that can create full-stack web applications from natural language descriptions. It handles both frontend and backend development, database setup, and deployment. Users can describe what they want to build, and Bolt will generate and deploy a working application.',
    tags: ['Full-stack', 'AI Development', 'Web Apps', 'Deployment', 'Natural Language'],
    pricing: 'freemium',
    website: 'https://bolt.new',
    logoUrl: 'https://bolt.new/favicon.ico',
    useCases: ['Rapid app development', 'Full-stack prototyping', 'Natural language programming', 'Quick deployment']
  },
  {
    name: 'Lovable',
    category: 'Development',
    description: 'AI software engineer that builds full applications from specifications, handling frontend, backend, and deployment.',
    fullDescription: 'Lovable is an AI software engineer that can build complete applications from high-level specifications. It handles everything from frontend user interfaces to backend APIs, database design, and deployment. The AI can iterate on feedback and make changes across the entire application stack.',
    tags: ['AI Engineer', 'Full Application', 'Frontend', 'Backend', 'Deployment'],
    pricing: 'paid',
    website: 'https://lovable.dev',
    logoUrl: 'https://lovable.dev/favicon.ico',
    useCases: ['Complete app development', 'AI software engineering', 'End-to-end solutions', 'Application architecture']
  }
];

// 添加工具到 Notion 的函数
async function addToolToNotion(tool) {
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
        '分类': {
          select: {
            name: tool.category,
          },
        },
        '标签': {
          multi_select: tool.tags.map(tag => ({ name: tag })),
        },
        '价格模式': {
          select: {
            name: tool.pricing,
          },
        },
        '适用场景': {
          multi_select: tool.useCases.map(useCase => ({ name: useCase })),
        },
        'Logo URL': {
          url: tool.logoUrl,
        },
        '状态': {
          status: {
            name: 'Published',
          },
        },
        '发布时间': {
          date: {
            start: new Date().toISOString().split('T')[0],
          },
        },
        '支持语言': {
          multi_select: [
            { name: 'English' },
            { name: 'Chinese' }
          ],
        },
      },
    });

    console.log(`✅ 成功添加: ${tool.name}`);
    return response;
  } catch (error) {
    console.error(`❌ 添加失败 ${tool.name}:`, error.message);
    if (error.body) {
      console.error('详细错误:', JSON.stringify(error.body, null, 2));
    }
    return null;
  }
}

async function addAllNewTools() {
  console.log('🚀 开始添加新工具到 Notion 数据库...\n');
  
  const allNewTools = [...newLanguageTools, ...newDevelopmentTools];
  const results = [];
  
  console.log(`总共要添加 ${allNewTools.length} 个工具\n`);
  
  for (const tool of allNewTools) {
    const result = await addToolToNotion(tool);
    results.push(result);
    
    // 延迟一下避免 API 限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const successCount = results.filter(r => r !== null).length;
  
  console.log('\n=== 添加结果 ===');
  console.log(`✅ 成功添加: ${successCount} 个工具`);
  console.log(`❌ 失败: ${results.length - successCount} 个工具`);
  
  console.log('\n📚 Language & Translation 工具已添加:');
  newLanguageTools.forEach((tool, index) => {
    console.log(`  ${index + 1}. ${tool.name}`);
  });
  
  console.log('\n💻 Development 工具已添加:');
  newDevelopmentTools.forEach((tool, index) => {
    console.log(`  ${index + 1}. ${tool.name}`);
  });
  
  console.log('\n🎉 所有新工具已成功添加到 Notion 数据库！');
  console.log('前端页面将自动显示新工具 (可能需要几分钟更新缓存)');
}

// 检查环境变量
if (!process.env.NOTION_API_TOKEN || !process.env.NOTION_TOOLS_DATABASE_ID) {
  console.error('❌ 错误: 请确保设置了 NOTION_API_TOKEN 和 NOTION_TOOLS_DATABASE_ID 环境变量');
  process.exit(1);
}

// 执行添加
addAllNewTools()
  .then(() => {
    console.log('\n✨ 任务完成！');
  })
  .catch((error) => {
    console.error('💥 执行失败:', error);
  });
