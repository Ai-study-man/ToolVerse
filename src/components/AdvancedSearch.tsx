'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tool, Category } from '../types';

interface AdvancedSearchProps {
  tools: Tool[];
  categories: Category[];
  onSearchResults: (results: Tool[]) => void;
  className?: string;
}

interface SearchFilters {
  query: string;
  category: string;
  pricing: string;
  tags: string[];
  useCase: string;
  rating: number;
  sortBy: 'relevance' | 'rating' | 'name' | 'recent';
}

// Use case mapping
const USE_CASES = [
  { id: 'content-creation', label: 'Content Creation', keywords: ['writing', 'content', 'blog', 'article', 'copy'] },
  { id: 'image-generation', label: 'Image Generation', keywords: ['image', 'photo', 'art', 'visual', 'picture'] },
  { id: 'video-editing', label: 'Video Editing', keywords: ['video', 'edit', 'movie', 'clip', 'film'] },
  { id: 'code-development', label: 'Code Development', keywords: ['code', 'programming', 'development', 'coding', 'software'] },
  { id: 'data-analysis', label: 'Data Analysis', keywords: ['data', 'analytics', 'analysis', 'insights', 'statistics'] },
  { id: 'customer-service', label: 'Customer Service', keywords: ['customer', 'support', 'help', 'service', 'chat'] },
  { id: 'marketing', label: 'Marketing', keywords: ['marketing', 'promotion', 'advertising', 'campaign', 'seo'] },
  { id: 'education', label: 'Education', keywords: ['education', 'learning', 'teaching', 'training', 'course'] },
  { id: 'productivity', label: 'Productivity', keywords: ['productivity', 'automation', 'workflow', 'efficiency', 'organize'] },
  { id: 'design', label: 'Design & Creative', keywords: ['design', 'creative', 'ui', 'ux', 'graphic'] },
  { id: 'audio', label: 'Audio Processing', keywords: ['audio', 'music', 'sound', 'voice', 'speech'] },
  { id: 'translation', label: 'Translation', keywords: ['translate', 'translation', 'language', 'multilingual'] },
  { id: 'resume', label: 'Resume Builder', keywords: ['resume', 'cv', 'career', 'job', 'hiring'] },
  { id: 'social-media', label: 'Social Media', keywords: ['social', 'instagram', 'twitter', 'facebook', 'tiktok'] },
  { id: 'research', label: 'Research & Analysis', keywords: ['research', 'analysis', 'study', 'investigation', 'survey'] }
];

// Popular tags
const POPULAR_TAGS = [
  'AI Writing', 'Image Generation', 'Video Editing', 'Code Assistant', 'Data Analysis',
  'Chatbot', 'Voice Synthesis', 'Translation Tool', 'Design Tool', 'Marketing Tool',
  'Free', 'Open Source', 'Online Tool', 'Browser Plugin', 'API Service'
];

