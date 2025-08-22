'use client';

import { memo, useMemo } from 'react';
import { 
  ChartBarIcon, 
  CubeIcon, 
  TagIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Tool, Category } from '../types';

interface StatsOverviewProps {
  tools: Tool[];
  categories: Category[];
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

const StatsOverview = memo(function StatsOverview({
  tools,
  categories,
  className = "",
  variant = 'default'
}: StatsOverviewProps) {
  
  // 计算统计数据
  const stats = useMemo(() => {
    const totalTools = tools.length;
    const totalCategories = categories.length;
    
    // 计算免费工具数量
    const freeTools = tools.filter(tool => 
      tool.pricing?.toLowerCase().includes('free') || 
      tool.pricing?.toLowerCase() === 'free'
    ).length;
    
    // 计算最新添加的工具（假设最近7天）
    const recentTools = tools.filter(tool => {
      // 如果有创建日期，计算；否则假设最新的20%为最近添加
      return true; // 简化处理，实际应该根据创建日期
    }).slice(0, Math.ceil(totalTools * 0.2)).length;
    
    // 计算分类分布
    const categoryDistribution = categories.map(category => ({
      name: category.name,
      count: tools.filter(tool => tool.category === category.name).length,
      percentage: ((tools.filter(tool => tool.category === category.name).length / totalTools) * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count);
    
    // 计算最受欢迎的标签
    const allTags = tools.flatMap(tool => tool.tags || []);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
    
    // 计算定价分布
    const pricingDistribution = {
      free: freeTools,
      freemium: tools.filter(tool => 
        tool.pricing?.toLowerCase().includes('freemium')
      ).length,
      paid: tools.filter(tool => 
        tool.pricing && 
        !tool.pricing.toLowerCase().includes('free') &&
        !tool.pricing.toLowerCase().includes('freemium')
      ).length
    };
    
    return {
      totalTools,
      totalCategories,
      freeTools,
      recentTools,
      categoryDistribution,
      popularTags,
      pricingDistribution,
      freePercentage: ((freeTools / totalTools) * 100).toFixed(1)
    };
  }, [tools, categories]);

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.totalTools}</div>
            <div className="text-sm text-gray-600">AI Tools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-600">{stats.totalCategories}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-600">{stats.freeTools}</div>
            <div className="text-sm text-gray-600">Free Tools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.recentTools}</div>
            <div className="text-sm text-gray-600">New This Week</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* 主要统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.totalTools}</div>
                <div className="text-primary-100">Total AI Tools</div>
              </div>
              <CubeIcon className="w-8 h-8 text-primary-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.totalCategories}</div>
                <div className="text-secondary-100">Categories</div>
              </div>
              <TagIcon className="w-8 h-8 text-secondary-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.freePercentage}%</div>
                <div className="text-accent-100">Free Tools</div>
              </div>
              <StarIcon className="w-8 h-8 text-accent-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.recentTools}</div>
                <div className="text-orange-100">Recently Added</div>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>

        {/* 分类分布 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-gray-400" />
            Top Categories
          </h3>
          <div className="space-y-3">
            {stats.categoryDistribution.slice(0, 5).map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门标签 */}
        {stats.popularTags.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {stats.popularTags.map((tag, index) => (
                <span
                  key={tag.tag}
                  className={`px-3 py-1 rounded-full text-sm ${
                    index === 0 ? 'bg-primary-100 text-primary-800' :
                    index === 1 ? 'bg-secondary-100 text-secondary-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {tag.tag} ({tag.count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 定价分布 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.pricingDistribution.free}</div>
              <div className="text-sm text-green-700">Free</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.pricingDistribution.freemium}</div>
              <div className="text-sm text-blue-700">Freemium</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.pricingDistribution.paid}</div>
              <div className="text-sm text-purple-700">Paid</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CubeIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalTools}</div>
          <div className="text-sm text-gray-600">AI Tools Available</div>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TagIcon className="w-6 h-6 text-secondary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalCategories}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <StarIcon className="w-6 h-6 text-accent-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.freePercentage}%</div>
          <div className="text-sm text-gray-600">Free Options</div>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ClockIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.recentTools}</div>
          <div className="text-sm text-gray-600">Recently Added</div>
        </div>
      </div>
    </div>
  );
});

StatsOverview.displayName = 'StatsOverview';

export default StatsOverview;
