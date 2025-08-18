'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Tool, AdvancedFilters, FilterOption } from '../types';

interface AdvancedFilterComponentProps {
  tools: Tool[];
  onFiltersChange: (filteredTools: Tool[], activeFilters: AdvancedFilters) => void;
  categories: string[];
}

export default function AdvancedFilterComponent({ 
  tools, 
  onFiltersChange, 
  categories 
}: AdvancedFilterComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilters>({
    categories: [],
    pricingModels: [],
    commercialLicense: [],
    difficulty: [],
    rating: 0,
    tags: []
  });

  // 筛选选项配置
  const filterOptions = {
    pricingModels: [
      { id: 'free', label: 'Free', value: 'free', icon: '🆓' },
      { id: 'freemium', label: 'Freemium', value: 'freemium', icon: '💎' },
      { id: 'paid', label: 'Paid', value: 'paid', icon: '💰' }
    ],
    commercialLicense: [
      { id: 'supported', label: 'Commercial Use', value: 'supported', icon: '✅' },
      { id: 'not-supported', label: 'Personal Use Only', value: 'not-supported', icon: '❌' }
    ],
    difficulty: [
      { id: 'beginner', label: 'Beginner Friendly', value: 'beginner', icon: '🌱' },
      { id: 'intermediate', label: 'Intermediate', value: 'intermediate', icon: '📈' },
      { id: 'advanced', label: 'Advanced', value: 'advanced', icon: '🚀' }
    ]
  };

  // 计算匹配数量的函数
  const calculateCounts = (optionType: string, optionValue: string): number => {
    return tools.filter(tool => {
      switch (optionType) {
        case 'pricingModels':
          return tool.pricingModel === optionValue;
        case 'commercialLicense':
          const hasCommercialLicense = tool.commercialLicense ?? true; // 默认支持商用
          return optionValue === 'supported' ? hasCommercialLicense : !hasCommercialLicense;
        case 'difficulty':
          const difficulty = tool.difficulty ?? 'beginner'; // 默认新手友好
          return difficulty === optionValue;
        case 'categories':
          return tool.category === optionValue;
        default:
          return false;
      }
    }).length;
  };

  // 筛选逻辑函数
  const applyFilters = (currentFilters: AdvancedFilters): Tool[] => {
    return tools.filter(tool => {
      // 分类筛选
      if (currentFilters.categories.length > 0 && 
          !currentFilters.categories.includes(tool.category)) {
        return false;
      }

      // 价格模式筛选
      if (currentFilters.pricingModels.length > 0 && 
          !currentFilters.pricingModels.includes(tool.pricingModel)) {
        return false;
      }

      // 商用许可筛选
      if (currentFilters.commercialLicense.length > 0) {
        const hasCommercialLicense = tool.commercialLicense ?? true;
        const passesCommercialFilter = currentFilters.commercialLicense.some(filter => {
          return filter === 'supported' ? hasCommercialLicense : !hasCommercialLicense;
        });
        if (!passesCommercialFilter) return false;
      }

      // 难度筛选
      if (currentFilters.difficulty.length > 0) {
        const difficulty = tool.difficulty ?? 'beginner';
        if (!currentFilters.difficulty.includes(difficulty)) {
          return false;
        }
      }

      // 评分筛选
      if (currentFilters.rating > 0 && tool.rating < currentFilters.rating) {
        return false;
      }

      // 标签筛选
      if (currentFilters.tags.length > 0) {
        const hasMatchingTag = currentFilters.tags.some(tag => 
          tool.tags.some(toolTag => 
            toolTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  };

  // 更新筛选器
  const updateFilter = (filterType: keyof AdvancedFilters, value: string) => {
    const newFilters = { ...filters };
    const currentArray = newFilters[filterType] as string[];
    
    if (currentArray.includes(value)) {
      newFilters[filterType] = currentArray.filter(item => item !== value) as any;
    } else {
      newFilters[filterType] = [...currentArray, value] as any;
    }
    
    setFilters(newFilters);
    const filteredTools = applyFilters(newFilters);
    onFiltersChange(filteredTools, newFilters);
  };

  // 更新评分筛选
  const updateRatingFilter = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    const filteredTools = applyFilters(newFilters);
    onFiltersChange(filteredTools, newFilters);
  };

  // 清除所有筛选
  const clearAllFilters = () => {
    const newFilters: AdvancedFilters = {
      categories: [],
      pricingModels: [],
      commercialLicense: [],
      difficulty: [],
      rating: 0,
      tags: []
    };
    setFilters(newFilters);
    onFiltersChange(tools, newFilters);
  };

  // 计算活跃筛选数量
  const activeFilterCount = Object.values(filters).flat().length + (filters.rating > 0 ? 1 : 0);

  // 获取热门标签
  const getPopularTags = (): FilterOption[] => {
    const tagCounts: { [key: string]: number } = {};
    tools.forEach(tool => {
      tool.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 12)
      .map(([tag, count]) => ({
        id: tag.toLowerCase().replace(/\s+/g, '-'),
        label: tag,
        value: tag,
        count
      }));
  };

  const popularTags = getPopularTags();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* 筛选器头部 */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900">Advanced Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <ChevronDownIcon 
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {/* 快速清除按钮 */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="mt-2 text-sm text-primary-600 hover:text-primary-800 flex items-center space-x-1"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Clear all filters</span>
          </button>
        )}
      </div>

      {/* 筛选器内容 */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* 分类筛选 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => updateFilter('categories', category)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    filters.categories.includes(category)
                      ? 'bg-primary-100 border-primary-300 text-primary-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="block truncate">{category}</span>
                  <span className="text-xs opacity-70">
                    ({calculateCounts('categories', category)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 价格模式筛选 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Pricing Model</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.pricingModels.map(option => (
                <button
                  key={option.id}
                  onClick={() => updateFilter('pricingModels', option.value)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md border transition-colors ${
                    filters.pricingModels.includes(option.value)
                      ? 'bg-primary-100 border-primary-300 text-primary-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                  <span className="text-xs opacity-70">
                    ({calculateCounts('pricingModels', option.value)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 商用许可筛选 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Commercial License</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.commercialLicense.map(option => (
                <button
                  key={option.id}
                  onClick={() => updateFilter('commercialLicense', option.value)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md border transition-colors ${
                    filters.commercialLicense.includes(option.value)
                      ? 'bg-primary-100 border-primary-300 text-primary-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                  <span className="text-xs opacity-70">
                    ({calculateCounts('commercialLicense', option.value)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 难度等级筛选 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.difficulty.map(option => (
                <button
                  key={option.id}
                  onClick={() => updateFilter('difficulty', option.value)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md border transition-colors ${
                    filters.difficulty.includes(option.value)
                      ? 'bg-primary-100 border-primary-300 text-primary-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                  <span className="text-xs opacity-70">
                    ({calculateCounts('difficulty', option.value)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 评分筛选 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => updateRatingFilter(rating === filters.rating ? 0 : rating)}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                    filters.rating === rating
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>⭐</span>
                  <span>{rating}+</span>
                </button>
              ))}
            </div>
          </div>

          {/* 热门标签筛选 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => updateFilter('tags', tag.value)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md border transition-colors ${
                    filters.tags.includes(tag.value)
                      ? 'bg-secondary-100 border-secondary-300 text-secondary-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>#{tag.label}</span>
                  <span className="text-xs opacity-70">({tag.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