export default function AdvancedSearch({ tools, categories, onSearchResults, className = '' }: AdvancedSearchProps) {
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    pricing: '',
    tags: [],
    useCase: '',
    rating: 0,
    sortBy: 'relevance'
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent search history
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search history
  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  // Smart search algorithm
  const searchResults = useMemo(() => {
    let results = [...tools];

    // 1. Text search (fuzzy matching)
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase().trim();
      const queryWords = query.split(/\s+/);
      
      results = results.filter(tool => {
        const searchText = [
          tool.name,
          tool.description,
          tool.shortDescription,
          ...tool.tags,
          ...tool.features,
          ...(tool.useCases || [])
        ].join(' ').toLowerCase();

        // Support multi-word search
        return queryWords.every(word => searchText.includes(word));
      });

      // Score by relevance
      results = results.map(tool => {
        let score = 0;
        const searchText = [
          tool.name,
          tool.description,
          tool.shortDescription,
          ...tool.tags,
          ...tool.features
        ].join(' ').toLowerCase();

        // 名称匹配权重最高
        if (tool.name.toLowerCase().includes(filters.query.toLowerCase())) {
          score += 10;
        }

        // 描述匹配
        if (tool.description.toLowerCase().includes(filters.query.toLowerCase())) {
          score += 5;
        }

        // 标签匹配
        tool.tags.forEach(tag => {
          if (tag.toLowerCase().includes(filters.query.toLowerCase())) {
            score += 3;
          }
        });

        return { ...tool, _searchScore: score };
      }).sort((a: any, b: any) => b._searchScore - a._searchScore);
    }

    // 2. Category filtering
    if (filters.category) {
      results = results.filter(tool => 
        tool.category === filters.category || 
        tool.subcategory === filters.category
      );
    }

    // 3. 定价模式过滤
    if (filters.pricing) {
      results = results.filter(tool => tool.pricingModel === filters.pricing);
    }

    // 4. 标签过滤
    if (filters.tags.length > 0) {
      results = results.filter(tool =>
        filters.tags.some(tag => 
          tool.tags.some(toolTag => 
            toolTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    // 5. 使用场景过滤
    if (filters.useCase) {
      const useCase = USE_CASES.find(uc => uc.id === filters.useCase);
      if (useCase) {
        results = results.filter(tool => {
          const toolText = [
            tool.description,
            tool.shortDescription,
            ...tool.tags,
            ...tool.features,
            ...(tool.useCases || [])
          ].join(' ').toLowerCase();

          return useCase.keywords.some(keyword => 
            toolText.includes(keyword.toLowerCase())
          );
        });
      }
    }

    // 6. Rating filtering
    if (filters.rating > 0) {
      results = results.filter(tool => tool.rating >= filters.rating);
    }

    // 7. Sorting
    switch (filters.sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        // 假设有创建时间字段
        results.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'relevance':
      default:
        // Already sorted by relevance
        break;
    }

    return results;
  }, [tools, filters]);

  // Trigger search results update
  useEffect(() => {
    onSearchResults(searchResults);
  }, [searchResults, onSearchResults]);

  // Quick search suggestions
  const searchSuggestions = useMemo(() => {
    if (!filters.query.trim()) return [];
    
    const query = filters.query.toLowerCase();
    const suggestions = new Set<string>();

    // 从工具名称中提取建议
    tools.forEach(tool => {
      if (tool.name.toLowerCase().includes(query)) {
        suggestions.add(tool.name);
      }
      
      // 从标签中提取建议
      tool.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }, [tools, filters.query]);

  // Handle search input
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, query: value }));
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (filters.query.trim()) {
      saveSearch(filters.query);
    }
  };

  // 清除所有过滤器
  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      pricing: '',
      tags: [],
      useCase: '',
      rating: 0,
      sortBy: 'relevance'
    });
  };

  // 切换标签选择
  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // 初始化URL参数
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category || search) {
      console.log('Initializing search params from URL:', { category, search });
      setFilters(prev => ({
        ...prev,
        category: category || '',
        query: search || ''
      }));
    }
  }, [searchParams]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Main search box */}
      <div className="relative mb-4">
        <div className="relative">
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            placeholder="Search AI tools... (e.g., ChatGPT, image generation, writing assistant)"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {/* Clear button */}
          {filters.query && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search suggestions */}
        {searchSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearchChange(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Use case quick selection */}
        <select
          value={filters.useCase}
          onChange={(e) => setFilters(prev => ({ ...prev, useCase: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select Use Case</option>
          {USE_CASES.map(useCase => (
            <option key={useCase.id} value={useCase.id}>
              {useCase.label}
            </option>
          ))}
        </select>

        {/* Pricing model */}
        <select
          value={filters.pricing}
          onChange={(e) => setFilters(prev => ({ ...prev, pricing: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Pricing</option>
          <option value="free">Free</option>
          <option value="freemium">Freemium</option>
          <option value="paid">Paid</option>
        </select>

        {/* Category selection */}
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Minimum rating */}
        <select
          value={filters.rating}
          onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="0">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>

        {/* Sort by */}
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="relevance">By Relevance</option>
          <option value="rating">By Rating</option>
          <option value="name">By Name</option>
          <option value="recent">Recently Added</option>
        </select>

        {/* Advanced search toggle */}
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center gap-1"
        >
          Advanced Search
          <svg 
            className={`w-4 h-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Advanced search panel */}
      {isAdvancedOpen && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {/* Tag selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.tags.includes(tag)
                      ? 'bg-primary-100 text-primary-800 border border-primary-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Selected tags */}
          {filters.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 最近搜索 */}
      {recentSearches.length > 0 && !filters.query && (
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            最近搜索
          </label>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearchChange(search)}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 搜索结果统计和清除 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">
          找到 {searchResults.length} 个工具
        </span>
        
        {(filters.query || filters.category || filters.pricing || filters.tags.length > 0 || filters.useCase || filters.rating > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            清除所有过滤器
          </button>
        )}
      </div>
    </div>
  );
}
