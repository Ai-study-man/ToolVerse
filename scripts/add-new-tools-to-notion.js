require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

// 要添加的三个新工具
const newTools = [
  {
    name: 'Chatsimple',
    description: 'AI-powered customer service and sales acceleration platform',
    fullDescription: 'Intelligent customer service chatbot platform that automates business communications and enhances customer engagement through AI-powered conversations.',
    website: 'https://chatsimple.ai/?via=aitoolverse',
    tags: ['Customer Service', 'Sales', 'Lead Generation', 'Multilingual', 'Voice'],
    features: ['Website voice customer service', '3x lead acquisition increase', '2x high-quality meeting boost', 'Personalized follow-up and conversion', 'Support for 175+ languages'],
    pricingModel: 'paid',
    rating: 4.6,
    category: 'Business & Analytics'
  },
  {
    name: 'Frase',
    description: 'AI content creation and SEO optimization platform',
    fullDescription: 'Comprehensive SEO and content optimization platform that helps businesses create data-driven content strategies and improve search rankings.',
    website: 'https://www.frase.io/?via=aitoolverse',
    tags: ['SEO', 'Content Creation', 'Research', 'Optimization', 'Analytics'],
    features: ['AI content research and analysis', 'SEO-optimized content briefs', 'Content scoring and optimization', 'Competitor content analysis', 'SERP analysis and insights'],
    pricingModel: 'paid',
    rating: 4.5,
    category: 'Marketing & SEO'
  },
  {
    name: 'Murf AI',
    description: 'Professional AI voice synthesis and text-to-speech platform',
    fullDescription: 'Advanced AI voice generation platform that creates natural-sounding voiceovers and audio content for professional multimedia projects.',
    website: 'https://murf.ai/?lmref=aitoolverse',
    tags: ['Voice Synthesis', 'Text-to-Speech', 'Voiceover', 'Multilingual', 'Professional'],
    features: ['Natural human-like voices', 'Multiple language support', 'Voice customization controls', 'Professional audio quality', 'Video production integration'],
    pricingModel: 'freemium',
    rating: 4.7,
    category: 'Video & Audio'
  }
];

async function addToolsToNotion() {
  console.log('🚀 开始添加新工具到 Notion 数据库...');
  
  for (const tool of newTools) {
    try {
      console.log(`\n📝 添加工具: ${tool.name}`);
      
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
      
      console.log(`✅ 成功添加: ${tool.name} (ID: ${response.id})`);
      
    } catch (error) {
      console.error(`❌ 添加 ${tool.name} 时出错:`, error.message);
    }
  }
  
  console.log('\n🎉 所有工具添加完成！');
}

addToolsToNotion().catch(console.error);
