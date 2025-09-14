'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTools } from '@/hooks/useTools';
import { selectFeaturedTools, getFeaturedToolsConfig } from '@/utils/featuredTools';
import ToolLogo from './ToolLogo';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { Tool } from '@/types/tool';

interface FeaturedToolsGridProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export default function FeaturedToolsGrid({ className = '', theme = 'dark' }: FeaturedToolsGridProps) {
  const { data: allTools, loading, error } = useTools();
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const config = getFeaturedToolsConfig();

  useEffect(() => {
    if (allTools && allTools.length > 0) {
      const selected = selectFeaturedTools(allTools, config.count);
      setFeaturedTools(selected);
      console.log('[FeaturedToolsGrid] 选择了特色工具:', selected.map(t => ({
        name: t.name,
        category: t.category,
        score: 'calculated'
      })));
    }
  }, [allTools, config.count]);

  // 获取定价标签样式
  const getPricingBadgeStyle = (pricing: string) => {
    const lowerPricing = pricing.toLowerCase();
    if (lowerPricing.includes('free')) {
      return theme === 'dark' 
        ? 'bg-green-500/20 text-green-200 border-green-400/30'
        : 'bg-green-100 text-green-800 border-green-300';
    } else if (lowerPricing.includes('paid')) {
      return theme === 'dark'
        ? 'bg-blue-500/20 text-blue-200 border-blue-400/30'
        : 'bg-blue-100 text-blue-800 border-blue-300';
    } else if (lowerPricing.includes('freemium')) {
      return theme === 'dark'
        ? 'bg-purple-500/20 text-purple-200 border-purple-400/30'
        : 'bg-purple-100 text-purple-800 border-purple-300';
    }
    return theme === 'dark'
      ? 'bg-gray-500/20 text-gray-200 border-gray-400/30'
      : 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // 主题样式
  const themeStyles = {
    card: theme === 'dark' 
      ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:border-white/40 text-white'
      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-white/70' : 'text-gray-600',
    textMuted: theme === 'dark' ? 'text-white/50' : 'text-gray-500'
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: config.count }).map((_, index) => (
            <div key={index} className={`${themeStyles.card} rounded-xl border p-6 animate-pulse`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-300/50 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300/50 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300/50 rounded w-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300/50 rounded w-full"></div>
                <div className="h-3 bg-gray-300/50 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} text-center py-12`}>
        <div className={`${themeStyles.textSecondary} mb-4`}>
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Failed to load featured tools
        </div>
        <p className={themeStyles.textMuted}>Please try refreshing the page</p>
      </div>
    );
  }

  if (featuredTools.length === 0) {
    return (
      <div className={`${className} text-center py-12`}>
        <div className={`${themeStyles.textSecondary} mb-4`}>
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          No featured tools available yet
        </div>
        <p className={themeStyles.textMuted}>Featured tools will appear here once they're added to the database</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 工具网格 - 2行4列布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredTools.map((tool) => (
          <Link 
            key={tool.id} 
            href={`/tools/${tool.id}`} 
            className="block group h-full"
          >
            <div className={`${themeStyles.card} rounded-xl border transition-all duration-300 group-hover:transform group-hover:-translate-y-1 group-hover:shadow-xl h-full flex flex-col p-6`}>
              {/* 工具头部信息 */}
              <div className="flex items-start gap-4 mb-4">
                <ToolLogo 
                  name={tool.name}
                  logo={tool.logo || undefined}
                  size="md"
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${themeStyles.text} group-hover:text-accent-300 transition-colors mb-1 line-clamp-1`}>
                    {tool.name}
                  </h3>
                  <p className={`text-sm ${themeStyles.textSecondary} line-clamp-2`}>
                    {tool.description || 'Powerful AI tool for enhanced productivity'}
                  </p>
                </div>
              </div>

              {/* 工具详情 */}
              <div className="flex-1 flex flex-col justify-between">
                {/* 分类和定价标签 */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {tool.category && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-secondary-500/20 text-secondary-200 border border-secondary-400/30' : 'bg-secondary-100 text-secondary-800 border border-secondary-300'}`}>
                      {getCategoryIcon(tool.category)} {tool.category}
                    </span>
                  )}
                  {tool.pricing && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPricingBadgeStyle(tool.pricing)}`}>
                      {tool.pricing}
                    </span>
                  )}
                </div>

                {/* 访问按钮 */}
                <div className="mt-auto">
                  <div className={`inline-flex items-center text-sm font-medium ${theme === 'dark' ? 'text-accent-300' : 'text-accent-600'} group-hover:text-accent-400 transition-colors`}>
                    View Details
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}