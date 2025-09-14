'use client';

import { useState, useEffect } from 'react';
import { supabase, supabaseConfig } from '@/lib/supabaseClient';
import { useTools } from '@/hooks/useTools';

export default function DebugPage() {
  const [testResults, setTestResults] = useState<any>({});
  const { data: tools, loading, error } = useTools({ limit: 5 });

  const runTests = async () => {
    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
        supabaseKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      },
      supabaseConfig,
      client: typeof window !== 'undefined' ? 'client' : 'server'
    };

    // 测试直接的 Supabase 连接
    try {
      console.log('[Debug] 测试 Supabase 连接...');
      const { data, error, count } = await supabase
        .from('tools')
        .select('*', { count: 'exact' })
        .limit(1);
      
      results.directQuery = {
        success: !error,
        error: error?.message || null,
        dataCount: count,
        sampleData: data?.[0] || null
      };
    } catch (err) {
      results.directQuery = {
        success: false,
        error: err instanceof Error ? err.message : String(err),
        dataCount: 0,
        sampleData: null
      };
    }

    setTestResults(results);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Debug Information</h1>
        
        {/* 环境变量状态 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${testResults.environment?.hasSupabaseUrl ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className="text-white">NEXT_PUBLIC_SUPABASE_URL: {testResults.environment?.hasSupabaseUrl ? '✓ Present' : '✗ Missing'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${testResults.environment?.hasSupabaseKey ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className="text-white">NEXT_PUBLIC_SUPABASE_ANON_KEY: {testResults.environment?.hasSupabaseKey ? '✓ Present' : '✗ Missing'}</span>
            </div>
            {testResults.environment?.supabaseUrlPrefix && (
              <div className="text-white/70">URL Preview: {testResults.environment.supabaseUrlPrefix}</div>
            )}
          </div>
        </div>

        {/* Supabase 配置状态 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Supabase Configuration</h2>
          <div className="text-sm text-white space-y-2">
            <div>Is Configured: {testResults.supabaseConfig?.isConfigured ? '✓ Yes' : '✗ No'}</div>
            <div>Has Valid Key: {testResults.supabaseConfig?.hasValidKey ? '✓ Yes' : '✗ No'}</div>
            <div>URL: {testResults.supabaseConfig?.url || 'Not available'}</div>
          </div>
        </div>

        {/* 直接查询测试 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Direct Supabase Query Test</h2>
          <div className="text-sm text-white space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${testResults.directQuery?.success ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span>Query Success: {testResults.directQuery?.success ? '✓ Yes' : '✗ No'}</span>
            </div>
            <div>Total Tools Count: {testResults.directQuery?.dataCount ?? 'Unknown'}</div>
            {testResults.directQuery?.error && (
              <div className="text-red-300">Error: {testResults.directQuery.error}</div>
            )}
            {testResults.directQuery?.sampleData && (
              <div className="text-green-300">Sample Tool: {testResults.directQuery.sampleData.name}</div>
            )}
          </div>
        </div>

        {/* useTools Hook 测试 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">useTools Hook Test</h2>
          <div className="text-sm text-white space-y-2">
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
            <div>Error: {error || 'None'}</div>
            <div>Tools Count: {tools?.length || 0}</div>
            {tools && tools.length > 0 && (
              <div className="text-green-300">First Tool: {tools[0].name}</div>
            )}
          </div>
        </div>

        {/* 原始测试结果 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Raw Test Results</h2>
          <pre className="text-xs text-white/70 overflow-auto max-h-96">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>

        <div className="mt-6">
          <button 
            onClick={runTests}
            className="bg-accent-600 text-white px-6 py-2 rounded-lg hover:bg-accent-700 transition-colors"
          >
            重新运行测试
          </button>
        </div>
      </div>
    </div>
  );
}