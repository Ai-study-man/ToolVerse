import { NextResponse } from 'next/server';
import DataSyncService from '../../../lib/dataSyncService';

export async function GET() {
  try {
    console.log('🔍 [API] /api/tools called');
    console.log('🔑 Environment check:', {
      hasNotionToken: !!process.env.NOTION_API_TOKEN,
      hasNotionDB: !!process.env.NOTION_TOOLS_DATABASE_ID,
      tokenPrefix: process.env.NOTION_API_TOKEN?.substring(0, 10) + '...',
      dbId: process.env.NOTION_TOOLS_DATABASE_ID?.substring(0, 10) + '...'
    });
    
    const tools = await DataSyncService.getTools();
    
    console.log('✅ [API] Tools fetched successfully:', {
      count: tools.length,
      hasLogos: tools.filter(t => t.logo).length,
      categories: Array.from(new Set(tools.map(t => t.category))).length
    });
    
    return NextResponse.json(tools);
  } catch (error) {
    console.error('❌ [API] Error fetching tools:', error);
    console.error('📋 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasNotionToken: !!process.env.NOTION_API_TOKEN,
        hasNotionDB: !!process.env.NOTION_TOOLS_DATABASE_ID
      }
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch tools',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
