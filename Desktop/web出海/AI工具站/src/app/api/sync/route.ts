import { NextRequest, NextResponse } from 'next/server';
import DataSyncService from '../../../lib/dataSyncService';

// 验证 Cron Secret（安全机制）
function validateCronSecret(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.warn('CRON_SECRET not configured');
    return false;
  }
  
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  // 验证请求来源
  if (!validateCronSecret(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    console.log('Starting scheduled data sync...');
    
    // 强制刷新数据
    const { tools, categories } = await DataSyncService.forceRefresh();
    
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      tools_count: tools.length,
      categories_count: categories.length,
      message: 'Data synchronized successfully'
    };
    
    console.log('Scheduled sync completed:', result);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Scheduled sync failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 手动触发同步（用于测试）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;
    
    // 简单的密钥验证
    if (secret !== process.env.MANUAL_SYNC_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }
    
    console.log('Manual sync triggered...');
    
    const { tools, categories } = await DataSyncService.forceRefresh();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tools_count: tools.length,
      categories_count: categories.length,
      message: 'Manual sync completed'
    });
    
  } catch (error) {
    console.error('Manual sync failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Manual sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
