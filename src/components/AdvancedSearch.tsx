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

// Popular tags with categories for color coding
const POPULAR_TAGS = {
  functionality: [
    'AI Writing', 'Image Generation', 'Video Editing', 'Code Assistant', 'Data Analysis',
    'Chatbot', 'Voice Synthesis', 'Translation Tool', 'Design Tool', 'Marketing Tool'
  ],
  attributes: [
    'Free', 'Open Source', 'Paid', 'Premium'
  ],
  platforms: [
    'Online Tool', 'Browser Plugin', 'API Service', 'Mobile App', 'Desktop App'
  ]
};

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
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 自定义选择器样式
  const selectStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '14px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    outline: 'none',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const optionStyles = {
    backgroundColor: '#374151',
    color: 'white',
    padding: '8px 12px',
    border: 'none'
  };

  // 添加焦点样式处理
  const handleSelectFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(99, 102, 241, 0.8)';
    e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
  };

  const handleSelectBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    e.target.style.boxShadow = 'none';
  };

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
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  // Remove search from history
  const removeSearch = (query: string) => {
    const updated = recentSearches.filter(s => s !== query);
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
    if (!filters.query.trim() || filters.query.length < 2) return [];
    
    const query = filters.query.toLowerCase();
    const suggestions = new Set<{ text: string; type: 'tool' | 'category' | 'tag' }>();

    // 从工具名称中提取建议
    if (Array.isArray(tools)) {
      tools.forEach(tool => {
        if (tool.name.toLowerCase().includes(query) && suggestions.size < 8) {
          suggestions.add({ text: tool.name, type: 'tool' });
        }
      });
    }
    
    // 从分类中提取建议
    if (Array.isArray(categories)) {
      categories.forEach(category => {
        if (category.name.toLowerCase().includes(query) && suggestions.size < 8) {
          suggestions.add({ text: category.name, type: 'category' });
        }
      });
    }
      
    // 从标签中提取建议
    const allTags = [...POPULAR_TAGS.functionality, ...POPULAR_TAGS.attributes, ...POPULAR_TAGS.platforms];
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(query) && suggestions.size < 8) {
        suggestions.add({ text: tag, type: 'tag' });
      }
    });

    return Array.from(suggestions);
  }, [tools, categories, filters.query]);

  // Handle search input
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, query: value }));
    setShowSuggestions(value.trim().length >= 2);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: { text: string; type: string }) => {
    setFilters(prev => ({ ...prev, query: suggestion.text }));
    setShowSuggestions(false);
    saveSearch(suggestion.text);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (filters.query.trim()) {
      saveSearch(filters.query);
      setShowSuggestions(false);
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (search: string) => {
    setFilters(prev => ({ ...prev, query: search }));
    setShowSuggestions(false);
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

  // Get tag color based on category
  const getTagColor = (tag: string) => {
    if (POPULAR_TAGS.functionality.includes(tag)) {
      return 'bg-blue-500/20 text-blue-300 border-blue-400/30 hover:bg-blue-500/30';
    } else if (POPULAR_TAGS.attributes.includes(tag)) {
      return 'bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/30';
    } else if (POPULAR_TAGS.platforms.includes(tag)) {
      return 'bg-purple-500/20 text-purple-300 border-purple-400/30 hover:bg-purple-500/30';
    }
    return 'bg-white/20 text-white/80 border-white/30 hover:bg-white/30';
  };

  // Get selected tag color
  const getSelectedTagColor = (tag: string) => {
    if (POPULAR_TAGS.functionality.includes(tag)) {
      return 'bg-blue-500/80 text-white border-blue-400';
    } else if (POPULAR_TAGS.attributes.includes(tag)) {
      return 'bg-green-500/80 text-white border-green-400';
    } else if (POPULAR_TAGS.platforms.includes(tag)) {
      return 'bg-purple-500/80 text-white border-purple-400';
    }
    return 'bg-accent-600/80 text-white border-accent-400';
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
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 ${className}`}>
      {/* Main search box */}
      <div className="relative mb-4">
        <div className="relative">
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            onFocus={() => setShowSuggestions(filters.query.trim().length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search AI tools... (e.g., ChatGPT, image generation, writing assistant)"
            className="w-full pl-12 pr-12 py-4 bg-white border-2 border-purple-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg shadow-lg transition-all duration-200"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {/* Clear button */}
          {filters.query && (
            <button
              onClick={() => {
                handleSearchChange('');
                setShowSuggestions(false);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search suggestions */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2">Suggestions</div>
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md flex items-center gap-2 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    suggestion.type === 'tool' ? 'bg-blue-400' :
                    suggestion.type === 'category' ? 'bg-green-400' : 'bg-purple-400'
                  }`}></div>
                  <span className="text-gray-800">{suggestion.text}</span>
                  <span className="text-xs text-gray-500 ml-auto capitalize">{suggestion.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Use case quick selection */}
        <select
          value={filters.useCase}
          onChange={(e) => setFilters(prev => ({ ...prev, useCase: e.target.value }))}
          onFocus={handleSelectFocus}
          onBlur={handleSelectBlur}
          style={selectStyles}
        >
          <option value="" style={optionStyles}>Select Use Case</option>
          {USE_CASES.map(useCase => (
            <option key={useCase.id} value={useCase.id} style={optionStyles}>
              {useCase.label}
            </option>
          ))}
        </select>

        {/* Pricing model */}
        <select
          value={filters.pricing}
          onChange={(e) => setFilters(prev => ({ ...prev, pricing: e.target.value }))}
          onFocus={handleSelectFocus}
          onBlur={handleSelectBlur}
          style={selectStyles}
        >
          <option value="" style={optionStyles}>All Pricing</option>
          <option value="free" style={optionStyles}>Free</option>
          <option value="freemium" style={optionStyles}>Freemium</option>
          <option value="paid" style={optionStyles}>Paid</option>
        </select>

        {/* Category selection */}
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          onFocus={handleSelectFocus}
          onBlur={handleSelectBlur}
          style={selectStyles}
        >
          <option value="" style={optionStyles}>All Categories</option>
          {Array.isArray(categories) && categories.map(category => (
            <option key={category.id} value={category.name} style={optionStyles}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Minimum rating */}
        <select
          value={filters.rating}
          onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
          onFocus={handleSelectFocus}
          onBlur={handleSelectBlur}
          style={selectStyles}
        >
          <option value="0" style={optionStyles}>Any Rating</option>
          <option value="4" style={optionStyles}>4+ Stars</option>
          <option value="4.5" style={optionStyles}>4.5+ Stars</option>
        </select>

        {/* Sort by */}
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
          onFocus={handleSelectFocus}
          onBlur={handleSelectBlur}
          style={selectStyles}
        >
          <option value="relevance" style={optionStyles}>By Relevance</option>
          <option value="rating" style={optionStyles}>By Rating</option>
          <option value="name" style={optionStyles}>By Name</option>
          <option value="recent" style={optionStyles}>Recently Added</option>
        </select>

        {/* Advanced search toggle */}
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-sm text-white hover:bg-white/30 flex items-center gap-1"
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
        <div className="border-t border-white/20 pt-4 space-y-6">
          {/* Tag selection by category */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Select Tags by Category
            </label>
            
            {/* Functionality Tags */}
            <div className="mb-4">
              <div className="text-xs font-medium text-blue-300 mb-2">🔧 Functionality</div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.functionality.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 border ${
                      filters.tags.includes(tag)
                        ? getSelectedTagColor(tag)
                        : getTagColor(tag)
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Attributes Tags */}
            <div className="mb-4">
              <div className="text-xs font-medium text-green-300 mb-2">💎 Attributes</div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.attributes.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 border ${
                      filters.tags.includes(tag)
                        ? getSelectedTagColor(tag)
                        : getTagColor(tag)
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Tags */}
            <div className="mb-4">
              <div className="text-xs font-medium text-purple-300 mb-2">🚀 Platforms</div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.platforms.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 border ${
                      filters.tags.includes(tag)
                        ? getSelectedTagColor(tag)
                        : getTagColor(tag)
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected tags */}
          {filters.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Selected Tags ({filters.tags.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.tags.map(tag => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border ${getSelectedTagColor(tag)}`}
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="ml-2 text-white/80 hover:text-white transition-colors"
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
        <div className="border-t border-white/20 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-white">
              Recent Searches
            </label>
            <button
              onClick={() => {
                setRecentSearches([]);
                localStorage.removeItem('recent-searches');
              }}
              className="text-xs text-white/60 hover:text-white/80 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <div key={index} className="flex items-center gap-1">
                <button
                  onClick={() => handleRecentSearchClick(search)}
                  className="px-3 py-1.5 text-sm text-white/80 bg-white/20 rounded-md hover:bg-white/30 hover:text-white transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {search}
                </button>
                <button
                  onClick={() => removeSearch(search)}
                  className="text-white/40 hover:text-white/70 transition-colors p-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 搜索结果统计和清除 */}
      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70">
            Found {searchResults.length} tools
          </span>
          
          {searchResults.length === 0 && (filters.query || filters.category || filters.pricing || filters.tags.length > 0 || filters.useCase || filters.rating > 0) && (
            <div className="flex items-center gap-2 text-sm text-yellow-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              No matches found
            </div>
          )}
        </div>
        
        {(filters.query || filters.category || filters.pricing || filters.tags.length > 0 || filters.useCase || filters.rating > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-accent-300 hover:text-accent-200 font-medium flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Empty state suggestions */}
      {searchResults.length === 0 && (filters.query || filters.category || filters.pricing || filters.tags.length > 0 || filters.useCase || filters.rating > 0) && (
        <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
          <div className="text-center">
            <div className="text-white/80 font-medium mb-2">Try these suggestions:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setFilters(prev => ({ ...prev, query: 'ChatGPT' }))}
                className="px-3 py-1 text-xs bg-white/20 text-white/70 rounded hover:bg-white/30 transition-colors"
              >
                🤖 ChatGPT
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, query: 'image generation' }))}
                className="px-3 py-1 text-xs bg-white/20 text-white/70 rounded hover:bg-white/30 transition-colors"
              >
                🎨 Image Generation
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, query: 'writing assistant' }))}
                className="px-3 py-1 text-xs bg-white/20 text-white/70 rounded hover:bg-white/30 transition-colors"
              >
                ✍️ Writing Assistant
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, pricing: 'free' }))}
                className="px-3 py-1 text-xs bg-white/20 text-white/70 rounded hover:bg-white/30 transition-colors"
              >
                💝 Free Tools
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
