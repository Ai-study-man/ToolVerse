'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ToolCard from '../components/ToolCard';
import CategoryCard from '../components/CategoryCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import DataSyncService from '../lib/dataSyncService';
import { navigateToUrl } from '../lib/navigation';
import { Tool, Category } from '../types';

// 动态导入非关键组件
const ToolGrid = dynamic(() => import('../components/ToolGrid'), {
  loading: () => <LoadingSkeleton variant="featured" count={6} />
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]); // 添加所有工具的状态
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // 优化的数据获取函数
    const fetchData = async () => {
      try {
        console.log('Starting to fetch homepage data...');
        
        // 使用并行请求但添加超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
        
        const [categoriesResponse, toolsResponse] = await Promise.allSettled([
          fetch('/api/categories?direct=true', { 
            cache: 'no-store',
            signal: controller.signal
          }),
          fetch('/api/tools?direct=true&limit=50', { // 限制初始加载的工具数量
            cache: 'no-store',
            signal: controller.signal
          })
        ]);
        
        clearTimeout(timeoutId);
        
        // 处理分类数据
        if (categoriesResponse.status === 'fulfilled' && categoriesResponse.value.ok) {
          const categoriesResult = await categoriesResponse.value.json();
          if (categoriesResult.success) {
            setCategories(categoriesResult.data.categories || []);
          }
        } else {
          console.warn('Categories API failed, using empty array');
          setCategories([]);
        }
        
        // 处理工具数据
        if (toolsResponse.status === 'fulfilled' && toolsResponse.value.ok) {
          const toolsResult = await toolsResponse.value.json();
          if (toolsResult.success) {
            const toolsData = toolsResult.data.tools || [];
            // 获取前6个工具作为特色工具，优先显示有本地logo的工具
            const featuredToolsData = toolsData
              .sort((a: Tool, b: Tool) => {
                // 优先显示有本地logo的工具
                const aHasLocalLogo = a.logo?.startsWith('/logos/') || false;
                const bHasLocalLogo = b.logo?.startsWith('/logos/') || false;
                if (aHasLocalLogo && !bHasLocalLogo) return -1;
                if (!aHasLocalLogo && bHasLocalLogo) return 1;
                return 0;
              })
              .slice(0, 6);
            
            setFeaturedTools(featuredToolsData);
            setAllTools(toolsData);
          }
        } else {
          console.warn('Tools API failed, using empty arrays');
          setFeaturedTools([]);
          setAllTools([]);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('Request timed out');
        } else {
          console.error('Error fetching data:', error);
        }
        // 确保设置默认值
        setCategories([]);
        setFeaturedTools([]);
        setAllTools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const url = `/tools?search=${encodeURIComponent(query)}`;
      navigateToUrl(url);
    } else {
      navigateToUrl('/tools');
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    const url = `/tools?category=${encodeURIComponent(categoryName)}`;
    navigateToUrl(url);
  };

  // 添加 memoization 优化渲染性能
  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoizedFeaturedTools = useMemo(() => featuredTools, [featuredTools]);

  // 优化分类图标获取
  const getCategoryIcon = useMemo(() => {
    const iconMap: { [key: string]: string } = {
      'Conversational AI': '🤖',
      'Image Generation': '🎨', 
      'Code Development': '💻',
      'Productivity': '⚡',
      'Video & Audio': '🎬',
      'Writing & Content': '✍️',
      'Language & Translation': '🌐',
      'Business & Analytics': '📊',
      'Marketing & SEO': '📈',
      'Finance': '💰',
      'Education': '📚'
    };
    
    return (categoryName: string) => iconMap[categoryName] || '🔧';
  }, []);

  // 优化工具计数获取
  const getCategoryToolCount = useMemo(() => {
    return (categoryName: string) => {
      if (!allTools.length) return 0;
      return allTools.filter((tool: Tool) => 
        tool.category === categoryName || 
        tool.tags?.includes(categoryName)
      ).length;
    };
  }, [allTools]);

  // 优化获取分类工具列表
  const getCategoryTools = useMemo(() => {
    return (categoryName: string) => {
      if (!featuredTools.length) return [];
      return featuredTools.filter((tool: Tool) => tool.category === categoryName).slice(0, 3);
    };
  }, [featuredTools]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover the Best <span className="text-accent-300">AI Tools</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Find the perfect AI tools for your business, creative projects, and productivity needs. 
            Curated and reviewed by experts.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for AI tools..."
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Browse by Category
          </h2>
          {loading ? (
            <LoadingSkeleton variant="category" count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memoizedCategories.map((category: Category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  icon={getCategoryIcon(category.name)}
                  toolCount={getCategoryToolCount(category.name)}
                  onClick={() => handleCategoryClick(category.name)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured AI Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the most popular and highly-rated AI tools chosen by our community
            </p>
          </div>
          {loading ? (
            <LoadingSkeleton variant="featured" count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memoizedFeaturedTools.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No tools available</p>
                </div>
              ) : (
                memoizedFeaturedTools.map((tool: Tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))
              )}
            </div>
          )}
          <div className="text-center mt-12">
            <a 
              href="/tools"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium inline-block"
            >
              View All Tools
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Latest AI Tools
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Get weekly updates on new AI tools, reviews, and industry insights delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-bold">ToolVerse</span>
              </div>
              <p className="text-gray-400">
                Discover and explore the best AI tools for your needs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/tools" className="hover:text-white transition-colors">All Tools</a></li>
                <li><a href="/categories" className="hover:text-white transition-colors">Categories</a></li>
                <li><a href="/featured" className="hover:text-white transition-colors">Featured</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/submit" className="hover:text-white transition-colors">Submit Tool</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ToolVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
