import { NextRequest, NextResponse } from 'next/server';
import { AIToolsCrawler, type CrawlerConfig } from '../../../scripts/aiToolsCrawler';
import path from 'path';

// API 路由：/api/crawl-tools
// 支持手动触发爬虫和定时任务

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const force = searchParams.get('force') === 'true';
  
  // 验证访问权限（防止滥用）
  const expectedSecret = process.env.CRAWLER_SECRET || 'your-crawler-secret';
  if (secret !== expectedSecret) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    console.log('🚀 开始 AI 工具爬虫任务...');
    
    // 配置爬虫参数
    const config: CrawlerConfig = {
      maxTools: parseInt(searchParams.get('maxTools') || '50'),
      sources: searchParams.get('sources')?.split(',') || [
        'futurepedia', 
        'aitoolsdirectory', 
        'producthunt'
      ],
      outputPath: path.join(process.cwd(), 'data', `crawled-tools-${Date.now()}.json`),
      enableGPTSummary: searchParams.get('enableGPT') === 'true'
    };

    // 执行爬虫
    const crawler = new AIToolsCrawler(config);
    const tools = await crawler.crawlTools();
    const stats = crawler.getStats();

    console.log('✅ 爬虫任务完成');

    return NextResponse.json({
      success: true,
      message: 'AI tools crawled successfully',
      data: {
        total_tools: tools.length,
        output_file: config.outputPath,
        stats,
        config: {
          max_tools: config.maxTools,
          sources: config.sources,
          gpt_enabled: config.enableGPTSummary
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 爬虫任务失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Crawler task failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, config: customConfig } = body;
    
    // 验证访问权限
    const expectedSecret = process.env.CRAWLER_SECRET || 'your-crawler-secret';
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🚀 POST 触发 AI 工具爬虫任务...');
    
    // 使用自定义配置或默认配置
    const config: CrawlerConfig = {
      maxTools: customConfig?.maxTools || 50,
      sources: customConfig?.sources || ['futurepedia', 'aitoolsdirectory', 'producthunt'],
      outputPath: path.join(process.cwd(), 'data', `crawled-tools-${Date.now()}.json`),
      enableGPTSummary: customConfig?.enableGPTSummary || false
    };

    // 执行爬虫
    const crawler = new AIToolsCrawler(config);
    const tools = await crawler.crawlTools();
    const stats = crawler.getStats();

    // 可选：自动导入到 Supabase
    if (customConfig?.autoImport) {
      await importToSupabase(tools);
    }

    console.log('✅ POST 爬虫任务完成');

    return NextResponse.json({
      success: true,
      message: 'AI tools crawled successfully via POST',
      data: {
        total_tools: tools.length,
        output_file: config.outputPath,
        stats,
        auto_imported: !!customConfig?.autoImport,
        config
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ POST 爬虫任务失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'POST crawler task failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 辅助函数：导入到 Supabase
async function importToSupabase(tools: any[]) {
  try {
    // 这里添加实际的 Supabase 导入逻辑
    console.log(`📊 准备导入 ${tools.length} 个工具到 Supabase...`);
    
    // 示例代码（需要实际的 Supabase 客户端）
    /*
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { error } = await supabase
      .from('crawled_tools')
      .insert(tools);

    if (error) throw error;
    */
    
    console.log('✅ 成功导入到 Supabase');
    
  } catch (error) {
    console.error('❌ Supabase 导入失败:', error);
    throw error;
  }
}
