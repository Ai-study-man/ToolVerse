'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ToolLogo from '@/components/ToolLogo';
import { supabase } from '@/lib/supabaseClient';
import { getCategoryIcon } from '@/utils/categoryIcons';

// Tool data interface
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

// Pricing badge styling
function getPricingBadgeStyle(pricing: string) {
  const lowerPricing = pricing.toLowerCase();
  if (lowerPricing.includes('free')) {
    return 'bg-green-100 text-green-800 border-green-300';
  } else if (lowerPricing.includes('paid')) {
    return 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (lowerPricing.includes('freemium')) {
    return 'bg-purple-100 text-purple-800 border-purple-300';
  }
  return 'bg-gray-100 text-gray-800 border-gray-300';
}

// Comments section component - 玻璃态设计与紫色渐变搭配
function CommentsSection() {
  return (
    <div className="relative group">
      {/* 外部光晕效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-purple-500/15 to-indigo-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-105"></div>
      
      {/* 主容器 - 玻璃态效果 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-500">
        
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        {/* Header */}
        <div className="px-8 py-6 relative">
          {/* Header 背景渐变 */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">💬</span>
              Comments
            </h2>
            <p className="text-white/80 text-sm mt-1">Share your thoughts and experiences</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 relative">
          <div className="text-center py-12">
            {/* 动画图标 */}
            <div className="relative inline-block mb-6">
              <div className="text-8xl opacity-30 text-white animate-pulse">💬</div>
              <div className="absolute inset-0 text-8xl opacity-20 text-purple-300 animate-ping"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Comments Coming Soon
            </h3>
            <p className="text-white/80 mb-8 max-w-md mx-auto leading-relaxed">
              We&apos;re building a better communication experience for you. 
              <br />Stay tuned for an amazing comment system!
            </p>
            
            {/* 美化的 Coming Soon 按钮 */}
            <div className="inline-flex items-center gap-3">
              <button 
                disabled
                className="relative overflow-hidden bg-white/10 backdrop-blur-sm text-white/70 px-8 py-4 rounded-2xl font-medium cursor-not-allowed border border-white/20 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20"></div>
                <div className="relative flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Coming Soon
                </div>
              </button>
            </div>
            
            {/* 装饰性提示 */}
            <div className="mt-8 flex items-center justify-center gap-2 text-white/60">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/30"></div>
              <span className="text-sm font-medium px-4">Feature in Development</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/30"></div>
            </div>
          </div>
        </div>
        
        {/* 底部装饰光效 */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        
        {/* 微光效果 */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      </div>
    </div>
  );
}

// Related Tools section component
function RelatedToolsSection({ tool }: { tool: Tool }) {
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedTools() {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('category', tool.category)
          .neq('id', tool.id)
          .limit(4);

        if (error) {
          throw error;
        }

        setRelatedTools(data || []);
      } catch (err) {
        console.error('Error fetching related tools:', err);
      } finally {
        setLoading(false);
      }
    }

    if (tool.category) {
      fetchRelatedTools();
    } else {
      setLoading(false);
    }
  }, [tool.category, tool.id]);

  if (!tool.category) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-600/30 via-purple-700/20 to-indigo-600/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden sticky top-8">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          🔗 Related Tools
        </h2>
        <p className="text-purple-100 text-sm mt-1">
          More tools in {tool.category}
        </p>
      </div>
      
      <div className="p-6 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-indigo-500/20">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : relatedTools.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4 opacity-30">🔍</div>
            <p className="text-purple-200 text-sm">
              No related tools found in this category yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {relatedTools.map((relatedTool) => (
              <Link
                key={relatedTool.id}
                href={`/tool/${relatedTool.id}`}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                    <ToolLogo 
                      name={relatedTool.name}
                      logo={relatedTool.logo || undefined}
                      size="sm"
                      className="w-10 h-10"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-purple-200 transition-colors truncate">
                    {relatedTool.name}
                  </h3>
                  <p className="text-purple-200 text-sm overflow-hidden leading-relaxed" style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {relatedTool.description || 'No description available'}
                  </p>
                  {relatedTool.pricing && (
                    <span className="inline-flex items-center mt-1 text-xs font-medium text-purple-300">
                      💰 {relatedTool.pricing}
                    </span>
                  )}
                </div>
              </Link>
            ))}
            
            {/* View More Link */}
            <div className="pt-4 border-t border-white/20">
              <Link
                href={`/category/${encodeURIComponent(tool.category)}`}
                className="block text-center text-purple-200 hover:text-white font-medium text-sm py-2 transition-colors"
              >
                View All Tools in {tool.category} →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component
function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/90">Loading tool details...</p>
      </div>
    </div>
  );
}

