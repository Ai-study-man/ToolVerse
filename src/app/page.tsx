'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import AdvancedSearchBar from '../components/AdvancedSearchBar';
import ToolCard from '../components/ToolCard';
import OptimizedToolCard from '../components/OptimizedToolCard';
import CategoryCard from '../components/CategoryCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import InternalLinks from '../components/InternalLinks';
import { ContentBanner, FooterBanner } from '../components/AdBanner';
import StructuredData from '../components/StructuredData';
import BlogPreview from '../components/blog/BlogPreview';
import GlobalLayout from '../components/GlobalLayout';
import SuperSearchBar from '../components/SuperSearchBar';
import SmartToolGrid from '../components/SmartToolGrid';
import LatestToolsGrid from '../components/LatestToolsGrid';
import { useTools } from '../hooks/useTools';
import { navigateToUrl } from '../lib/navigation';
import { getCategoryIcon, getCategoriesWithIcons, mapToUnifiedCategory } from '../utils/categoryIcons';
import Hero3DImage from '../components/Hero3DImage';
import { Tool, Category } from '../types/tool';

// 动态导入非关键组件
const ToolGrid = dynamic(() => import('../components/ToolGrid'), {
  loading: () => <LoadingSkeleton variant="featured" count={6} />
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  
  // 使用新的 useTools hook 获取所有工具
  const { data: allTools, loading, error } = useTools();
  
  // 调试日志：监控首页数据状态
  useEffect(() => {
    console.log('[HomePage] 数据状态更新:', {
      toolsCount: allTools?.length || 0,
      loading,
      error,
      hasData: !!allTools,
      timestamp: new Date().toISOString()
    });
  }, [allTools, loading, error]);
  
  // 获取分类描述的辅助函数 - 更新为11个核心分类
  const getDescriptionForCategory = (categoryName: string): string => {
    const descriptions: Record<string, string> = {
      'Writing & Content': 'AI tools for content creation, writing assistance, and copywriting',
      'Image Generation & Design': 'AI-powered design tools, image generation, and creative assistance',
      'Video & Audio': 'AI tools for video editing, creation, and multimedia production',
      'Chatbots & Assistants': 'AI chatbots, virtual assistants, and conversational AI',
      'Productivity': 'AI tools to enhance workflow, automation, and efficiency',
      'Developer Tools': 'AI coding assistants, debugging tools, and development productivity',
      'Education & Learning': 'AI-powered learning platforms, tutoring, and educational resources',
      'Healthcare & Legal': 'AI applications for healthcare, medical analysis, legal tools, and compliance',
      'Research & Analysis': 'AI-powered research tools, data analysis, and business intelligence',
      'Marketing & SEO': 'AI-driven marketing tools, analytics, and campaign optimization',
      'Other': 'General-purpose AI utilities and miscellaneous tools'
    };
    return descriptions[categoryName] || `AI tools and solutions for ${categoryName.toLowerCase()}`;
  };
  
  // 使用11个统一分类替代从数据库提取的分类
  const unifiedCategories = useMemo(() => {
    if (!allTools || allTools.length === 0) return [];
    
    // 获取11个核心分类
    const coreCategories = getCategoriesWithIcons();
    
    // 统计每个统一分类的工具数量
    const categoryCount: Record<string, number> = {};
    
    allTools.forEach(tool => {
      // 使用智能分类系统来确定工具的统一分类
      const unifiedCategory = mapToUnifiedCategory({
        name: tool.name,
        description: tool.description || '',
        category: tool.category
      });
      categoryCount[unifiedCategory] = (categoryCount[unifiedCategory] || 0) + 1;
    });
    
    // 创建分类对象，按预定义顺序排列
    return coreCategories.map((category, index) => ({
      id: (index + 1).toString(),
      name: category.name,
      description: getDescriptionForCategory(category.name),
      slug: category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
      toolCount: categoryCount[category.name] || 0
    }));
  }, [allTools]);
  
  // 从所有工具中提取前6个作为特色工具
  const featuredTools = useMemo(() => {
    if (!allTools || allTools.length === 0) return [];
    return allTools.slice(0, 6).map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description || 'No description available',
      shortDescription: tool.description?.substring(0, 100) + '...' || 'No description available',
      logo: tool.logo || '',
      website: tool.website || '',
      category: tool.category || 'Other',
      subcategory: undefined,
      pricingModel: tool.pricing?.toLowerCase().includes('free') 
        ? (tool.pricing.includes('$') ? 'freemium' : 'free')
        : 'paid' as 'free' | 'paid' | 'freemium',
      pricing: tool.pricing || 'Pricing TBD',
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      tags: tool.tags || [],
      features: tool.features || [],
      useCases: undefined,
      modelUsed: undefined,
      createdAt: tool.created_at || new Date().toISOString(),
      likes: undefined,
      views: undefined,
      developer: undefined,
      reviews: undefined,
      lastUpdated: undefined
    }));
  }, [allTools]);

  useEffect(() => {
    setIsClient(true);
    
    // 使用统一的分类数据
    setCategoriesData(unifiedCategories);
  }, [unifiedCategories]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const url = `/tools?search=${encodeURIComponent(query)}`;
      navigateToUrl(url);
    } else {
      navigateToUrl('/tools');
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    const url = `/category/${encodeURIComponent(categoryName)}`;
    navigateToUrl(url);
  };

  // 使用统一分类数据
  const memoizedCategories = useMemo(() => unifiedCategories, [unifiedCategories]);
  const memoizedFeaturedTools = useMemo(() => featuredTools, [featuredTools]);

  // 优化工具计数获取 - 使用统一分类数据
  const getCategoryToolCount = useMemo(() => {
    return (categoryName: string) => {
      if (!allTools || !allTools.length) return 0;
      return allTools.filter((tool) => {
        const unifiedCategory = mapToUnifiedCategory({
          name: tool.name,
          description: tool.description || '',
          category: tool.category
        });
        return unifiedCategory === categoryName;
      }).length;
    };
  }, [allTools]);

  // 优化获取分类工具列表 - 使用统一分类
  const getCategoryTools = useMemo(() => {
    return (categoryName: string) => {
      if (!featuredTools.length) return [];
      return featuredTools.filter((tool: Tool) => {
        const unifiedCategory = mapToUnifiedCategory({
          name: tool.name,
          description: tool.description || '',
          category: tool.category
        });
        return unifiedCategory === categoryName;
      }).slice(0, 3);
    };
  }, [featuredTools]);

  return (
    <GlobalLayout>
      {/* SEO结构化数据 */}
      <StructuredData type="website" data={{ tools: featuredTools }} />
      <StructuredData type="organization" data={{}} />
      
      {/* FAQ结构化数据 */}
      <StructuredData 
        type="faq" 
        data={[
          {
            question: "What are the best free AI tools available?",
            answer: "Some of the best free AI tools include ChatGPT (free tier), Claude, Google Gemini, Canva AI, and numerous open-source alternatives. Our directory features over 200+ free AI tools across different categories including writing, image generation, coding, and productivity."
          },
          {
            question: "How do I choose the right AI tool for my business?",
            answer: "Consider your specific needs, budget, team size, and technical requirements. Use our category filters to browse AI tools by function (e.g., customer service, content creation, data analysis). Read user reviews and compare features to make an informed decision."
          },
          {
            question: "Are there good alternatives to ChatGPT?",
            answer: "Yes! Popular ChatGPT alternatives include Claude (Anthropic), Google Gemini, Microsoft Copilot, Perplexity AI, and many specialized AI assistants. Each has unique strengths - browse our conversational AI category to compare features and pricing."
          },
          {
            question: "What's the difference between free and paid AI tools?",
            answer: "Free AI tools typically have usage limits, fewer features, or basic functionality. Paid versions offer unlimited usage, advanced features, priority support, and often better performance. Many tools offer freemium models with free trials to test before upgrading."
          },
          {
            question: "How often is the AI tools directory updated?",
            answer: "We update our directory daily with new AI tools, reviews, and pricing information. Our team continuously monitors the AI landscape to ensure you have access to the latest and most innovative AI solutions for your needs."
          }
        ]} 
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
        <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 text-white py-8 lg:py-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 right-32 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                <span className="animate-pulse mr-2">🚀</span>
                Your AI Tools Guide
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Discover the Best{' '}
                <span className="bg-gradient-to-r from-accent-300 to-yellow-300 bg-clip-text text-transparent">
                  AI Tools
                </span>{' '}
                for Your Business
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                Find 500+ AI tools for productivity, creativity, and business growth. 
                Compare top solutions with expert reviews and ratings.
              </p>
              
              <div className="max-w-2xl mb-8">
                <SuperSearchBar 
                  placeholder="Search ChatGPT, Midjourney, coding tools..."
                  className="w-full"
                />
              </div>
              
              {/* SEO优化的快速导航 - 使用11个核心分类 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <a href="/category/Chatbots%20%26%20Assistants" className="group bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10">
                  <div className="font-semibold group-hover:text-accent-300 transition-colors">AI Chatbots</div>
                  <div className="text-xs opacity-80">ChatGPT, Claude & more</div>
                </a>
                <a href="/category/Image%20Generation%20%26%20Design" className="group bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10">
                  <div className="font-semibold group-hover:text-accent-300 transition-colors">AI Image Tools</div>
                  <div className="text-xs opacity-80">Midjourney, DALL-E alternatives</div>
                </a>
                <a href="/category/Developer%20Tools" className="group bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10">
                  <div className="font-semibold group-hover:text-accent-300 transition-colors">AI Coding Tools</div>
                  <div className="text-xs opacity-80">GitHub Copilot & assistants</div>
                </a>
                <a href="/category/Writing%20%26%20Content" className="group bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10">
                  <div className="font-semibold group-hover:text-accent-300 transition-colors">Writing Tools</div>
                  <div className="text-xs opacity-80">Content creation & writing</div>
                </a>
              </div>
            </div>

            {/* Right side - 3D Illustration */}
            <div className="relative lg:block mt-6 lg:mt-0">
              <div className="relative z-10 scale-105 lg:scale-100">
                <Hero3DImage />
              </div>
              
              {/* Floating elements around the illustration */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-accent-400 rounded-full animate-bounce opacity-80"></div>
              <div className="absolute top-1/4 -right-6 w-6 h-6 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute bottom-1/4 -left-8 w-10 h-10 bg-secondary-400 rounded-full animate-ping opacity-60"></div>
              <div className="absolute bottom-8 right-4 w-4 h-4 bg-accent-300 rounded-full animate-bounce opacity-90" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white/10 backdrop-blur-sm relative overflow-hidden">
        {/* 背景装饰元素 */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-400/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
              <span className="animate-pulse mr-2">🎯</span>
              Discover by Category
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text">
              Browse AI Tools by Category
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Explore AI tools organized by use case and industry. From chatbots to image generation, 
              find the right AI solution for your specific needs.
            </p>
          </div>
          
          {loading ? (
            <LoadingSkeleton variant="category" count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-10">
              {memoizedCategories.map((category: Category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  icon={getCategoryIcon(category.name)}
                  toolCount={category.toolCount || getCategoryToolCount(category.name)}
                  onClick={() => handleCategoryClick(category.name)}
                />
              ))}
            </div>
          )}
          
          {/* 底部装饰 */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-white/60">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/30"></div>
              <span className="text-sm font-medium">11 Categories Available</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 内容广告 - 放置在分类和特色工具之间 */}
      <section className="py-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="text-xs text-white/60 uppercase tracking-wide">Advertisement</span>
          </div>
          <ContentBanner />
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 bg-white/10 backdrop-blur-sm relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full opacity-40 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full opacity-40 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured AI Tools - Latest from Database
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Discover the newest AI tools added to our database. These tools are directly fetched from Supabase with real-time updates and verified for quality.
            </p>
          </div>
          
          {/* 使用新的 LatestToolsGrid 组件 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
            <LatestToolsGrid 
              limit={6}
              showTitle={false}
              theme="dark"
              className="text-white"
            />
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="/tools"
              className="inline-flex items-center bg-gradient-to-r from-accent-600 to-accent-700 text-white px-8 py-3 rounded-lg hover:from-accent-700 hover:to-accent-800 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All Tools
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>



      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping opacity-30"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-accent-300 rounded-full animate-pulse opacity-50"></div>
          <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white rounded-full animate-bounce opacity-40"></div>
          <div className="absolute bottom-32 right-32 w-1 h-1 bg-secondary-300 rounded-full animate-ping opacity-30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated with Latest AI Tools & News
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Get weekly updates on new AI tools, detailed reviews, pricing comparisons, and industry insights delivered to your inbox. Join 50,000+ professionals staying ahead in AI.
          </p>
          
          {/* Coming Soon Newsletter */}
          <div className="max-w-md mx-auto">
            <div className="flex gap-4 opacity-60 pointer-events-none mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-0 focus:outline-none"
                disabled
              />
              <button 
                className="bg-gradient-to-r from-accent-600/50 to-accent-700/50 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed backdrop-blur-sm"
                disabled
              >
                Subscribe
              </button>
            </div>
            
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-4 py-2 text-orange-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
            
            <p className="text-xs text-gray-300 mt-3">
              We&apos;re working hard to bring you an amazing newsletter experience!
            </p>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <BlogPreview />

      {/* Internal Links for SEO */}
      <InternalLinks currentPage="home" />

      {/* Footer */}
      <footer className="bg-primary-900/80 backdrop-blur-sm text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Image 
                    src="/favicon.png" 
                    alt="ToolVerse" 
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-lg"
                  />
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
          <div className="border-t border-gray-700 mt-8 pt-8">
            {/* Footer 广告 */}
            <div className="mb-6">
              <div className="text-center mb-4">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Advertisement</span>
              </div>
              <FooterBanner />
            </div>
            <div className="text-center text-gray-400">
              <p>&copy; 2025 ToolVerse. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </GlobalLayout>
  );
}
