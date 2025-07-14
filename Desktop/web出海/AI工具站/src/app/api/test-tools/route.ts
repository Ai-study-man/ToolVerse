import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('开始获取测试数据...');
    
    // 直接返回硬编码的测试数据，绕过Notion API
    const testTools = [
      {
        id: 'test1',
        name: 'ChatGPT',
        shortDescription: '强大的对话式 AI 助手',
        description: 'OpenAI 开发的对话式 AI 助手，能够进行自然对话、回答问题、协助写作等多种任务。',
        website: 'https://chat.openai.com',
        category: 'Writing & Content',
        pricingModel: 'freemium',
        pricing: '免费版 + $20/月 Plus版',
        rating: 4.8,
        tags: ['对话AI', '写作助手', '问答系统', '内容创作'],
        createdAt: '2023-01-01'
      },
      {
        id: 'test2',
        name: 'Midjourney',
        shortDescription: 'AI 图像生成工具，通过文字描述创建艺术作品',
        description: 'Midjourney 是一款强大的 AI 图像生成工具，用户只需输入文字描述，就能生成高质量的艺术图像和插画。',
        website: 'https://midjourney.com',
        category: 'Design & Art',
        pricingModel: 'paid',
        pricing: '$10-60/月订阅制',
        rating: 4.7,
        tags: ['图像生成', 'AI艺术', '创意设计', '数字艺术'],
        createdAt: '2023-02-15'
      }
    ];

    console.log(`返回 ${testTools.length} 个测试工具`);

    return NextResponse.json({
      success: true,
      data: { tools: testTools },
      count: testTools.length,
      source: 'test-data'
    });

  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch test tools',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
