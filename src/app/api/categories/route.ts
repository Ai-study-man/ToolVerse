import { NextResponse } from 'next/server';
import DataSyncService from '../../../lib/dataSyncService';

export async function GET() {
  try {
    const [categories, tools] = await Promise.all([
      DataSyncService.getCategories(),
      DataSyncService.getTools()
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        categories,
        totalToolCount: tools.length
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch categories' 
      },
      { status: 500 }
    );
  }
}
