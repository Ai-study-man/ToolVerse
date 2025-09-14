import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getCategoryIcon } from '@/utils/categoryIcons';

// 简化的工具数据类型
interface ToolData {
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

// 获取定价标签样式
function getPricingBadgeStyle(pricing: string) {
  const lowerPricing = pricing.toLowerCase();
  if (lowerPricing.includes('free')) {
    return 'bg-green-500/20 text-green-200 border-green-400/30';
  } else if (lowerPricing.includes('paid')) {
    return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
  } else if (lowerPricing.includes('freemium')) {
    return 'bg-purple-500/20 text-purple-200 border-purple-400/30';
  }
  return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
}

// 404 组件
function ToolNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-64 h-64 mx-auto mb-8 text-white/20">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09m6.291-4.09L12 12m0 0l-1 1m1-1l1 1" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Tool Not Found</h1>
        <p className="text-xl text-white/80 mb-8 max-w-md mx-auto">
          Sorry, the AI tool you're looking for doesn't exist or has been removed.
        </p>
        <div className="space-x-4">
          <Link 
            href="/tools"
            className="inline-block bg-accent-600 text-white px-8 py-3 rounded-lg hover:bg-accent-700 transition-colors font-medium"
          >
            Browse All Tools
          </Link>
          <Link 
            href="/"
            className="inline-block bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/20"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// 获取工具数据
async function getToolData(id: string): Promise<ToolData | null> {
  try {
    const { data: tools, error } = await supabase
      .from('tools')
      .select('*');
      
    if (error) {
      console.error('Error fetching tools:', error);
      return null;
    }
    
    // 首先按ID查找
    let tool = tools?.find(t => t.id === id);
    
    // 如果按ID没找到，尝试按名称匹配（用于 slug 形式的 URL）
    if (!tool) {
      const searchName = id.toLowerCase()
        .replace(/-/g, ' ')
        .replace(/\./g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      tool = tools?.find(t => {
        const toolName = t.name.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        return toolName === searchName || toolName.includes(searchName);
      });
    }
    
    if (!tool) {
      return null;
    }
    
    return {
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
    };
  } catch (error) {
    console.error('Error in getToolData:', error);
    return null;
  }
}

// 页面参数类型
interface PageProps {
  params: { id: string };
}

// 生成静态页面参数
export async function generateStaticParams() {
  try {
    const { data: tools } = await supabase
      .from('tools')
      .select('id');
    
    return tools?.map((tool) => ({
      id: tool.id,
    })) || [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = await getToolData(params.id);
  
  if (!tool) {
    return {
      title: 'Tool Not Found | ToolVerse',
      description: 'The AI tool you are looking for does not exist or has been removed.'
    };
  }
  
  return {
    title: `${tool.name} | ToolVerse AI Tools Directory`,
    description: tool.description || `Discover ${tool.name} - a powerful AI tool in the ${tool.category} category.`,
    keywords: [
      tool.name,
      tool.category || '',
      'AI Tools',
      'AI Assistant',
      'Artificial Intelligence',
      ...(tool.tags || [])
    ].filter(Boolean).join(', '),
    openGraph: {
      title: tool.name,
      description: tool.description || '',
      images: tool.logo ? [{ url: tool.logo, alt: tool.name }] : [],
      type: 'website',
    },
  };
}

// 主页面组件
export default async function ToolDetailPage({ params }: PageProps) {
  // 获取工具数据
  const tool = await getToolData(params.id);
  
  // 如果工具不存在，显示404页面
  if (!tool) {
    return <ToolNotFound />;
  }

  // 获取相关工具（同分类的其他工具）
  let relatedTools: ToolData[] = [];
  try {
    if (tool.category) {
      const { data: relatedData } = await supabase
        .from('tools')
        .select('*')
        .eq('category', tool.category)
        .neq('id', tool.id)
        .limit(3);
      
      if (relatedData) {
        relatedTools = relatedData.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description || '',
          logo: t.logo,
          website: t.website,
          category: t.category,
          pricing: t.pricing,
          tags: t.tags,
          features: t.features,
          created_at: t.created_at || new Date().toISOString()
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching related tools:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-bold">T</span>
              </div>
              <span className="text-white font-bold text-xl">ToolVerse</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/tools" className="text-white/80 hover:text-white transition-colors">
                All Tools
              </Link>
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
            {tool.category && (
              <>
                <span className="text-white/40">/</span>
                <Link 
                  href={`/category/${encodeURIComponent(tool.category)}`}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {getCategoryIcon(tool.category)} {tool.category}
                </Link>
              </>
            )}
            <span className="text-white/40">/</span>
            <span className="text-white">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左侧主要信息 */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 工具头部信息 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                {/* 工具logo */}
                <div className="flex-shrink-0">
                  {tool.logo ? (
                    <Image
                      src={tool.logo}
                      alt={tool.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-2xl object-contain bg-white/20 p-2"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {tool.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* 工具基本信息 */}
                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-white mb-3">{tool.name}</h1>
                    <p className="text-lg text-white/90 leading-relaxed">
                      {tool.description || 'No description available'}
                    </p>
                  </div>
                  
                  {/* 标签和分类 */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {tool.category && (
                      <Link
                        href={`/category/${encodeURIComponent(tool.category)}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-500/20 text-secondary-200 border border-secondary-400/30 hover:bg-secondary-500/30 transition-colors"
                      >
                        {getCategoryIcon(tool.category)} {tool.category}
                      </Link>
                    )}
                    {tool.pricing && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPricingBadgeStyle(tool.pricing)}`}>
                        💰 {tool.pricing}
                      </span>
                    )}
                  </div>
                  
                  {/* 快速操作按钮 */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {tool.website && (
                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors font-medium"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit Website
                      </a>
                    )}
                    <Link
                      href={`/category/${encodeURIComponent(tool.category || '')}`}
                      className="inline-flex items-center justify-center bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/20"
                    >
                      View Similar Tools
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 功能特性 */}
            {tool.features && tool.features.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex-shrink-0 w-6 h-6 bg-accent-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white/90 leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 标签 */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Related Tags
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tool.tags.map((tag: string, index: number) => (
                    <Link
                      key={index}
                      href={`/tools?search=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-white/80 border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 工具信息卡片 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tool Information</h3>
              <dl className="space-y-4">
                {tool.category && (
                  <div>
                    <dt className="text-sm font-medium text-white/60 mb-1">Category</dt>
                    <dd>
                      <Link 
                        href={`/category/${encodeURIComponent(tool.category)}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-500/20 text-secondary-200 hover:bg-secondary-500/30 transition-colors"
                      >
                        {tool.category}
                      </Link>
                    </dd>
                  </div>
                )}
                
                {tool.pricing && (
                  <div>
                    <dt className="text-sm font-medium text-white/60 mb-1">Pricing Model</dt>
                    <dd className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPricingBadgeStyle(tool.pricing)}`}>
                      {tool.pricing}
                    </dd>
                  </div>
                )}
                
                {tool.website && (
                  <div>
                    <dt className="text-sm font-medium text-white/60 mb-1">Official Website</dt>
                    <dd>
                      <a 
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-400 hover:text-accent-300 text-sm break-all"
                      >
                        {tool.website.replace(/^https?:\/\//, '')}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* 相关工具 */}
            {relatedTools.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Related Tools</h3>
                <div className="space-y-4">
                  {relatedTools.map((relatedTool) => (
                    <Link
                      key={relatedTool.id}
                      href={`/tools/${relatedTool.id}`}
                      className="block group"
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                        {relatedTool.logo ? (
                          <Image
                            src={relatedTool.logo}
                            alt={relatedTool.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg object-contain bg-white/20 p-1 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">
                              {relatedTool.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-accent-300 transition-colors">
                            {relatedTool.name}
                          </p>
                          <p className="text-xs text-white/60 truncate">
                            {relatedTool.description || 'No description available'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Link 
                    href={`/category/${encodeURIComponent(tool.category || '')}`}
                    className="text-sm text-accent-400 hover:text-accent-300 font-medium"
                  >
                    View more {getCategoryIcon(tool.category || '')} {tool.category} tools →
                  </Link>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Discover More</h3>
              <p className="text-sm text-white/60 mb-4">
                Explore more quality AI tools to boost your productivity.
              </p>
              <div className="space-y-2">
                <Link 
                  href="/tools"
                  className="block w-full text-center bg-white/5 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium border border-white/20"
                >
                  Browse All Tools
                </Link>
                <Link 
                  href="/"
                  className="block w-full text-center bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
