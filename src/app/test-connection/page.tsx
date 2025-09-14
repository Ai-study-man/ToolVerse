'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestConnection() {
  const [result, setResult] = useState<string>('测试中...');
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('🔍 开始测试前端 Supabase 连接...');
        
        // 测试简单查询
        const { data, error, count } = await supabase
          .from('tools')
          .select('*', { count: 'exact' })
          .limit(5);

        console.log('查询结果:', { data, error, count });

        if (error) {
          setResult(`❌ 错误: ${error.message}`);
          console.error('Supabase 错误:', error);
        } else {
          setResult(`✅ 成功连接！找到 ${count} 个工具，获取了 ${data?.length || 0} 个`);
          setTools(data || []);
        }
      } catch (err) {
        console.error('连接测试失败:', err);
        setResult(`❌ 连接失败: ${err}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">🧪 前端 Supabase 连接测试</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">连接状态</h2>
            <p className="text-lg">{result}</p>
          </div>

          {tools.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">获取的工具数据</h2>
              <div className="space-y-4">
                {tools.map((tool, index) => (
                  <div key={tool.id} className="border rounded-lg p-4">
                    <h3 className="font-medium">{tool.name}</h3>
                    <p className="text-sm text-gray-600">{tool.category}</p>
                    <p className="text-sm text-gray-500">{tool.pricing}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-medium mb-2">环境变量检查</h3>
            <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已设置' : '❌ 未设置'}</p>
            <p>ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已设置' : '❌ 未设置'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
