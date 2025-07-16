import { NextResponse } from 'next/server';
import DataSyncService from '@/lib/dataSyncService';

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
