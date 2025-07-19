'use client';

import { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import ToolLogo from '../../../components/ToolLogo';
import { Tool } from '../../../types';
import { logViewTool, logVisitWebsite } from '../../../lib/userBehaviorService';

// 临时禁用DataSyncService导入，使用本地状态
// import DataSyncService from '../../../lib/dataSyncService';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ToolDetailClient({ params }: PageProps) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // 从API获取工具信息
    const fetchTool = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`获取工具详情: ${params.id}`);
        
        // 从API获取所有工具数据
        const response = await fetch('/api/tools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        
        const tools = await response.json();
        const foundTool = tools.find((t: Tool) => t.id === params.id);
        
        if (!foundTool) {
          throw new Error('Tool not found');
        }
        
        setTool(foundTool);
        console.log(`成功获取工具详情:`, foundTool.name);
        
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
  const handleVisitWebsite = () => {
    if (tool) {
      const userId = 'guest-user'; // 暂时使用访客用户，后续替换为真实用户ID
      logVisitWebsite(userId, tool.id, 'tool-detail-page')
        .catch(error => console.error('Failed to log website visit:', error));
      
      // 在新标签页中打开
      window.open(tool.website, '_blank', 'noopener,noreferrer');
    }
  };

  // 如果还在服务端渲染阶段，显示加载状态
  if (!isClient) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 px-4 py-8">
          <div className="container mx-auto">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-gray-500">Loading...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 加载状态
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 px-4 py-8">
          <div className="container mx-auto">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-gray-500">Loading tool details...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 错误状态
  if (error || !tool) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 px-4 py-8">
          <div className="container mx-auto">
            <div className="flex flex-col justify-center items-center min-h-[400px]">
              <div className="text-red-500 text-xl mb-4">Tool not found</div>
              <button 
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="flex justify-center mb-6">
              <ToolLogo 
                logo={tool.logo} 
                name={tool.name} 
                size="lg"
                className="bg-white/10 backdrop-blur-sm border border-white/20" 
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{tool.name}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {tool.description}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={handleVisitWebsite}
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg"
              >
                Visit Website
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors duration-200 border border-blue-400"
              >
                Back to Tools
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {tool.name}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Features Section */}
              {tool.features && tool.features.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                  <ul className="space-y-3">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="text-gray-900 font-medium">{tool.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pricing</span>
                    <span className="text-gray-900 font-medium">{tool.pricing}</span>
                  </div>
                  {tool.tags && tool.tags.length > 0 && (
                    <div>
                      <span className="text-gray-600 block mb-2">Tags</span>
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Ready to get started?</h3>
                <p className="text-blue-100 mb-4 text-sm">
                  Visit {tool.name} to explore all features and capabilities.
                </p>
                <button
                  onClick={handleVisitWebsite}
                  className="w-full px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  Visit {tool.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
