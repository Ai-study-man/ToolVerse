import { NextResponse } from 'next/server';
import DataSyncService from '@/lib/dataSyncService';
import { NotionToolsService } from '@/lib/notionService';

interface Params {
  id: string;
}

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const tool = await DataSyncService.getToolById(params.id);
    
    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tool);
  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  try {
    console.log(`删除工具请求: ID ${params.id}`);
    
    const result = await NotionToolsService.deleteTool(params.id);
    
    if (result) {
      console.log(`✅ 成功删除工具 ID: ${params.id}`);
      return NextResponse.json({ 
        success: true, 
        message: `Tool ${params.id} deleted successfully` 
      });
    } else {
      console.log(`❌ 删除工具失败 ID: ${params.id}`);
      return NextResponse.json(
        { error: 'Failed to delete tool' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting tool:', error);
    return NextResponse.json(
      { error: 'Failed to delete tool', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
