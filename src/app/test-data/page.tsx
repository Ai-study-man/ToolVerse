'use client';

import { useTools } from '@/hooks/useTools';
import ToolCard from '@/components/ToolCard';

export default function TestData() {
  const { data: tools, loading, error, refresh } = useTools({ limit: 12 });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">正在加载数据...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-red-600 text-xl">❌</div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">数据加载失败</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <button
                  onClick={refresh}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  重试
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🧪 AI工具展示测试页面
              </h1>
              <p className="text-gray-600">
                使用新的 useTools Hook 和统一的 ToolCard 组件展示数据
              </p>
            </div>
            <button
              onClick={refresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              刷新数据
            </button>
          </div>
        </div>

        {/* 工具网格 */}
        {tools && tools.length > 0 ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                📊 AI工具展示 ({tools.length} 个工具)
              </h2>
              <p className="text-gray-600">
                所有卡片大小一致，点击可查看详情页面
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无工具数据</h3>
            <p className="text-gray-600 mb-6">请先导入一些AI工具数据</p>
            <button
              onClick={refresh}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              重新加载
            </button>
          </div>
        )}

        {/* 测试结果 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
          <div className="flex items-center">
            <div className="text-green-600 text-xl">✅</div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">测试成功</h3>
              <p className="text-green-600 mt-1">
                新的 useTools Hook 和 ToolCard 组件工作正常！
                {tools && ` 成功加载了 ${tools.length} 个工具。`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
