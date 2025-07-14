'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import AdvancedSearch from '../../components/AdvancedSearch';
import ToolCard from '../../components/ToolCard';
import DataSyncService from '../../lib/dataSyncService';
import { Tool, Category } from '../../types';

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // 初始化数据
  useEffect(() => {
    setIsClient(true);
    
    const fetchData = async () => {
      try {
        const [toolsData, categoriesData] = await Promise.all([
          DataSyncService.getTools(),
          DataSyncService.getCategories()
        ]);
        
        setTools(toolsData);
        setCategories(categoriesData);
        setFilteredTools(toolsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // 降级处理：使用空数组
        setTools([]);
        setCategories([]);
        setFilteredTools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理搜索结果更新
  const handleSearchResults = (results: Tool[]) => {
    setFilteredTools(results);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>
            <div className="bg-white rounded-xl p-6 mb-8">
              <div className="h-12 bg-gray-300 rounded mb-4"></div>
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-300 rounded w-24"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI 工具大全
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            探索和发现 {tools.length}+ 个精选 AI 工具，涵盖各种应用场景和需求
          </p>
        </div>

        {/* 高级搜索组件 */}
        <AdvancedSearch
          tools={tools}
          categories={categories}
          onSearchResults={handleSearchResults}
          className="mb-8"
        />

        {/* 工具展示区域 */}
        <div className="space-y-6">
          {loading ? (
            // 加载状态
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-6 bg-gray-300 rounded w-14"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredTools.length > 0 ? (
            // 工具网格
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            // 无结果状态
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                未找到匹配的工具
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                尝试调整搜索条件或过滤器，或者浏览所有可用的 AI 工具。
              </p>
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  建议：
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 尝试更通用的关键词</li>
                  <li>• 检查拼写是否正确</li>
                  <li>• 移除一些过滤条件</li>
                  <li>• 浏览不同的分类</li>
                </ul>
              </div>
            </div>
          )}

          {/* 加载更多按钮（未来功能） */}
          {!loading && filteredTools.length > 0 && filteredTools.length >= 20 && (
            <div className="text-center pt-8">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                加载更多工具
              </button>
            </div>
          )}
        </div>

        {/* 统计信息 */}
        {!loading && (
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              浏览统计
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  {tools.length}
                </div>
                <div className="text-sm text-gray-600">总工具数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary-600">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-600">工具分类</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-600">
                  {filteredTools.length}
                </div>
                <div className="text-sm text-gray-600">搜索结果</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {tools.filter(t => t.pricingModel === 'free').length}
                </div>
                <div className="text-sm text-gray-600">免费工具</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
