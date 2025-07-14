import { NextRequest, NextResponse } from 'next/server';
import NotionToolsService from '../../../../lib/notionService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`获取工具详情: ${params.id}`);
    
    // 直接从Notion获取工具详情
    const tool = await NotionToolsService.getToolById(params.id);
    
    if (!tool) {
      console.log(`工具未找到: ${params.id}`);
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    console.log(`成功获取工具: ${tool.name}`);
    return NextResponse.json({
      success: true,
      data: { tool },
      source: 'notion-direct'
    });

  } catch (error: any) {
    console.error('获取工具详情错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch tool',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
