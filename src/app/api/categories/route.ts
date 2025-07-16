import { NextResponse } from 'next/server';
import DataSyncService from '@/lib/dataSyncService';

export async function GET() {
  try {
    const categories = await DataSyncService.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
