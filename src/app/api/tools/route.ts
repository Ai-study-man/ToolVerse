import { NextResponse } from 'next/server';
import DataSyncService from '../../../lib/dataSyncService';

export async function GET() {
  try {
    const tools = await DataSyncService.getTools();
    return NextResponse.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
