/**
 * LatestToolsGrid - 最新 AI 工具展示组件
 * 
 * 核心功能：
 * 1. ✅ 从 Supabase tools 表直接拉取最新工具（按 created_at 降序）
 * 2. ✅ 支持主题切换（light/dark）适配不同页面
 * 3. ✅ 完整的加载状态和错误处理
 * 4. ✅ 响应式网格布局
 * 5. ✅ 空状态友好提示："No tools available yet 🚀"
 * 6. ✅ 实时数据刷新功能
 * 7. ✅ SSR + CSR 兼容
 * 8. ✅ 保持原有 UI 卡片样式
 * 
 * 数据流：Supabase → 组件状态 → UI 渲染
 * 新工具数据自动显示在前面（降序排列）
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { getCategoryIcon } from '@/utils/categoryIcons';
import ToolLogo from './ToolLogo';

// 类型定义
interface Tool {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  category?: string;
  pricing?: string;
  website?: string;
  created_at?: string;
}

interface LatestToolsGridProps {
  limit?: number;
  className?: string;
  showTitle?: boolean;
  columns?: 'auto' | 1 | 2 | 3 | 4 | 5 | 6;
  theme?: 'light' | 'dark';
  /** 
   * 可选的静态工具数据，将与 Supabase 数据合并
   * 新的 Supabase 数据会自动显示在前面
   */
  staticTools?: Tool[];
  /**
   * 是否优先显示 Supabase 数据
   * true: Supabase 数据在前，静态数据在后
   * false: 按创建时间混合排序
   */
  prioritizeNewData?: boolean;
}

