const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const DATABASE_ID = process.env.NOTION_TOOLS_DATABASE_ID;

async function addToolsToNotion() {
  console.log('🚀 Starting to add LetsEnhance and IMGCreator AI to Notion database...');
  
  try {
    // Add LetsEnhance
    console.log('📝 Adding LetsEnhance...');
    const letsenhanceResponse = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID,
      },
      properties: {
        'Name': {
          title: [
            {
              text: {
                content: 'LetsEnhance',
              },
            },
          ],
        },
        '简介': {
          rich_text: [
            {
              text: {
                content: 'AI-powered image enhancement tool that automatically improves photo quality, resolution, and removes noise using advanced machine learning algorithms.',
              },
            },
          ],
        },
        '详细描述': {
          rich_text: [
            {
              text: {
                content: 'LetsEnhance is a comprehensive AI-powered image enhancement platform that automatically improves photo quality using advanced machine learning algorithms. The platform offers intelligent upscaling up to 16x, noise reduction, color enhancement, and batch processing capabilities. Perfect for photographers, e-commerce businesses, real estate professionals, and content creators who need to enhance image quality quickly and efficiently.',
              },
            },
          ],
        },
        '网址': {
          url: 'https://letsenhance.io/zh-CN/',
        },
        '标签': {
          multi_select: [
            { name: 'Image Enhancement' },
            { name: 'Photo Quality' },
            { name: 'AI Upscaling' },
            { name: 'Image Processing' },
            { name: 'Photo Editing' }
          ],
        },
        '适用场景': {
          multi_select: [
            { name: 'Photo Enhancement' },
            { name: 'Image Restoration' },
            { name: 'Print Preparation' },
            { name: 'E-commerce Photography' },
            { name: 'Real Estate Marketing' },
            { name: 'Social Media Content' },
            { name: 'Digital Art Improvement' },
            { name: 'Professional Photography' }
          ],
        },
        '功能特点': {
          multi_select: [
            { name: 'AI Image Upscaling' },
            { name: 'Noise Reduction' },
            { name: 'Color Enhancement' },
            { name: 'Batch Processing' },
            { name: 'API Integration' },
            { name: 'High-Quality Output' }
          ],
        },
        '价格模式': {
          select: {
            name: 'freemium',
          },
        },
        '具体价格': {
          rich_text: [
            {
              text: {
                content: 'Free: 5 images per month with basic features; Pro: $9/month for 100 images; Business: $39/month for 500 images with advanced features and API access',
              },
            },
          ],
        },
        '评分': {
          number: 4.5,
        },
        '分类': {
          select: {
            name: 'AI Image Tools',
          },
        },
        '子分类': {
          rich_text: [
            {
              text: {
                content: 'Image Enhancement',
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

    console.log('✅ LetsEnhance added successfully with ID:', letsenhanceResponse.id);

    // Add IMGCreator AI
    console.log('📝 Adding IMGCreator AI...');
    const imgcreatorResponse = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID,
      },
      properties: {
        'Name': {
          title: [
            {
              text: {
                content: 'IMGCreator AI',
              },
            },
          ],
        },
        '简介': {
          rich_text: [
            {
              text: {
                content: 'Advanced AI-powered image generation and editing platform that creates stunning visuals from text descriptions and transforms existing images with intelligent editing capabilities.',
              },
            },
          ],
        },
        '详细描述': {
          rich_text: [
            {
              text: {
                content: 'IMGCreator AI is a comprehensive AI image generation and editing platform that enables users to create stunning visuals from text descriptions. The platform combines advanced diffusion models with intuitive editing tools, offering text-to-image generation, image-to-image transformation, style transfer, and intelligent background removal. Ideal for content creators, marketers, designers, and businesses looking to create high-quality visual content quickly and efficiently.',
              },
            },
          ],
        },
        '网址': {
          url: 'https://www.zmo.ai/imgcreator',
        },
        '标签': {
          multi_select: [
            { name: 'Image Generation' },
            { name: 'Text to Image' },
            { name: 'AI Art' },
            { name: 'Creative Tools' },
            { name: 'Digital Design' }
          ],
        },
        '适用场景': {
          multi_select: [
            { name: 'Digital Art Creation' },
            { name: 'Content Marketing' },
            { name: 'Social Media Graphics' },
            { name: 'E-commerce Product Images' },
            { name: 'Creative Design' },
            { name: 'Concept Art' },
            { name: 'Marketing Materials' },
            { name: 'Visual Storytelling' }
          ],
        },
        '功能特点': {
          multi_select: [
            { name: 'Text-to-Image Generation' },
            { name: 'AI Image Editing' },
            { name: 'Style Transfer' },
            { name: 'Background Removal' },
            { name: 'Image Variations' },
            { name: 'High-Resolution Output' }
          ],
        },
        '价格模式': {
          select: {
            name: 'freemium',
          },
        },
        '具体价格': {
          rich_text: [
            {
              text: {
                content: 'Free: Limited generations per month; Pro: $19/month for unlimited generations; Business: $49/month with commercial license and advanced features',
              },
            },
          ],
        },
        '评分': {
          number: 4.3,
        },
        '分类': {
          select: {
            name: 'AI Image Tools',
          },
        },
        '子分类': {
          rich_text: [
            {
              text: {
                content: 'Image Generation',
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

    console.log('✅ IMGCreator AI added successfully with ID:', imgcreatorResponse.id);

    console.log('\n🎉 All tools have been successfully added to the Notion database!');
    console.log('\n📊 Summary:');
    console.log(`- LetsEnhance (ID: ${letsenhanceResponse.id})`);
    console.log(`- IMGCreator AI (ID: ${imgcreatorResponse.id})`);
    
  } catch (error) {
    console.error('❌ Error adding tools to Notion:', error);
    if (error.code === 'validation_error') {
      console.error('Validation error details:', error.body);
    }
  }
}

// Run the script
addToolsToNotion();
