import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: 获取特定工具的评论和统计信息
export async function GET(
  request: NextRequest,
  { params }: { params: { toolId: string } }
) {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        message: '数据库连接失败'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort') || 'use_case_first';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const toolId = params.toolId;

    // 构建排序条件
    let orderBy: string;
    switch (sortBy) {
      case 'newest':
        orderBy = 'created_at';
        break;
      case 'oldest':
        orderBy = 'created_at';
        break;
      case 'rating_desc':
        orderBy = 'overall_rating';
        break;
      case 'rating_asc':
        orderBy = 'overall_rating';
        break;
      case 'use_case_first':
      default:
        // 使用场景优先：先显示有使用场景的评论，再按时间排序
        orderBy = 'created_at';
        break;
    }

    // 获取已审核的评论
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('tool_id', toolId)
      .eq('status', 'approved')
      .range(offset, offset + limit - 1);

    // 应用排序
    if (sortBy === 'use_case_first') {
      // 使用场景优先排序：有use_case的排在前面，然后按创建时间倒序
      query = query.order('use_case', { nullsFirst: false }).order('created_at', { ascending: false });
    } else if (sortBy === 'oldest') {
      query = query.order(orderBy, { ascending: true });
    } else {
      query = query.order(orderBy, { ascending: false });
    }

    const { data: reviews, error: reviewsError } = await query;

    if (reviewsError) {
      console.error('Database error:', reviewsError);
      return NextResponse.json({
        success: false,
        message: '获取评论失败'
      }, { status: 500 });
    }

    // 获取统计信息
    const { data: stats, error: statsError } = await supabase
      .from('review_stats')
      .select('*')
      .eq('tool_id', toolId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') { // PGRST116 表示没有找到记录
      console.error('Database error:', statsError);
      return NextResponse.json({
        success: false,
        message: '获取统计信息失败'
      }, { status: 500 });
    }

    // 获取总评论数
    const { count: totalCount, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId)
      .eq('status', 'approved');

    if (countError) {
      console.error('Database error:', countError);
      return NextResponse.json({
        success: false,
        message: '获取评论总数失败'
      }, { status: 500 });
    }

    // 如果没有统计信息，创建默认值
    const defaultStats = {
      tool_id: toolId,
      total_reviews: 0,
      avg_experience_rating: 0,
      avg_functionality_rating: 0,
      avg_value_rating: 0,
      overall_avg_rating: 0
    };

    return NextResponse.json({
      success: true,
      data: {
        reviews: reviews || [],
        stats: stats || defaultStats,
        total: totalCount || 0
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      message: '服务器错误，请稍后重试'
    }, { status: 500 });
  }
}
