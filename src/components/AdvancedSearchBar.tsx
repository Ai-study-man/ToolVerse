'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Tool } from '../types';

interface SearchSuggestion {
  type: 'tool' | 'category' | 'keyword';
  text: string;
  href: string;
  count?: number;
}

interface AdvancedSearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

export default function AdvancedSearchBar({ 
  placeholder = "Search AI tools, categories, or keywords...", 
  className = "",
  onSearch,
  autoFocus = false
}: AdvancedSearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const router = useRouter();

  // 热门搜索关键词
  const popularKeywords = [
    'ChatGPT alternatives',
    'free AI tools',
    'AI image generators',
    'AI coding assistants',
    'AI writing tools',
    'Midjourney alternatives',
    'AI video generators',
    'AI productivity tools'
  ];

  // 获取工具数据
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        const toolsData: Tool[] = await response.json();
        setTools(toolsData);
      } catch (error) {
        console.error('Failed to fetch tools:', error);
      }
    };
    fetchTools();
  }, []);

  // 生成搜索建议
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    const newSuggestions: SearchSuggestion[] = [];

    // 1. 工具名称匹配
    const matchingTools = tools.filter(tool =>
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    matchingTools.forEach(tool => {
      newSuggestions.push({
        type: 'tool',
        text: tool.name,
        href: `/tools/${tool.id}`
      });
    });

    // 2. 分类匹配
    const categories = Array.from(new Set(tools.map(tool => tool.category)));
    const matchingCategories = categories.filter(category =>
      category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    matchingCategories.forEach(category => {
      const toolCount = tools.filter(tool => tool.category === category).length;
      newSuggestions.push({
        type: 'category',
        text: category,
        href: `/tools?category=${encodeURIComponent(category)}`,
        count: toolCount
      });
    });

    // 3. 关键词匹配
    const matchingKeywords = popularKeywords.filter(keyword =>
      keyword.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    matchingKeywords.forEach(keyword => {
      newSuggestions.push({
        type: 'keyword',
        text: keyword,
        href: `/tools?search=${encodeURIComponent(keyword)}`
      });
    });

    setSuggestions(newSuggestions);
    setShowSuggestions(true);
    setLoading(false);
    setSelectedIndex(-1);
  }, [query, tools]);

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        router.push(suggestions[selectedIndex].href);
        setShowSuggestions(false);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // 更新选中项的焦点
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.focus();
    }
  }, [selectedIndex]);

  const handleSearch = () => {
    if (query.trim()) {
      const searchUrl = `/tools?search=${encodeURIComponent(query.trim())}`;
      router.push(searchUrl);
      if (onSearch) {
        onSearch(query.trim());
      }
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'tool':
        return '🔧';
      case 'category':
        return '📁';
      case 'keyword':
        return '🔍';
      default:
        return '💡';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* 搜索建议下拉框 */}
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
              Searching...
            </div>
          ) : (
            <>
              {suggestions.map((suggestion, index) => (
                <a
                  key={index}
                  ref={el => { suggestionRefs.current[index] = el; }}
                  href={suggestion.href}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(suggestion.href);
                    setShowSuggestions(false);
                  }}
                  className={`block px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                    selectedIndex === index ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{getSuggestionIcon(suggestion.type)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {suggestion.text}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {suggestion.type}
                          {suggestion.count && ` (${suggestion.count} tools)`}
                        </div>
                      </div>
                    </div>
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </a>
              ))}
              
              {/* 查看所有结果选项 */}
              <div className="border-t border-gray-100">
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                >
                  <div className="flex items-center">
                    <MagnifyingGlassIcon className="h-4 w-4 text-primary-600 mr-3" />
                    <span className="text-sm text-primary-600 font-medium">
                      Search for "{query}" in all tools
                    </span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 点击外部关闭建议 */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
