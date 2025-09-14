'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabaseClient';
import { getCategoryIcon, getCategoryDisplayName, mapToUnifiedCategory } from '@/utils/categoryIcons';
import ToolLogo from '@/components/ToolLogo';

// 工具数据类型
interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  website: string | null;
  category: string | null;
  pricing: string | null;
  tags: string[] | null;
  features: string[] | null;
  created_at: string;
}

// 工具卡片组件
function ToolCard({ tool }: { tool: Tool }) {
  const formatPricing = (pricing: string): { type: 'free' | 'freemium' | 'paid'; display: string } => {
    if (!pricing) return { type: 'freemium', display: 'Unknown' };
    
    const lowerPricing = pricing.toLowerCase();
    
    if (lowerPricing.includes('free') && !lowerPricing.includes('$') && !lowerPricing.includes('paid')) {
      return { type: 'free', display: 'Free' };
    } else if (lowerPricing.includes('free') || lowerPricing.includes('freemium')) {
      return { type: 'freemium', display: pricing };
    } else {
      return { type: 'paid', display: pricing };
    }
  };

  const pricingInfo = formatPricing(tool.pricing || '');
  
  // 获取统一分类
  const unifiedCategory = mapToUnifiedCategory({
    name: tool.name,
    description: tool.description,
    category: tool.category
  });

  return (
    <Link href={`/tool/${tool.id}`} className="block group h-full">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:transform group-hover:-translate-y-1 group-hover:shadow-xl h-full flex flex-col">
        {/* 工具logo和基本信息 */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <ToolLogo 
              name={tool.name}
              logo={tool.logo || undefined}
              size="md"
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white group-hover:text-accent-300 transition-colors mb-1 line-clamp-1">
                {tool.name}
              </h3>
              <p className="text-sm text-white/70 line-clamp-2 flex-1">
                {tool.description || 'No description available'}
              </p>
            </div>
          </div>
          
          {/* 标签和分类 */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-500/20 text-secondary-200 border border-secondary-400/30">
              {getCategoryIcon(unifiedCategory)} {unifiedCategory}
            </span>
            {tool.pricing && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                pricingInfo.type === 'free' 
                  ? 'bg-green-500/20 text-green-200 border-green-400/30'
                  : pricingInfo.type === 'freemium'
                  ? 'bg-blue-500/20 text-blue-200 border-blue-400/30'
                  : 'bg-purple-500/20 text-purple-200 border-purple-400/30'
              }`}>
                {pricingInfo.display}
              </span>
            )}
          </div>
          
          {/* 标签 */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tool.tags.slice(0, 3).map((tag: string, index: number) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/5 text-white/60 border border-white/10">
                  #{tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/5 text-white/60 border border-white/10">
                  +{tool.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* 底部操作区域 */}
        <div className="px-6 pb-6 pt-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">
              Click to view details
            </span>
            <div className="flex items-center text-accent-400 group-hover:text-accent-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// 加载卡片组件
function LoadingCard() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 h-64">
      <div className="animate-pulse">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-3 bg-white/10 rounded"></div>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-white/10 rounded-full"></div>
          <div className="h-6 w-12 bg-white/10 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded"></div>
          <div className="h-3 bg-white/10 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

// 404 组件
function CategoryNotFound({ categorySlug }: { categorySlug: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 text-white/20">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-white mb-2">Category Not Found</h3>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Sorry, the category &quot;{categorySlug}&quot; does not exist or has no related tools.
      </p>
      <div className="space-x-4">
        <Link
          href="/tools"
          className="inline-block bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors font-medium"
        >
          View All Tools
        </Link>
        <Link 
          href="/"
          className="inline-block bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/20"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// 主页面组件
export default function CategoryPage() {
  const params = useParams();
  const categorySlug = decodeURIComponent(params.slug as string);
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取分类工具 - 使用智能分类系统
  useEffect(() => {
    async function fetchCategoryTools() {
      try {
        setLoading(true);
        setError(null);

        // 获取所有工具
        const { data, error: queryError } = await supabase
          .from('tools')
          .select('*')
          .order('created_at', { ascending: false });

        if (queryError) {
          throw new Error(`Failed to fetch tools: ${queryError.message}`);
        }

        if (data) {
          // 使用智能分类系统过滤工具
          const filteredTools = data.filter(tool => {
            const unifiedCategory = mapToUnifiedCategory({
              name: tool.name,
              description: tool.description || '',
              category: tool.category
            });
            return unifiedCategory === categorySlug;
          });

          setTools(filteredTools.map(tool => ({
            id: tool.id,
            name: tool.name,
            description: tool.description || '',
            logo: tool.logo,
            website: tool.website,
            category: tool.category,
            pricing: tool.pricing,
            tags: tool.tags,
            features: tool.features,
            created_at: tool.created_at || new Date().toISOString()
          })));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching category tools:', err);
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug) {
      fetchCategoryTools();
    }
  }, [categorySlug]);

  const categoryIcon = getCategoryIcon(categorySlug);
  const categoryDisplayName = getCategoryDisplayName(categorySlug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
      {/* 统一的 Header 组件 */}
      <Header />

      {/* 面包屑导航 */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <Link href="/tools" className="text-white/60 hover:text-white transition-colors">
              Tools
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white">{categoryIcon} {categorySlug}</span>
          </nav>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 分类标题和统计 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-6xl">{categoryIcon}</span>
            <h1 className="text-4xl font-bold text-white">
              {categorySlug}
            </h1>
          </div>
          <p className="text-xl text-white/80">
            {loading ? 'Loading...' : 
             tools.length > 0 ? `Found ${tools.length} ${categorySlug} Tools` :
             error ? 'Loading failed' : `No ${categorySlug} tools available`}
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-200">Error loading tools: {error}</p>
            </div>
          </div>
        )}

        {/* 工具展示 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : tools.length > 0 ? (
          <>
            {/* 工具网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>

            {/* 相关操作 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-3">Discover More</h3>
              <p className="text-sm text-white/60 mb-4">
                Explore AI tools from other categories to find the best solutions for your needs.
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/tools"
                  className="inline-flex items-center bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors font-medium"
                >
                  Browse All Tools
                </Link>
                <Link 
                  href="/"
                  className="inline-flex items-center bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/20"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </>
        ) : (
          <CategoryNotFound categorySlug={categorySlug} />
        )}
      </div>
    </div>
  );
}