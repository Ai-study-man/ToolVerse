'use client';

import ToolLogo from '@/components/ToolLogo';

export default function TestMarketingLogos() {
  const marketingTools = [
    { name: 'Alli AI', description: 'AI-powered SEO automation platform' },
    { name: 'Clearscope', description: 'Content optimization and SEO tool' },
    { name: 'Frase', description: 'AI content research and optimization' },
    { name: 'Surfer SEO', description: 'Data-driven content optimization' }
  ];

  const newLogoTools = [
    { name: 'DALL-E 2', description: 'OpenAI image generation AI', category: 'Image Generation' },
    { name: 'Midjourney', description: 'AI image generation platform', category: 'Image Generation' },
    { name: 'Blackbox AI', description: 'AI code assistant', category: 'Code Development' },
    { name: 'Replit AI', description: 'AI-powered coding platform', category: 'Code Development' },
    { name: 'Copy.ai', description: 'AI content writing assistant', category: 'Business & Productivity' },
    { name: 'Canva AI', description: 'AI-powered design platform', category: 'Image Generation' },
    { name: 'Writesonic', description: 'AI writing and content creation', category: 'Writing & Content' },
    { name: 'Rytr', description: 'AI writing assistant', category: 'Writing & Content' },
    { name: 'ContentBot', description: 'AI content creation tool', category: 'Writing & Content' },
    { name: 'Crystal', description: 'Personality AI for sales', category: 'Business & Analytics' },
    { name: 'Qlik Sense AI', description: 'AI-powered business intelligence', category: 'Business & Analytics' },
    { name: 'Medallia', description: 'Customer experience AI platform', category: 'Business & Analytics' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          AI工具官方Logo展示 - 完整测试
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">营销与SEO工具 - 官方Logo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketingTools.map((tool) => (
              <div key={tool.name} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <ToolLogo name={tool.name} size="lg" />
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">新增官方Logo展示</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newLogoTools.map((tool) => (
              <div key={tool.name} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <ToolLogo name={tool.name} size="md" />
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{tool.category}</p>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">不同尺寸测试</h2>
          
          {marketingTools.map((tool) => (
            <div key={tool.name} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-4 text-gray-900">{tool.name}</h3>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <ToolLogo name={tool.name} size="sm" />
                  <p className="text-xs text-gray-500 mt-1">Small</p>
                </div>
                <div className="text-center">
                  <ToolLogo name={tool.name} size="md" />
                  <p className="text-xs text-gray-500 mt-1">Medium</p>
                </div>
                <div className="text-center">
                  <ToolLogo name={tool.name} size="lg" />
                  <p className="text-xs text-gray-500 mt-1">Large</p>
                </div>
                <div className="text-center">
                  <ToolLogo name={tool.name} size="xl" />
                  <p className="text-xs text-gray-500 mt-1">Extra Large</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
