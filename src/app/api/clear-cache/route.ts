import { NextRequest, NextResponse } from 'next/server';
import DataSyncService from '../../../lib/dataSyncService';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 清除缓存请求');
    
    // 清除缓存
    DataSyncService.clearCache();
    
    // 强制重新获取数据
    const tools = await DataSyncService.getTools();
    const categories = await DataSyncService.getCategories();
    
    console.log(`✅ 缓存已清除，重新获取到 ${tools.length} 个工具和 ${categories.length} 个分类`);
    
    return NextResponse.json({
      success: true,
      message: '缓存已清除并重新获取数据',
      toolsCount: tools.length,
      categoriesCount: categories.length
    });
  } catch (error) {
    console.error('❌ 清除缓存失败:', error);
    return NextResponse.json(
      { success: false, error: '清除缓存失败' },
      { status: 500 }
    );
  }
}
