require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

// Fal AI 工具数据
const falAiTool = {
  name: 'Fal AI',
  description: 'Fast generative media platform for developers with 600+ AI models for image, video, and audio generation',
  fullDescription: 'Fal AI is a comprehensive generative media platform designed specifically for developers. It offers 600+ production-ready AI models for image, video, voice, and code generation through a simple API. The platform features the fastest inference engine for diffusion models (up to 10x faster), on-demand serverless GPUs, and dedicated clusters for large-scale training. Fal AI provides unified API access to state-of-the-art models like FLUX.1, Kling Video, and Veo 3, making it easy for developers to integrate AI capabilities into their applications without MLOps complexity.',
  website: 'https://fal.ai',
  tags: ['AI Platform', 'Image Generation', 'Video Generation', 'Voice AI', 'Developer Tools', 'API', 'Serverless', 'MLOps'],
  features: [
    '600+ AI models',
    'Fastest inference',
    'Serverless GPUs',
    'Unified API',
    'Enterprise grade',
    'Real-time monitoring'
  ],
  useCases: [
    'AI-powered application development',
    'Creative content generation',
    'Video and image processing',
    'Voice synthesis and audio generation',
    'Custom model training and fine-tuning',
    'Enterprise AI integration',
    'Rapid prototyping of AI features',
    'Large-scale inference workloads'
  ],
  pricingModel: 'freemium',
  pricingDetails: 'Pay-per-use model starting from $1.2 for GPU access. Free tier available for testing. Enterprise plans with reserved capacity and dedicated support.',
  rating: 4.8,
  category: 'Development Tools',
  subcategory: 'AI Platform'
};

async function addFalAiToNotion() {
  console.log('🚀 开始添加 Fal AI 工具到 Notion 数据库...\n');
  
  try {
    console.log(`📝 添加工具: ${falAiTool.name}`);
    
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Name': {
          title: [
            {
              text: {
                content: falAiTool.name,
              },
            },
          ],
        },
        '简介': {
          rich_text: [
            {
              text: {
                content: falAiTool.description,
              },
            },
          ],
        },
        '详细描述': {
          rich_text: [
            {
              text: {
                content: falAiTool.fullDescription,
              },
            },
          ],
        },
        '网址': {
          url: falAiTool.website,
        },
        '标签': {
          multi_select: falAiTool.tags.map(tag => ({ name: tag })),
        },
        '适用场景': {
          multi_select: falAiTool.useCases.map(useCase => ({ name: useCase })),
        },
        '功能特点': {
          multi_select: falAiTool.features.map(feature => ({ name: feature })),
        },
        '价格模式': {
          select: {
            name: falAiTool.pricingModel,
          },
        },
        '具体价格': {
          rich_text: [
            {
              text: {
                content: falAiTool.pricingDetails,
              },
            },
          ],
        },
        '评分': {
          number: falAiTool.rating,
        },
        '分类': {
          select: {
            name: falAiTool.category,
          },
        },
        '子分类': {
          rich_text: [
            {
              text: {
                content: falAiTool.subcategory,
              },
            },
          ],
        },
        '状态': {
          status: {
            name: '进行中',
          },
        },
      },
    });

    console.log(`✅ 成功添加 ${falAiTool.name}`);
    console.log(`📄 页面ID: ${response.id}\n`);

  } catch (error) {
    console.error(`❌ 添加 ${falAiTool.name} 失败:`, error.message);
    
    if (error.code === 'validation_error') {
      console.error('验证错误详情:', JSON.stringify(error.body, null, 2));
    }
  }
}

// 执行添加操作
addFalAiToNotion()
  .then(() => {
    console.log('🎉 Fal AI 工具添加完成！');
  })
  .catch(console.error);
