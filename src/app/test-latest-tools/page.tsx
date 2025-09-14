'use client';

import Header from '@/components/Header';
import LatestToolsGrid from '@/components/LatestToolsGrid';

export default function TestLatestToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Latest AI Tools from Supabase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the newest AI tools added to our database, pulled directly from Supabase 
            with real-time data and responsive design.
          </p>
        </div>

        {/* 不同配置的示例 */}
        <div className="space-y-16">
          
          {/* 默认配置 - 显示最新12个工具 */}
          <section>
            <LatestToolsGrid />
          </section>

          {/* 限制6个工具，3列布局 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Tools (6 items, 3 columns)</h2>
            <LatestToolsGrid 
              limit={6} 
              columns={3}
              showTitle={false}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            />
          </section>

          {/* 紧凑型布局 - 显示8个工具 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Compact Layout (8 items)</h2>
            <LatestToolsGrid 
              limit={8}
              showTitle={false}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8"
            />
          </section>

          {/* 超大型布局 - 显示20个工具 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Extended Grid (20 items)</h2>
            <LatestToolsGrid 
              limit={20}
              showTitle={false}
            />
          </section>
        </div>

        {/* 使用说明 */}
        <div className="mt-16 bg-blue-50 rounded-xl p-8 border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">
            🎯 LatestToolsGrid 组件特性
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-blue-800">
            <div>
              <h4 className="font-medium mb-2">✅ 已实现功能</h4>
              <ul className="text-sm space-y-1">
                <li>• 从 Supabase 实时拉取最新工具</li>
                <li>• 响应式网格布局 (1-4列自适应)</li>
                <li>• 骨架屏加载状态</li>
                <li>• 空状态处理</li>
                <li>• 错误状态和重试功能</li>
                <li>• 智能定价标签分类</li>
                <li>• Logo 自动降级到首字母头像</li>
                <li>• 悬停效果和过渡动画</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔧 配置选项</h4>
              <ul className="text-sm space-y-1">
                <li>• <code>limit</code>: 限制显示数量</li>
                <li>• <code>columns</code>: 网格列数 (1-6 或 auto)</li>
                <li>• <code>showTitle</code>: 是否显示标题</li>
                <li>• <code>className</code>: 自定义样式类</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">使用示例:</h4>
            <pre className="text-sm text-blue-800 bg-blue-50 p-3 rounded overflow-x-auto">
{`<LatestToolsGrid 
  limit={12}
  columns="auto"
  showTitle={true}
  className="custom-class"
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}