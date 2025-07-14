'use client';

import { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import ToolLogo from '../../../components/ToolLogo';
import DataSyncService from '../../../lib/dataSyncService';
import { Tool } from '../../../types';
import { logViewTool, logVisitWebsite } from '../../../lib/userBehaviorService';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ToolDetailPage({ params }: PageProps) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // 通过API获取工具信息
    const fetchTool = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`获取工具详情: ${params.id}`);
        const response = await fetch(`/api/tools/${params.id}`, {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          console.error(`API请求失败: ${response.status}`);
          setError('Tool not found');
          setTool(null);
          return;
        }
        
        const result = await response.json();
        
        if (!result.success) {
          console.error('API返回错误:', result.error);
          setError('Tool not found');
          setTool(null);
          return;
        }
        
        const foundTool = result.data.tool;
        setTool(foundTool);
        console.log(`成功获取工具: ${foundTool.name}`);
        
        // 记录访问工具详情页的行为
        if (foundTool) {
          const userId = 'guest-user'; // 暂时使用访客用户，后续替换为真实用户ID
          const searchQuery = new URLSearchParams(window.location.search).get('from_search');
          const sourcePage = document.referrer.includes('/tools') ? 'tools-page' : 
                            document.referrer.includes('/search') ? 'search-results' :
                            document.referrer === '' ? 'direct' : 'external';
          
          logViewTool(userId, foundTool.id, sourcePage, searchQuery || undefined)
            .catch(error => console.error('Failed to log tool view:', error));
        }
      } catch (error) {
        console.error('Error fetching tool:', error);
        setError('Failed to load tool');
        setTool(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [params.id]);

  // 处理访问官网的点击事件
  const handleVisitWebsite = (toolId: string, website: string) => {
    const userId = 'guest-user'; // 暂时使用访客用户
    
    // 记录访问官网行为
    logVisitWebsite(userId, toolId, 'tool-detail-page')
      .catch(error => console.error('Failed to log website visit:', error));
    
    // 打开工具官网
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  // 在客户端渲染之前显示加载状态
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-20 h-20 bg-gray-300 rounded-xl animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 只有在确实发生错误或工具未找到时才显示错误页面
  if (error || (!loading && !tool)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Tool not found</h1>
            <p className="text-gray-600 mt-2">The requested tool could not be found.</p>
            <a 
              href="/tools"
              className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Tools
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 确保 tool 不为 null 才渲染内容
  if (!tool) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-shrink-0">
              <ToolLogo 
                name={tool.name}
                logo={tool.logo}
                size="xl"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    tool.pricingModel === 'free' 
                      ? 'bg-accent-100 text-accent-800'
                      : tool.pricingModel === 'freemium'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {tool.pricingModel === 'free' ? 'Free' : 
                     tool.pricingModel === 'freemium' ? 'Freemium' : 'Paid'}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">{tool.pricing}</span>
                </div>
              </div>
              
              <p className="text-lg text-gray-600 mb-4">{tool.shortDescription}</p>
              
              <div className="flex items-center space-x-6 mb-6" suppressHydrationWarning>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(tool.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg text-gray-600 ml-2">
                    {tool.rating} ({tool.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{tool.category}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6" suppressHydrationWarning>
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                onClick={(e) => {
                  // 记录访问官网行为，但不阻止默认行为
                  const userId = 'guest-user'; // 暂时使用访客用户
                  logVisitWebsite(userId, tool.id, 'tool-detail-page')
                    .catch(error => console.error('Failed to log website visit:', error));
                }}
              >
                Visit Website
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {tool.name}</h2>
              <p className="text-gray-700 leading-relaxed">{tool.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <ul className="space-y-3" suppressHydrationWarning>
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-accent-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
              <div className="text-center py-8 text-gray-500">
                <p>Reviews coming soon!</p>
                <p className="text-sm mt-2">Be the first to review this tool.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900">{tool.category}</dd>
                </div>
                {tool.subcategory && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Subcategory</dt>
                    <dd className="text-sm text-gray-900">{tool.subcategory}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Pricing Model</dt>
                  <dd className="text-sm text-gray-900 capitalize">{tool.pricingModel}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rating</dt>
                  <dd className="text-sm text-gray-900">{tool.rating}/5.0</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Reviews</dt>
                  <dd className="text-sm text-gray-900">{tool.reviewCount}</dd>
                </div>
              </dl>
            </div>

            {/* Related Tools Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Tools</h3>
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Related tools coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
