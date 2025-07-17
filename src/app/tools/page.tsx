'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import AdvancedSearch from '../../components/AdvancedSearch';
import ToolCard from '../../components/ToolCard';
import DataSyncService from '../../lib/dataSyncService';
import { Tool, Category } from '../../types';

function ToolsContent() {
  const searchParams = useSearchParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // 初始化数据
  useEffect(() => {
    setIsClient(true);
    
    const fetchData = async () => {
      try {
        // 直接使用 DataSyncService 获取数据
        const [toolsData, categoriesData] = await Promise.all([
          DataSyncService.getTools(),
          DataSyncService.getCategories()
        ]);
        
        console.log('Tools page - fetched tools data:', toolsData.length);
        console.log('Tools page - fetched categories data:', categoriesData.length);
        
        setTools(toolsData);
        setCategories(categoriesData);
        setFilteredTools(toolsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // 降级处理：使用空数组
        setTools([]);
        setCategories([]);
        setFilteredTools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理URL参数筛选
  useEffect(() => {
    if (!isClient || tools.length === 0) return;

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    console.log('开始筛选工具:');
    console.log('- URL分类参数:', category);
    console.log('- URL搜索参数:', search);
    console.log('- 总工具数:', tools.length);
    console.log('- First 3 tools categories:', tools.slice(0, 3).map(t => `${t.name}: ${t.category}`));
    
    let filtered = [...tools];
    
    // 按分类筛选
    if (category) {
      filtered = filtered.filter(tool => tool.category === category);
      console.log(`Filtering by category "${category}", found ${filtered.length} tools`);
      console.log('筛选结果:', filtered.map(t => t.name));
    }
    
    // 按搜索关键词筛选
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.category.toLowerCase().includes(searchLower) ||
        (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
      console.log(`Filtering by search "${search}", found ${filtered.length} tools`);
    }
    
    setFilteredTools(filtered);
  }, [searchParams, tools, isClient]);

  // 处理搜索结果更新
  const handleSearchResults = (results: Tool[]) => {
    // 如果当前有分类筛选，不让搜索组件覆盖结果
    if (!searchParams.get('category')) {
      setFilteredTools(results);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>
            <div className="bg-white rounded-xl p-6 mb-8">
              <div className="h-12 bg-gray-300 rounded mb-4"></div>
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-300 rounded w-24"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        {searchParams.get('category') && (
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <div>
                    <a href="/" className="text-gray-400 hover:text-gray-500 transition-colors">
                      Home
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <a href="/tools" className="text-gray-400 hover:text-gray-500 transition-colors">
                      AI Tools Directory
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600 font-medium">
                      {searchParams.get('category')}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        )}
        
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {(() => {
              const category = searchParams.get('category');
              const search = searchParams.get('search');
              
              if (category) {
                return `${category} - AI Tools`;
              } else if (search) {
                return `Search Results: ${search}`;
              }
              return 'AI Tools Directory';
            })()}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {(() => {
              const category = searchParams.get('category');
              const search = searchParams.get('search');
              
              if (category) {
                return `Discover ${filteredTools.length} ${category} AI tools`;
              } else if (search) {
                return `Found ${filteredTools.length} relevant tools`;
              }
              return `Explore and discover ${tools.length}+ curated AI tools for various use cases and needs`;
            })()}
          </p>
        </div>

        {/* 高级搜索组件 */}
        {!searchParams.get('category') && (
          <AdvancedSearch
            tools={tools}
            categories={categories}
            onSearchResults={handleSearchResults}
            className="mb-8"
          />
        )}

        {/* Simple search when filtering by category */}
        {searchParams.get('category') && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {searchParams.get('category')} Tools
                </h3>
                <p className="text-gray-600 mt-1">
                  Found {filteredTools.length} tools in this category
                </p>
              </div>
              <a 
                href="/tools"
                className="text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap"
              >
                View All Tools →
              </a>
            </div>
            
            {/* Category-specific search */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search in ${searchParams.get('category')} tools...`}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  onChange={(e) => {
                    const query = e.target.value.toLowerCase();
                    if (query.trim()) {
                      const categoryTools = tools.filter(tool => tool.category === searchParams.get('category'));
                      const filtered = categoryTools.filter(tool => 
                        tool.name.toLowerCase().includes(query) ||
                        tool.description.toLowerCase().includes(query) ||
                        (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query)))
                      );
                      setFilteredTools(filtered);
                    } else {
                      // Reset to all tools in this category
                      const categoryTools = tools.filter(tool => tool.category === searchParams.get('category'));
                      setFilteredTools(categoryTools);
                    }
                  }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Search within {searchParams.get('category')} tools by name, description, or tags
              </div>
            </div>
          </div>
        )}

        {/* Tools display area */}
        <div className="space-y-6">
          {loading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-6 bg-gray-300 rounded w-14"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredTools.length > 0 ? (
            // 工具网格
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            // 无结果状态
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No matching tools found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or filters, or browse all available AI tools.
              </p>
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  Suggestions:
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Try more general keywords</li>
                  <li>• Check spelling</li>
                  <li>• Remove some filters</li>
                  <li>• Browse different categories</li>
                </ul>
              </div>
            </div>
          )}

          {/* Load more button (future feature) */}
          {!loading && filteredTools.length > 0 && filteredTools.length >= 20 && (
            <div className="text-center pt-8">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Load More Tools
              </button>
            </div>
          )}
        </div>

        {/* Statistics */}
        {!loading && (
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Browse Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  {tools.length}
                </div>
                <div className="text-sm text-gray-600">Total Tools</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary-600">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-600">
                  {filteredTools.length}
                </div>
                <div className="text-sm text-gray-600">Search Results</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {tools.filter(t => t.pricingModel === 'free').length}
                </div>
                <div className="text-sm text-gray-600">Free Tools</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolsContent />
    </Suspense>
  );
}
