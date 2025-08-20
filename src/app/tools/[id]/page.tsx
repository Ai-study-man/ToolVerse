import DataSyncService from '../../../lib/dataSyncService';
import Header from '../../../components/Header';
import ToolImage from '../../../components/ToolImage';
import EnhancedToolActions from '../../../components/EnhancedToolActions';
import ReviewSection from '../../../components/ReviewSection';
import UseCaseSection from '../../../components/UseCaseSection';
import ToolComparison from '../../../components/ToolComparison';
import PricingDisplay from '../../../components/PricingDisplay';
import { SidebarBanner, ContentBanner } from '../../../components/AdBanner';
import StructuredData from '../../../components/StructuredData';
import { generateToolMetadata } from '../../../lib/seoConfig';
import { Tool } from '../../../types';
import { Metadata } from 'next';

// 生成动态元数据
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const tools = await DataSyncService.getTools();
    const tool = tools.find(t => t.id === params.id);
    
    if (!tool) {
      return {
        title: '工具未找到 | ToolVerse',
        description: '抱歉，您访问的AI工具页面不存在。',
      };
    }

    return generateToolMetadata(tool);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '工具详情 | ToolVerse',
      description: 'ToolVerse - 发现最佳AI工具',
    };
  }
}

// 生成所有工具的静态参数
export async function generateStaticParams() {
  try {
    const tools = await DataSyncService.getTools();
    return tools.map((tool) => ({
      id: tool.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  // 在构建时获取工具数据
  let tool: Tool | null = null;
  let relatedTools: Tool[] = [];
  try {
    const tools = await DataSyncService.getTools();
    console.log(`🔍 [Tool Detail] Looking for tool with ID: ${params.id}`);
    console.log(`📊 [Tool Detail] Total tools available: ${tools.length}`);
    
    // 首先按ID查找
    tool = tools.find(t => t.id === params.id) || null;
    
    // 如果按ID没找到，尝试按名称查找
    if (!tool) {
      const searchName = params.id.toLowerCase()
        .replace(/-/g, ' ')      // 将 - 替换为空格
        .replace(/\./g, '')      // 移除点号
        .replace(/\s+/g, ' ')    // 标准化空格
        .trim();
      
      tool = tools.find(t => {
        const toolName = t.name.toLowerCase()
          .replace(/\s+/g, ' ')  // 标准化空格
          .replace(/\./g, '')    // 移除点号
          .trim();
        
        // 尝试多种匹配方式
        return toolName === searchName || 
               toolName.includes(searchName) ||
               searchName.includes(toolName) ||
               toolName.replace(/\s/g, '') === searchName.replace(/\s/g, ''); // 无空格匹配
      }) || null;
      
      if (tool) {
        console.log(`✅ [Tool Detail] Found tool by name matching: "${tool.name}" (ID: ${tool.id})`);
      }
    }
    
    if (!tool) {
      console.log(`❌ [Tool Detail] Tool not found for ID: ${params.id}`);
      console.log(`🔍 [Tool Detail] Available tool IDs:`, tools.slice(0, 10).map(t => ({ name: t.name, id: t.id })));
    } else {
      console.log(`✅ [Tool Detail] Tool found: ${tool.name}`);
    }
    
    // 获取相关工具（同分类的其他工具）
    if (tool) {
      relatedTools = tools
        .filter(t => t.category === tool?.category && t.id !== tool?.id)
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Error fetching tool:', error);
  }

  // 如果工具不存在，显示404页面
  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-64 h-64 mx-auto mb-8 text-gray-300">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09m6.291-4.09L12 12m0 0l-1 1m1-1l1 1" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">Sorry, the AI tool you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <div className="space-x-4">
              <a 
                href="/tools"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Browse All Tools
              </a>
              <a 
                href="/"
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 获取定价模型的标签样式
  const getPricingBadgeStyle = (pricing: string) => {
    const lowerPricing = pricing.toLowerCase();
    if (lowerPricing.includes('free')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (lowerPricing.includes('paid')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (lowerPricing.includes('freemium')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 获取评分星星
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* SEO结构化数据 */}
      <StructuredData 
        type="tool" 
        data={{
          name: tool.name,
          description: tool.description,
          category: tool.category,
          pricing: tool.pricing,
          rating: tool.rating,
          tags: tool.tags,
          logo: tool.logo,
          website: tool.website,
          pricingModel: tool.pricingModel
        }} 
      />
      
      {/* 面包屑导航 - 紧凑版 */}
      <div className="bg-gray-50/50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-xs">
              <li>
                <a href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-300 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <a href="/tools" className="text-gray-400 hover:text-gray-600 transition-colors">
                    Tools
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-300 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <a href={`/tools?category=${encodeURIComponent(tool.category)}`} className="text-gray-400 hover:text-gray-600 transition-colors truncate max-w-24">
                    {tool.category}
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-300 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 font-medium truncate max-w-32">
                    {tool.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左侧主要信息 */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 工具头部信息 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  {/* 工具logo */}
                  <div className="flex-shrink-0">
                    <ToolImage
                      src={tool.logo}
                      alt={tool.name}
                      name={tool.name}
                      className="w-24 h-24 rounded-2xl object-contain shadow-lg border border-gray-100"
                    />
                  </div>
                  
                  {/* 工具基本信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
                        <p className="text-lg text-gray-600 leading-relaxed">{tool.description}</p>
                      </div>
                      
                      {/* 评分和分类 */}
                      <div className="flex flex-col items-start sm:items-end space-y-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(tool.rating || 0)}
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {tool.rating || 0}/5.0
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPricingBadgeStyle(tool.pricing || '')}`}>
                          {tool.pricing || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    {/* 快速操作按钮 */}
                    <EnhancedToolActions tool={{
                      name: tool.name,
                      website: tool.website,
                      description: tool.description,
                      pricing: tool.pricing
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 功能特性 */}
            {tool.features && tool.features.length > 0 && (
              <div id="features" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 交互式标签 */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Explore Similar Tools
                </h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Click on any tag below to discover more AI tools with similar capabilities
                </p>
                <div className="flex flex-wrap gap-3">
                  {tool.tags.map((tag, index) => (
                    <a
                      key={index}
                      href={`/tools?search=${encodeURIComponent(tag)}`}
                      className="group inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border border-primary-200 hover:from-primary-100 hover:to-secondary-100 hover:border-primary-300 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                    >
                      <svg className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      #{tag}
                      <svg className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
                
                {/* 添加快速操作 */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`/tools?category=${encodeURIComponent(tool.category)}`}
                      className="flex-1 text-center bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      More {tool.category} Tools
                    </a>
                    <a
                      href="/tools"
                      className="flex-1 text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      Browse All Tools
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 使用场景说明 */}
            <UseCaseSection tool={tool} />

            {/* 价格信息和方案对比 */}
            <div id="pricing">
              <PricingDisplay tool={tool} className="mt-8" />
            </div>

            {/* 同类工具对比 */}
            <div id="alternatives">
              <ToolComparison 
                currentTool={tool} 
                relatedTools={relatedTools}
              />
            </div>

            {/* 用户评论和评分系统 */}
            <div id="reviews">
              <ReviewSection 
                toolId={tool.id} 
                toolName={tool.name}
                className="mt-8"
              />
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 工具信息卡片 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Information</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Category</dt>
                  <dd>
                    <a 
                      href={`/tools?category=${encodeURIComponent(tool.category)}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-50 text-secondary-700 hover:bg-secondary-100 transition-colors"
                    >
                      {tool.category}
                    </a>
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Pricing Model</dt>
                  <dd className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPricingBadgeStyle(tool.pricing || '')}`}>
                    {tool.pricing || 'N/A'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">User Rating</dt>
                  <dd className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(tool.rating || 0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {tool.rating || 0}/5.0
                    </span>
                  </dd>
                </div>
                
                {tool.website && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Official Website</dt>
                    <dd>
                      <a 
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm break-all"
                      >
                        {tool.website.replace(/^https?:\/\//, '')}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* 快速导航 - 移到侧边栏 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="text-base font-semibold text-blue-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Navigation
              </h3>
              <div className="space-y-2 text-sm">
                <a href="#pricing" className="block text-blue-700 hover:text-blue-900 py-1 hover:bg-blue-100 px-2 rounded transition-colors">
                  • Pricing & Plans
                </a>
                <a href="#features" className="block text-blue-700 hover:text-blue-900 py-1 hover:bg-blue-100 px-2 rounded transition-colors">
                  • Key Features
                </a>
                <a href="#reviews" className="block text-blue-700 hover:text-blue-900 py-1 hover:bg-blue-100 px-2 rounded transition-colors">
                  • User Reviews
                </a>
                <a href="#alternatives" className="block text-blue-700 hover:text-blue-900 py-1 hover:bg-blue-100 px-2 rounded transition-colors">
                  • Alternatives
                </a>
              </div>
            </div>

            {/* 相关工具 */}
            {relatedTools.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Tools</h3>
                <div className="space-y-4">
                  {relatedTools.map((relatedTool) => (
                    <a
                      key={relatedTool.id}
                      href={`/tools/${relatedTool.id}`}
                      className="block group"
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <ToolImage
                          src={relatedTool.logo}
                          alt={relatedTool.name}
                          name={relatedTool.name}
                          className="w-10 h-10 rounded-lg object-contain flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                            {relatedTool.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {relatedTool.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a 
                    href={`/tools?category=${encodeURIComponent(tool.category)}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View More {tool.category} Tools →
                  </a>
                </div>
              </div>
            )}

            {/* 操作提示 */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Find This Helpful?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If this tool has been helpful to you, please consider sharing it with others or exploring more similar AI tools.
              </p>
              <div className="space-y-2">
                <a 
                  href="/tools"
                  className="block w-full text-center bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200"
                >
                  Explore More Tools
                </a>
                <a 
                  href="/"
                  className="block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </div>

          {/* 内容中间广告 */}
          <div className="lg:col-span-2">
            <div className="my-8">
              <div className="text-center mb-4">
                <span className="text-xs text-gray-400 uppercase tracking-wide">Advertisement</span>
              </div>
              <ContentBanner />
            </div>
          </div>
        </div>

        {/* 侧边栏广告 */}
        <div className="mt-8 lg:mt-0">
          <div className="text-center mb-4">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Advertisement</span>
          </div>
          <SidebarBanner />
        </div>
      </div>
    </div>
  );
}