// Not found component
function ToolNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center">
      <div className="text-center px-4 max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-white mb-4">Tool Not Found</h1>
        <p className="text-white/80 mb-8">
          Sorry, the AI tool you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="space-x-4">
          <Link 
            href="/tools"
            className="inline-block bg-white text-purple-700 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors font-medium"
          >
            Browse All Tools
          </Link>
          <Link 
            href="/"
            className="inline-block border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ToolPage() {
  const params = useParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTool() {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }

        setTool(data);
      } catch (err) {
        console.error('Error fetching tool:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchTool();
    }
  }, [params.id]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !tool) {
    return <ToolNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
      {/* 统一的 Header 组件 */}
      <Header />
      
      {/* 优化的面包屑导航 - 与Header对齐 */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* 左侧 - Back to Tools，与 ToolVerse logo 对齐 */}
            <div className="flex items-center">
              <Link 
                href="/tools"
                className="flex items-center text-white/90 hover:text-white transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Tools</span>
              </Link>
            </div>
            
            {/* 右侧 - Tool Details，与 Submit Tool 对齐 */}
            <div className="flex items-center">
              <span className="text-white/80 font-medium">Tool Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left Column - Tool Details (70%) */}
          <div className="lg:col-span-7">
            {/* Tool Details Card */}
            <div className="bg-gradient-to-br from-purple-600/30 via-purple-700/20 to-indigo-600/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-8">
                <div className="flex items-start gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden">
                      <ToolLogo 
                        name={tool.name}
                        logo={tool.logo || undefined}
                        size="lg"
                        className="w-20 h-20"
                      />
                    </div>
                  </div>

                  {/* Tool Info */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-4xl font-bold text-white mb-3">
                      {tool.name}
                    </h1>
                    
                    {/* Category and Pricing Badges */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      {tool.category && (
                        <Link
                          href={`/category/${encodeURIComponent(tool.category)}`}
                          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors"
                        >
                          <span className="text-lg">{getCategoryIcon(tool.category)}</span>
                          {tool.category}
                        </Link>
                      )}
                      
                      {tool.pricing && (
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getPricingBadgeStyle(tool.pricing)}`}>
                          💰 {tool.pricing}
                        </span>
                      )}
                    </div>

                    <p className="text-white/90 text-lg leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - 紫色渐变背景 */}
              <div className="p-8 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-indigo-500/20">
                <div className="space-y-8">
                  {/* Features */}
                  {tool.features && tool.features.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tool.features.slice(0, 8).map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                            <span className="text-purple-100">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {tool.tags && tool.tags.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Related Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.slice(0, 10).map((tag, index) => (
                          <span 
                            key={index}
                            className="bg-white/20 text-purple-100 px-4 py-2 rounded-full text-sm font-medium border border-white/30 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tool Information */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Tool Information</h3>
                    <div className="bg-gradient-to-br from-purple-400/30 via-purple-500/20 to-indigo-400/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Official Website */}
                        {tool.website && (
                          <div>
                            <h4 className="text-sm font-semibold text-purple-200 mb-2">OFFICIAL WEBSITE</h4>
                            <a
                              href={tool.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                            >
                              Visit Website
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        )}

                        {/* Added Date */}
                        <div>
                          <h4 className="text-sm font-semibold text-purple-200 mb-2">ADDED TO DIRECTORY</h4>
                          <p className="text-white font-medium">
                            {new Date(tool.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <CommentsSection />
            </div>
          </div>

          {/* Right Column - Related Tools (30%) */}
          <div className="lg:col-span-3">
            <RelatedToolsSection tool={tool} />
          </div>
        </div>
      </main>
    </div>
  );
}