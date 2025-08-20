'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Head from 'next/head';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ToolCard from '../components/ToolCard';
import CategoryCard from '../components/CategoryCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ContentBanner, FooterBanner } from '../components/AdBanner';
import StructuredData from '../components/StructuredData';
import BlogPreview from '../components/blog/BlogPreview';
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
        
        // 直接使用 DataSyncService 获取数据
        const [categoriesData, toolsData] = await Promise.all([
          DataSyncService.getCategories(),
          DataSyncService.getTools()
        ]);
        
        // 处理分类数据
        console.log(`Fetched ${categoriesData.length} categories from data source`);
        setCategories(categoriesData || []);
        
        // 处理工具数据 - 显示所有工具
        console.log(`Fetched ${toolsData.length} tools from data source`);
        
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
          .slice(0, 6); // 只显示6个特色工具
        
        console.log(`Setting ${featuredToolsData.length} featured tools and ${toolsData.length} total tools`);
        setFeaturedTools(featuredToolsData);
        setAllTools(toolsData); // 显示所有工具，不限制数量
        
      } catch (error) {
        console.error('Error fetching data:', error);
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
      'Design & Art': '🎨',
      'Development': '⚙️',
      'Writing & Content': '✍️',
      'Business & Analytics': '📊',
      'Marketing & SEO': '📈',
      'Video & Audio': '🎬',
      'Language & Translation': '🌐',
      'Productivity': '⚡',
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
    <>
      {/* SEO结构化数据 */}
      <Head>
        <title>ToolVerse - Discover Best AI Tools | AI Tools Directory & Reviews</title>
        <meta name="description" content="Discover and use the best AI tools! ToolVerse provides 500+ detailed AI tool reviews and guides. Find ChatGPT, Midjourney, GitHub Copilot alternatives and more AI solutions for your business and creative projects." />
        <meta name="keywords" content="AI tools, artificial intelligence tools, ChatGPT, Midjourney, AI art generator, AI writing tools, AI coding assistant, best AI tools 2024, free AI tools, AI productivity tools" />
        <link rel="canonical" href="https://www.toolsverse.tools/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ToolVerse - Discover Best AI Tools | AI Tools Directory & Reviews" />
        <meta property="og:description" content="Find the best AI tools for your needs. 500+ reviews, comparisons, and guides." />
        <meta property="og:url" content="https://www.toolsverse.tools/" />
        <meta property="og:image" content="https://www.toolsverse.tools/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ToolVerse - Discover Best AI Tools" />
        <meta name="twitter:description" content="Find the best AI tools for your needs. 500+ reviews, comparisons, and guides." />
        <meta name="twitter:image" content="https://www.toolsverse.tools/og-image.png" />
      </Head>
      
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
      
      <div className="min-h-screen bg-gray-50">
        <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover the Best <span className="text-accent-300">AI Tools</span> for Your Business
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto">
            Find the perfect AI tools for productivity, creativity, and business growth. 
            Explore 500+ curated AI software including ChatGPT alternatives, AI image generators, 
            coding assistants, and automation tools. All reviewed by experts.
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search ChatGPT, Midjourney, coding tools..."
              className="w-full"
            />
          </div>
          
          {/* SEO优化的快速导航 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-sm">
            <a href="/tools?category=Conversational%20AI" className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-colors">
              <div className="font-semibold">AI Chatbots</div>
              <div className="text-xs opacity-80">ChatGPT, Claude & more</div>
            </a>
            <a href="/tools?category=Image%20Generation" className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-colors">
              <div className="font-semibold">AI Image Tools</div>
              <div className="text-xs opacity-80">Midjourney, DALL-E alternatives</div>
            </a>
            <a href="/tools?category=Code%20Development" className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-colors">
              <div className="font-semibold">AI Coding Tools</div>
              <div className="text-xs opacity-80">GitHub Copilot & assistants</div>
            </a>
            <a href="/tools?search=free" className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-colors">
              <div className="font-semibold">Free AI Tools</div>
              <div className="text-xs opacity-80">Best free alternatives</div>
            </a>
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

      {/* 内容广告 - 放置在分类和特色工具之间 */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Advertisement</span>
          </div>
          <ContentBanner />
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

      {/* Blog Preview Section */}
      <BlogPreview />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
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
              <p>&copy; 2024 ToolVerse. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
