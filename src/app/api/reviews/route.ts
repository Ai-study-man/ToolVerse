import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST: 提交新评论
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        message: '数据库连接失败'
      }, { status: 500 });
    }

    const body = await request.json();
    
    const {
      tool_id,
      user_nickname,
      user_email,
      experience_rating,
      functionality_rating,
      value_rating,
      comment,
      use_case
    } = body;

    // 验证必填字段
    if (!tool_id || !user_nickname || !user_email || !comment) {
      return NextResponse.json({
        success: false,
        message: '缺少必填字段'
      }, { status: 400 });
    }

    // 验证评分范围
    if (experience_rating < 1 || experience_rating > 5 ||
        functionality_rating < 1 || functionality_rating > 5 ||
        value_rating < 1 || value_rating > 5) {
      return NextResponse.json({
        success: false,
        message: '评分必须在1-5之间'
      }, { status: 400 });
    }

    // 验证字符长度
    if (user_nickname.length > 20) {
      return NextResponse.json({
        success: false,
        message: '昵称不能超过20个字符'
      }, { status: 400 });
    }

    if (comment.length > 200) {
      return NextResponse.json({
        success: false,
        message: '评论内容不能超过200个字符'
      }, { status: 400 });
    }

    if (use_case && use_case.length > 100) {
      return NextResponse.json({
        success: false,
        message: '使用场景描述不能超过100个字符'
      }, { status: 400 });
    }

    // 检查是否已经评论过（可选：防止重复评论）
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('tool_id', tool_id)
      .eq('user_email', user_email)
      .single();

    if (existingReview) {
      return NextResponse.json({
        success: false,
        message: '您已经评论过这个工具了'
      }, { status: 409 });
    }

    // 计算综合评分
    const overall_rating = Math.round((experience_rating + functionality_rating + value_rating) / 3 * 10) / 10;

    // 插入评论到数据库
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        tool_id,
        user_nickname,
        user_email,
        experience_rating,
        functionality_rating,
        value_rating,
        comment,
        use_case: use_case || null,
        overall_rating,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        success: false,
        message: '数据库错误，请稍后重试'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '评论提交成功',
      review
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      message: '服务器错误，请稍后重试'
    }, { status: 500 });
  }
}
