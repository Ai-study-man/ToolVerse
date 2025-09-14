/**
 * Tools Page - 主要的工具列表展示页面
 * 
 * 功能特点：
 * 1. ✅ 从 Supabase tools 表拉取最新工具数据（按 created_at 降序）
 * 2. ✅ 保留原有的工具渲染逻辑和 UI 样式
 * 3. ✅ 实现搜索和分类筛选功能
 * 4. ✅ 响应式设计和加载状态处理
 * 5. ✅ SSR + CSR 兼容性
 * 6. ✅ 空状态友好提示
 * 7. ✅ 实时数据更新，无静态数据依赖
 * 8. ✅ 按分类分组展示，优化用户体验
 */

'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTools } from '@/hooks/useTools';
import { Tool } from '@/types/tool';
import { getCategoryIcon, getCategoryDisplayName } from '@/utils/categoryIcons';
import ToolLogo from '@/components/ToolLogo';
import Header from '@/components/Header';

interface ToolCardProps {
  tool: Tool;
}

function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tool/${tool.id}`} className="block group h-full">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:transform group-hover:-translate-y-1 group-hover:shadow-xl h-full flex flex-col">
        {/* Tool logo and basic info */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <ToolLogo 
              name={tool.name}
              logo={tool.logo || undefined}
              size="md"
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white group-hover:text-accent-300 transition-colors mb-1 line-clamp-1">
                {tool.name}
              </h3>
              <p className="text-sm text-white/70 line-clamp-2 flex-1">
                {tool.description || 'No description available'}
              </p>
            </div>
          </div>
          
          {/* Tags and category */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tool.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-500/20 text-secondary-200 border border-secondary-400/30">
                {getCategoryIcon(tool.category)} {tool.category}
              </span>
            )}
            {tool.pricing && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-200 border border-green-400/30">
                {tool.pricing}
              </span>
            )}
          </div>
          
          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tool.tags.slice(0, 3).map((tag: string, index: number) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/5 text-white/60 border border-white/10">
                  #{tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/5 text-white/60 border border-white/10">
                  +{tool.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Bottom action area */}
        <div className="px-6 pb-6 pt-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">
              Click to view details
            </span>
            <div className="flex items-center text-accent-400 group-hover:text-accent-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function LoadingCard() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 h-64">
      <div className="animate-pulse">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-3 bg-white/10 rounded"></div>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-white/10 rounded-full"></div>
          <div className="h-6 w-12 bg-white/10 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded"></div>
          <div className="h-3 bg-white/10 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

// 内部组件处理搜索参数
function ToolsPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // 从 URL 参数中获取初始值
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // 获取所有工具数据（用于分类统计）
  const { data: allTools, loading: allLoading, error: allError } = useTools();

  // 获取筛选后的工具数据
  const { data: filteredTools, loading: filteredLoading, error: filteredError } = useTools({
    category: selectedCategory || undefined,
    q: searchQuery || undefined,
  });

  // 合并加载状态和错误状态
  const loading = allLoading || filteredLoading;
  const error = allError || filteredError;

  // 计算分类列表
  const categories = useMemo(() => {
    if (!allTools) return [];
    
    const categoryCount: { [key: string]: number } = {};
    allTools.forEach((tool) => {
      if (tool.category) {
        categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1;
      }
    });
    
    return Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count
    }));
  }, [allTools]);

  // 获取显示的工具
  const displayedTools = filteredTools || [];

  // 按分类分组工具
  const groupedTools = useMemo(() => {
    if (!displayedTools.length) return {};
    
    const groups: Record<string, Tool[]> = {};
    displayedTools.forEach(tool => {
      const category = tool.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(tool);
    });
    
    // 按每个分组的工具数量排序
    const sortedGroups: Record<string, Tool[]> = {};
    Object.entries(groups)
      .sort(([, a], [, b]) => b.length - a.length)
      .forEach(([category, tools]) => {
        sortedGroups[category] = tools;
      });
    
    return sortedGroups;
  }, [displayedTools]);

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(''); // 清除分类筛选
  };

  // 处理分类筛选
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setSearchQuery(''); // 清除搜索
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Title and Statistics */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {searchQuery ? `Search Results: ${searchQuery}` : 
             selectedCategory ? `${getCategoryIcon(selectedCategory)} ${selectedCategory} Tools` : 
             'Browse AI Tools'}
          </h1>
          <p className="text-xl text-white/80">
            {loading ? 'Loading tools...' : 
             `Found ${displayedTools.length}${selectedCategory ? ` ${selectedCategory}` : ''} tools`}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8">
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for AI tools..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-white font-medium mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryFilter('')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    !selectedCategory 
                      ? 'bg-accent-600 text-white border-accent-600' 
                      : 'bg-white/5 text-white/80 border-white/20 hover:bg-white/10'
                  }`}
                >
                  All Tools ({allTools?.length || 0})
                </button>
                {categories.map((category) => {
                  const icon = getCategoryIcon(category.name);
                  return (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryFilter(category.name)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        selectedCategory === category.name 
                          ? 'bg-accent-600 text-white border-accent-600' 
                          : 'bg-white/5 text-white/80 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {icon} {category.name} ({category.count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-200">Failed to load tools: {error}</p>
            </div>
          </div>
        )}

        {/* Tools Category Display */}
        {loading || filteredLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : displayedTools.length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedTools).map(([category, tools]) => {
              const icon = getCategoryIcon(category);
              return (
                <div key={category} className="space-y-6">
                  {/* Category Title */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="text-3xl">{icon}</span>
                      <span>{category}</span>
                      <span className="text-lg font-normal text-white/60">
                        ({tools.length})
                      </span>
                    </h2>
                    {!selectedCategory && (
                      <Link
                        href={`/category/${encodeURIComponent(category)}`}
                        className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
                      >
                        View All →
                      </Link>
                    )}
                  </div>
                  
                  {/* Tools Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-white/20">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Tools Found</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              {searchQuery ? `No tools found matching "${searchQuery}"` : 
               selectedCategory ? `No tools available in ${selectedCategory} category` : 
               'No tools available at the moment'}
            </p>
            <div className="space-x-4">
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="inline-block bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors font-medium"
                >
                  View All Tools
                </button>
              )}
              <Link 
                href="/"
                className="inline-block bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/20"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 主导出组件，包装 Suspense
export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading tools...</p>
          </div>
        </div>
      </div>
    }>
      <ToolsPageContent />
    </Suspense>
  );
}