// 骨架屏加载组件
function ToolCardSkeleton({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  
  return (
    <div className={`${isDark 
      ? 'bg-white/10 border-white/20' 
      : 'bg-white border-gray-200'
    } rounded-xl shadow-sm border p-6 animate-pulse`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 ${isDark ? 'bg-white/20' : 'bg-gray-200'} rounded-lg`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className={`h-4 ${isDark ? 'bg-white/20' : 'bg-gray-200'} rounded mb-2`}></div>
          <div className={`h-3 ${isDark ? 'bg-white/10' : 'bg-gray-100'} rounded mb-3`}></div>
          <div className={`h-3 ${isDark ? 'bg-white/10' : 'bg-gray-100'} rounded w-3/4`}></div>
          <div className="flex items-center mt-4 space-x-4">
            <div className={`h-6 w-16 ${isDark ? 'bg-white/10' : 'bg-gray-100'} rounded-full`}></div>
            <div className={`h-4 w-20 ${isDark ? 'bg-white/10' : 'bg-gray-100'} rounded`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 工具卡片组件
function ToolCard({ tool, theme = 'light' }: { tool: Tool; theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  
  const formatPricing = (pricing: string): { type: 'free' | 'freemium' | 'paid'; display: string } => {
    if (!pricing) return { type: 'freemium', display: 'Unknown' };
    
    const lowerPricing = pricing.toLowerCase();
    
    if (lowerPricing.includes('free') && !lowerPricing.includes('$') && !lowerPricing.includes('paid')) {
      return { type: 'free', display: 'Free' };
    } else if (lowerPricing.includes('free') || lowerPricing.includes('freemium')) {
      return { type: 'freemium', display: pricing };
    } else {
      return { type: 'paid', display: pricing };
    }
  };

  const pricingInfo = formatPricing(tool.pricing || '');

  return (
    <Link 
      href={`/tool/${tool.id}`}
      className={`${isDark 
        ? 'bg-white/10 border-white/20 hover:bg-white/15' 
        : 'bg-white border-gray-200 hover:shadow-md'
      } rounded-xl shadow-sm border p-6 transition-all duration-200 hover:scale-[1.02] block group`}
    >
      <div className="flex items-start space-x-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <ToolLogo 
            name={tool.name}
            logo={tool.logo || undefined}
            size="md"
          />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-600'} transition-colors mb-1 line-clamp-1`}>
            {tool.name}
          </h3>
          
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 line-clamp-2`}>
            {tool.description || 'No description provided'}
          </p>

          {/* 分类和定价 */}
          <div className="flex items-center justify-between mb-3">
            {tool.category && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isDark 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {getCategoryIcon(tool.category)} {tool.category}
              </span>
            )}
            
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              pricingInfo.type === 'free' 
                ? isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'
                : pricingInfo.type === 'freemium'
                ? isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                : isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800'
            }`}>
              {pricingInfo.display}
            </span>
          </div>

          {/* 底部链接 */}
          <div className={`flex items-center text-sm ${isDark ? 'text-blue-300 group-hover:text-blue-200' : 'text-blue-600 group-hover:text-blue-700'}`}>
            <span>View Details</span>
            <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// 空状态组件
function EmptyState({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
          />
        </svg>
      </div>
      <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>No tools available yet 🚀</h3>
      <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6 max-w-sm`}>
        We&apos;re working hard to bring you the best AI tools. Check back soon!
      </p>
      <Link 
        href="/submit"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Submit a Tool
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}

// 主组件
export default function LatestToolsGrid({ 
  limit = 12, 
  className = '', 
  showTitle = true,
  columns = 'auto',
  theme = 'light',
  staticTools = [],
  prioritizeNewData = true
}: LatestToolsGridProps) {
  const [supabaseTools, setSupabaseTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 合并 Supabase 数据和静态数据
  const tools = useMemo(() => {
    if (staticTools.length === 0) {
      // 只有 Supabase 数据
      return supabaseTools;
    }

    if (prioritizeNewData) {
      // Supabase 数据在前，静态数据在后
      const combinedTools = [...supabaseTools, ...staticTools];
      // 去重（以 website 或 name 为准）
      const uniqueTools = combinedTools.filter((tool, index, self) => 
        index === self.findIndex(t => t.website === tool.website || t.name === tool.name)
      );
      return uniqueTools.slice(0, limit);
    } else {
      // 按创建时间混合排序
      const combinedTools = [...supabaseTools, ...staticTools];
      // 去重并按创建时间排序
      const uniqueTools = combinedTools
        .filter((tool, index, self) => 
          index === self.findIndex(t => t.website === tool.website || t.name === tool.name)
        )
        .sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA; // 降序排序
        });
      return uniqueTools.slice(0, limit);
    }
  }, [supabaseTools, staticTools, prioritizeNewData, limit]);

  // 获取网格列数样式
  const getGridCols = () => {
    if (columns === 'auto') {
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
    return `grid-cols-${columns}`;
  };

  // 从 Supabase 获取最新工具
  const fetchLatestTools = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('tools')
        .select('id, name, description, logo, category, pricing, website, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (queryError) {
        throw new Error(`Failed to fetch tools: ${queryError.message}`);
      }

      setSupabaseTools(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching latest tools:', err);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchLatestTools();
  }, [limit]);

  // 刷新数据的方法
  const refreshData = () => {
    fetchLatestTools();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 标题和刷新按钮 */}
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Latest AI Tools
          </h2>
          <button
            onClick={refreshData}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            <svg 
              className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-800 font-medium">Failed to load tools</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="mt-3 inline-flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 工具网格 */}
      <div className={`grid ${getGridCols()} gap-6`}>
        {loading ? (
          // 加载状态骨架屏
          Array.from({ length: Math.min(limit, 8) }).map((_, index) => (
            <ToolCardSkeleton key={index} theme={theme} />
          ))
        ) : tools.length > 0 ? (
          // 工具列表
          tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} theme={theme} />
          ))
        ) : (
          // 空状态
          <EmptyState theme={theme} />
        )}
      </div>

      {/* 查看更多链接 */}
      {!loading && tools.length > 0 && tools.length >= limit && (
        <div className="text-center mt-8">
          <Link 
            href="/tools"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All Tools
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}