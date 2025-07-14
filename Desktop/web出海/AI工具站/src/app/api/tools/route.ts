import { NextRequest, NextResponse } from 'next/server';
import DataSyncService from '../../../lib/dataSyncService';
import { NotionToolsService } from '../../../lib/notionService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';
    const direct = searchParams.get('direct') === 'true';
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (force) {
      // 强制刷新数据
      const data = await DataSyncService.forceRefresh();
      return NextResponse.json({
        success: true,
        data,
        message: 'Data refreshed successfully'
      });
    }

    if (direct) {
      // 直接从Notion获取数据，绕过缓存
      console.log('直接从Notion获取工具数据...');
      
      // 添加重试机制
      let lastError: Error | null = null;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const tools = await NotionToolsService.getAllPublishedTools();
          console.log(`直接获取到 ${tools.length} 个工具 (第${attempt}次尝试)`);
          return NextResponse.json({
            success: true,
            data: { tools },
            count: tools.length,
            source: 'notion-direct',
            attempt
          });
        } catch (error) {
          lastError = error as Error;
          console.error(`获取工具数据失败 (第${attempt}次尝试):`, error);
          
          if (attempt < maxRetries) {
            // 等待一段时间后重试，逐渐增加等待时间
            const waitTime = attempt * 1000;
            console.log(`等待${waitTime}ms后重试...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }
      
      // 所有重试都失败了，返回错误
      throw lastError || new Error('Failed to fetch tools after multiple attempts');
    }

    if (category) {
      // 按分类获取工具
      const tools = await DataSyncService.getToolsByCategory(category);
      return NextResponse.json({
        success: true,
        data: { tools },
        count: tools.length
      });
    }

    if (search) {
      // 搜索工具
      const tools = await DataSyncService.searchTools(search);
      return NextResponse.json({
        success: true,
        data: { tools },
        count: tools.length,
        query: search
      });
    }

    // 获取所有工具
    const tools = await DataSyncService.getTools();
    return NextResponse.json({
      success: true,
      data: { tools },
      count: tools.length
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tools',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'refresh':
        const data = await DataSyncService.forceRefresh();
        return NextResponse.json({
          success: true,
          data,
          message: 'Data refreshed successfully'
        });

      case 'clear-cache':
        DataSyncService.clearCache();
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully'
        });

      case 'cache-info':
        const cacheInfo = DataSyncService.getCacheInfo();
        return NextResponse.json({
          success: true,
          data: cacheInfo
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action'
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
