'use client';

import { memo, useState, useEffect, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Tool, Category } from '../types';

interface AdvancedFiltersProps {
  tools: Tool[];
  categories: Category[];
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
  className?: string;
}

export interface FilterState {
  categories: string[];
  priceRanges: string[];
  features: string[];
  sortBy: string;
  searchQuery: string;
}

const PRICE_RANGES = [
  { label: 'Free', value: 'free' },
  { label: 'Freemium', value: 'freemium' },
  { label: 'Under $10/month', value: 'under-10' },
  { label: '$10-50/month', value: '10-50' },
  { label: 'Over $50/month', value: 'over-50' },
  { label: 'Enterprise', value: 'enterprise' }
];

const COMMON_FEATURES = [
  { label: 'API Access', value: 'api' },
  { label: 'Mobile App', value: 'mobile' },
  { label: 'Team Collaboration', value: 'collaboration' },
  { label: 'Integrations', value: 'integrations' },
  { label: 'White-label', value: 'white-label' },
  { label: 'Open Source', value: 'open-source' },
  { label: 'No-code', value: 'no-code' },
  { label: 'Real-time', value: 'real-time' }
];

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Recently Added', value: 'recent' },
  { label: 'Alphabetical A-Z', value: 'name-asc' },
  { label: 'Alphabetical Z-A', value: 'name-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' }
];

const AdvancedFilters = memo(function AdvancedFilters({
  tools,
  categories,
  onFilterChange,
  initialFilters = {
    categories: [],
    priceRanges: [],
    features: [],
    sortBy: 'popular',
    searchQuery: ''
  },
  className = ""
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 计算每个分类的工具数量
  const categoryStats = useMemo(() => {
    return categories.map(category => ({
      ...category,
      count: tools.filter(tool => tool.category === category.name).length
    }));
  }, [tools, categories]);

  // 计算每个价格范围的工具数量
  const priceStats = useMemo(() => {
    return PRICE_RANGES.map(range => ({
      ...range,
      count: tools.filter(tool => {
        const pricing = tool.pricing?.toLowerCase() || '';
        switch (range.value) {
          case 'free':
            return pricing.includes('free') && !pricing.includes('freemium');
          case 'freemium':
            return pricing.includes('freemium') || (pricing.includes('free') && pricing.includes('paid'));
          case 'under-10':
            return /\$[0-9]\b|\$[0-9]\.[0-9]/.test(pricing);
          case '10-50':
            return /\$[1-4][0-9]/.test(pricing) || /\$[5][0]/.test(pricing);
          case 'over-50':
            return /\$[5-9][1-9]/.test(pricing) || /\$[1-9][0-9][0-9]/.test(pricing);
          case 'enterprise':
            return pricing.includes('enterprise') || pricing.includes('custom');
          default:
            return false;
        }
      }).length
    }));
  }, [tools]);

  // 计算活跃筛选器数量
  const activeFiltersCount = useMemo(() => {
    return filters.categories.length + 
           filters.priceRanges.length + 
           filters.features.length +
           (filters.searchQuery ? 1 : 0);
  }, [filters]);

  // 更新筛选器
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  // 切换分类筛选
  const toggleCategory = (categoryName: string) => {
    const newCategories = filters.categories.includes(categoryName)
      ? filters.categories.filter(c => c !== categoryName)
      : [...filters.categories, categoryName];
    updateFilters({ categories: newCategories });
  };

  // 切换价格范围筛选
  const togglePriceRange = (range: string) => {
    const newRanges = filters.priceRanges.includes(range)
      ? filters.priceRanges.filter(r => r !== range)
      : [...filters.priceRanges, range];
    updateFilters({ priceRanges: newRanges });
  };

  // 切换功能筛选
  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilters({ features: newFeatures });
  };

  // 清除所有筛选器
  const clearAllFilters = () => {
    const cleared = {
      categories: [],
      priceRanges: [],
      features: [],
      sortBy: 'popular',
      searchQuery: ''
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* 筛选器头部 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-900">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 筛选器内容 */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 space-y-6">
          {/* 排序 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Sort by
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 分类筛选 */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categoryStats.map(category => (
                <label
                  key={category.id}
                  className="flex items-center justify-between py-1 cursor-pointer group"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.name)}
                      onChange={() => toggleCategory(category.name)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 价格筛选 */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Pricing</h3>
            <div className="space-y-2">
              {priceStats.map(range => (
                <label
                  key={range.value}
                  className="flex items-center justify-between py-1 cursor-pointer group"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.priceRanges.includes(range.value)}
                      onChange={() => togglePriceRange(range.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                      {range.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{range.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 功能筛选 */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Features</h3>
            <div className="space-y-2">
              {COMMON_FEATURES.map(feature => (
                <label
                  key={feature.value}
                  className="flex items-center py-1 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature.value)}
                    onChange={() => toggleFeature(feature.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                    {feature.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 活跃筛选器标签 */}
      {activeFiltersCount > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.categories.map(category => (
              <span
                key={category}
                className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full"
              >
                {category}
                <button
                  onClick={() => toggleCategory(category)}
                  className="hover:text-primary-900"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.priceRanges.map(range => {
              const rangeLabel = PRICE_RANGES.find(p => p.value === range)?.label || range;
              return (
                <span
                  key={range}
                  className="inline-flex items-center gap-1 bg-secondary-100 text-secondary-800 text-xs px-2 py-1 rounded-full"
                >
                  {rangeLabel}
                  <button
                    onClick={() => togglePriceRange(range)}
                    className="hover:text-secondary-900"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {filters.features.map(feature => {
              const featureLabel = COMMON_FEATURES.find(f => f.value === feature)?.label || feature;
              return (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1 bg-accent-100 text-accent-800 text-xs px-2 py-1 rounded-full"
                >
                  {featureLabel}
                  <button
                    onClick={() => toggleFeature(feature)}
                    className="hover:text-accent-900"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

AdvancedFilters.displayName = 'AdvancedFilters';

export default AdvancedFilters;
