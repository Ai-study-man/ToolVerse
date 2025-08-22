'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  LinkIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { Tool, Category } from '../types';

interface SuperSearchBarProps {
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  onSearch?: (query: string) => void;
}

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'tool' | 'category' | 'keyword' | 'recent';
  url: string;
  description?: string;
  icon?: string;
}

// 热门搜索关键词
const trendingKeywords = [
  'ChatGPT alternatives',
  'AI image generator',
  'coding assistant',
  'free AI tools',
  'AI writing assistant',
  'AI video editor',
  'AI translator',
  'AI design tools'
];

export default function SuperSearchBar({ 
  placeholder = "Search AI tools, categories, or keywords...",
  className = "",
  showSuggestions = true,
  maxSuggestions = 8,
  onSearch 
}: SuperSearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 加载工具和分类数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toolsRes, categoriesRes] = await Promise.all([
          fetch('/api/tools'),
          fetch('/api/categories')
        ]);
        
        if (toolsRes.ok && categoriesRes.ok) {
          const [toolsData, categoriesData] = await Promise.all([
            toolsRes.json(),
            categoriesRes.json()
          ]);
          setTools(toolsData);
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Failed to fetch search data:', error);
      }
    };

    fetchData();
  }, []);

  // 加载本地搜索历史
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // 生成搜索建议
  const generateSuggestions = useCallback((searchQuery: string): SearchSuggestion[] => {
    if (!searchQuery.trim()) {
      // 显示最近搜索和热门关键词
      const suggestions: SearchSuggestion[] = [];
      
      // 最近搜索
      recentSearches.slice(0, 3).forEach(recent => {
        suggestions.push({
          id: `recent-${recent}`,
          title: recent,
          type: 'recent',
          url: `/tools?search=${encodeURIComponent(recent)}`,
          description: 'Recent search'
        });
      });

      // 热门关键词
      trendingKeywords.slice(0, maxSuggestions - suggestions.length).forEach(keyword => {
        suggestions.push({
          id: `trending-${keyword}`,
          title: keyword,
          type: 'keyword',
          url: `/tools?search=${encodeURIComponent(keyword)}`,
          description: 'Trending search'
        });
      });

      return suggestions;
    }

    const searchTerm = searchQuery.toLowerCase();
    const suggestions: SearchSuggestion[] = [];
    
    // 工具建议
    const matchingTools = tools
      .filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .slice(0, 4)
      .map(tool => ({
        id: `tool-${tool.id}`,
        title: tool.name,
        type: 'tool' as const,
        url: `/tools/${tool.id}`,
        description: tool.category,
        icon: tool.logo
      }));

    // 分类建议
    const matchingCategories = categories
      .filter(category => 
        category.name.toLowerCase().includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm)
      )
      .slice(0, 3)
      .map(category => ({
        id: `category-${category.id}`,
        title: category.name,
        type: 'category' as const,
        url: `/tools?category=${encodeURIComponent(category.name)}`,
        description: `${category.toolCount} tools`,
        icon: category.icon
      }));

    // 关键词建议
    const matchingKeywords = trendingKeywords
      .filter(keyword => keyword.toLowerCase().includes(searchTerm))
      .slice(0, 2)
      .map(keyword => ({
        id: `keyword-${keyword}`,
        title: keyword,
        type: 'keyword' as const,
        url: `/tools?search=${encodeURIComponent(keyword)}`,
        description: 'Popular search'
      }));

    suggestions.push(...matchingTools, ...matchingCategories, ...matchingKeywords);
    return suggestions.slice(0, maxSuggestions);
  }, [tools, categories, recentSearches, maxSuggestions]);

  // 防抖生成建议
  const debouncedGenerateSuggestions = useMemo(() => {
    const debounce = (func: Function, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    };
    
    return debounce((searchQuery: string) => {
      setSuggestions(generateSuggestions(searchQuery));
    }, 150);
  }, [generateSuggestions]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (showSuggestions) {
      debouncedGenerateSuggestions(value);
      setIsOpen(true);
    }
  };

  // 执行搜索
  const executeSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // 保存到搜索历史
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 10);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recent-searches', JSON.stringify(newRecentSearches));
    
    // 执行搜索
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/tools?search=${encodeURIComponent(searchQuery)}`);
    }
    
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        executeSearch(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const suggestion = suggestions[selectedIndex];
          router.push(suggestion.url);
          setIsOpen(false);
        } else {
          executeSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'tool' || suggestion.type === 'category') {
      router.push(suggestion.url);
    } else {
      setQuery(suggestion.title);
      executeSearch(suggestion.title);
    }
    setIsOpen(false);
  };

  // 复制搜索链接
  const copySearchLink = async () => {
    if (!query.trim()) return;
    
    const url = `${window.location.origin}/tools?search=${encodeURIComponent(query)}`;
    try {
      await navigator.clipboard.writeText(url);
      // 可以添加toast提示
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 获建议图标
  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'tool':
        return suggestion.icon ? (
          <img src={suggestion.icon} alt="" className="w-5 h-5 rounded" />
        ) : (
          <div className="w-5 h-5 bg-primary-100 rounded flex items-center justify-center">
            <span className="text-primary-600 text-xs font-medium">AI</span>
          </div>
        );
      case 'category':
        return (
          <span className="text-lg">{suggestion.icon || '📁'}</span>
        );
      case 'recent':
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
      case 'keyword':
        return <FireIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 搜索框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => showSuggestions && setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
          
          {query && (
            <button
              onClick={copySearchLink}
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              title="Copy search link"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 建议下拉 */}
      {isOpen && showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                index === selectedIndex ? 'bg-primary-50 border-l-2 border-primary-500' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {getSuggestionIcon(suggestion)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {suggestion.title}
                </div>
                {suggestion.description && (
                  <div className="text-sm text-gray-500 truncate">
                    {suggestion.description}
                  </div>
                )}
              </div>
              
              {suggestion.type === 'recent' && (
                <div className="text-xs text-gray-400">Recent</div>
              )}
              {suggestion.type === 'keyword' && (
                <div className="text-xs text-orange-500">Trending</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
