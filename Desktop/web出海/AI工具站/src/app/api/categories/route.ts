import { NextRequest, NextResponse } from 'next/server';
import { NotionToolsService } from '../../../lib/notionService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const direct = searchParams.get('direct') === 'true';

    if (direct) {
      // 直接从Notion获取类别数据
      console.log('直接从Notion获取类别数据...');
      
      // 添加重试机制
      let lastError: Error | null = null;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const categories = await NotionToolsService.getAllCategories();
          console.log(`直接获取到 ${categories.length} 个类别 (第${attempt}次尝试)`);
          return NextResponse.json({
            success: true,
            data: { categories },
            count: categories.length,
            source: 'notion-direct',
            attempt
          });
        } catch (error) {
          lastError = error as Error;
          console.error(`获取类别数据失败 (第${attempt}次尝试):`, error);
          
          if (attempt < maxRetries) {
            // 等待一段时间后重试，逐渐增加等待时间
            const waitTime = attempt * 1000;
            console.log(`等待${waitTime}ms后重试...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }
      
      // 所有重试都失败了，返回错误
      throw lastError || new Error('Failed to fetch categories after multiple attempts');
    }

    // 默认调用方式
    const categories = await NotionToolsService.getAllCategories();
    
    return NextResponse.json({
      success: true,
      data: { categories },
      count: categories.length
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
