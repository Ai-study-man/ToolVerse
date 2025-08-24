import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: 实现webhook处理逻辑
    const body = await request.json();
    
    // 返回成功响应
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is active',
    methods: ['POST']
  });
}