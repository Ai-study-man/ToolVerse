'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function DatabaseTestPage() {
  const [status, setStatus] = useState<string>('检测中...');
  const [details, setDetails] = useState<any[]>([]);
  const [testReview, setTestReview] = useState<any>(null);

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  const testDatabaseConnection = async () => {
    const tests: any[] = [];
    
    try {
      // 测试 1: 检查 Supabase 连接
      tests.push({ name: '1. Supabase 连接', status: 'testing', message: '检查连接...' });
      setDetails([...tests]);

      if (!supabase) {
        tests[0] = { name: '1. Supabase 连接', status: 'error', message: '❌ Supabase 未配置或环境变量缺失' };
        setDetails([...tests]);
        setStatus('连接失败 - 请检查环境变量');
        return;
      }

      tests[0] = { name: '1. Supabase 连接', status: 'success', message: '✅ Supabase 客户端创建成功' };
      setDetails([...tests]);

      // 测试 2: 检查 reviews 表是否存在
      tests.push({ name: '2. reviews 表', status: 'testing', message: '检查表结构...' });
      setDetails([...tests]);

      const { data: tableData, error: tableError } = await supabase
        .from('reviews')
        .select('*')
        .limit(0);

      if (tableError) {
        tests[1] = { name: '2. reviews 表', status: 'error', message: `❌ ${tableError.message}` };
        setDetails([...tests]);
        setStatus('表不存在 - 请先执行数据库迁移');
        return;
      }

      tests[1] = { name: '2. reviews 表', status: 'success', message: '✅ reviews 表存在且可访问' };
      setDetails([...tests]);

      // 测试 3: 检查 review_stats 视图
      tests.push({ name: '3. review_stats 视图', status: 'testing', message: '检查统计视图...' });
      setDetails([...tests]);

      const { data: statsData, error: statsError } = await supabase
        .from('review_stats')
        .select('*')
        .limit(1);

      if (statsError) {
        tests[2] = { name: '3. review_stats 视图', status: 'error', message: `❌ ${statsError.message}` };
      } else {
        tests[2] = { name: '3. review_stats 视图', status: 'success', message: '✅ 统计视图正常工作' };
      }
      setDetails([...tests]);

      // 测试 4: 读取现有数据
      tests.push({ name: '4. 数据读取', status: 'testing', message: '读取现有评论...' });
      setDetails([...tests]);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .limit(1);

      if (reviewsError) {
        tests[3] = { name: '4. 数据读取', status: 'error', message: `❌ ${reviewsError.message}` };
      } else {
        const count = reviewsData?.length || 0;
        tests[3] = { name: '4. 数据读取', status: 'success', message: `✅ 成功读取到 ${count} 条已审核评论` };
        if (count > 0) {
          setTestReview(reviewsData[0]);
        }
      }
      setDetails([...tests]);

      // 测试 5: 插入测试数据
      tests.push({ name: '5. 数据插入测试', status: 'testing', message: '测试插入功能...' });
      setDetails([...tests]);

      const testData = {
        tool_id: 'test-tool-' + Date.now(),
        user_nickname: '测试用户',
        user_email: 'test' + Date.now() + '@example.com',
        experience_rating: 4,
        functionality_rating: 5,
        value_rating: 4,
        comment: '这是一个数据库连接测试评论，可以安全删除。',
        use_case: '数据库测试',
        status: 'pending'
      };

      const { data: insertData, error: insertError } = await supabase
        .from('reviews')
        .insert(testData)
        .select()
        .single();

      if (insertError) {
        tests[4] = { name: '5. 数据插入测试', status: 'error', message: `❌ ${insertError.message}` };
      } else {
        tests[4] = { name: '5. 数据插入测试', status: 'success', message: '✅ 成功插入测试数据' };
        
        // 立即删除测试数据
        await supabase
          .from('reviews')
          .delete()
          .eq('id', insertData.id);
      }
      setDetails([...tests]);

      // 最终状态
      const allSuccess = tests.every(test => test.status === 'success');
      if (allSuccess) {
        setStatus('🎉 所有测试通过！数据库配置正确');
      } else {
        setStatus('⚠️ 部分测试失败，请查看详情');
      }

    } catch (error: any) {
      console.error('测试过程中发生错误:', error);
      setStatus('测试失败: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'testing': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            数据库连接测试
          </h1>
          
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">总体状态</h2>
            <p className="text-blue-800">{status}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">详细测试结果</h2>
            
            {details.map((test, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${getStatusBg(test.status)}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{test.name}</h3>
                  <div className={`${getStatusColor(test.status)} font-medium`}>
                    {test.status === 'testing' && (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                        测试中...
                      </div>
                    )}
                  </div>
                </div>
                <p className={`mt-2 ${getStatusColor(test.status)}`}>
                  {test.message}
                </p>
              </div>
            ))}
          </div>

          {testReview && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">示例评论数据</h3>
              <div className="text-sm text-gray-600">
                <p><strong>工具ID:</strong> {testReview.tool_id}</p>
                <p><strong>用户:</strong> {testReview.user_nickname}</p>
                <p><strong>评分:</strong> 
                  使用体验 {testReview.experience_rating}/5, 
                  功能匹配度 {testReview.functionality_rating}/5, 
                  性价比 {testReview.value_rating}/5
                </p>
                <p><strong>综合评分:</strong> {testReview.overall_rating}/5</p>
                <p><strong>评论:</strong> {testReview.comment}</p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">下一步操作</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>• 如果所有测试通过，你的评论系统已经可以使用了！</p>
              <p>• 你可以访问任何工具详情页面（例如：<a href="/tools" className="text-blue-600 hover:underline">/tools</a>）查看评论功能</p>
              <p>• 如果测试失败，请检查 SUPABASE_SETUP_GUIDE.md 中的配置步骤</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={testDatabaseConnection}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              重新测试
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
