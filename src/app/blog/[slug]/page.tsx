import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import Header from '@/components/Header';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPostWrapper from '@/components/blog/BlogPostWrapper';
import ShareButton from '@/components/blog/ShareButton';
import ToolLogo from '@/components/blog/ToolLogo';
import { getBlogPost, getRelatedPosts } from '@/lib/blogService';
import { getToolLogo } from '@/lib/toolLogoMapping';
// import { getMultipleTools } from '@/lib/toolUtils';
// import { Tool } from '@/types';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | ToolVerse Blog',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  return {
    title: post.seoTitle || `${post.title} | ToolVerse Blog`,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords.join(', '),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://toolverse.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name],
      tags: post.tags,
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      creator: post.author.social?.twitter,
    },
    alternates: {
      canonical: `https://www.toolsverse.tools/blog/${post.slug}`,
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id);
  
  // 获取文章中提到的工具信息
  // let relatedToolsData: (Tool | null)[] = [];
  // if (post.relatedTools && post.relatedTools.length > 0) {
  //   relatedToolsData = await getMultipleTools(post.relatedTools);
  // }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Generate structured data for the blog post
  const blogPostStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? {
      '@type': 'ImageObject',
      url: post.coverImage,
      width: 1200,
      height: 630
    } : undefined,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
      description: post.author.bio,
      sameAs: post.author.social ? [
        post.author.social.twitter && `https://twitter.com/${post.author.social.twitter.replace('@', '')}`,
        post.author.social.linkedin && `https://linkedin.com/in/${post.author.social.linkedin}`
      ].filter(Boolean) : []
    },
    publisher: {
      '@type': 'Organization',
      name: 'ToolVerse',
      logo: {
        '@type': 'ImageObject',
        url: 'https://toolverse.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://toolverse.com/blog/${post.slug}`
    },
    keywords: post.keywords.join(', '),
    articleSection: post.category.name,
    wordCount: post.content.split(' ').length,
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: 'en-US',
    about: post.tags.map(tag => ({
      '@type': 'Thing',
      name: tag
    })),
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ReadAction',
        userInteractionCount: post.viewCount
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ShareAction',
        userInteractionCount: post.shareCount
      }
    ]
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://toolverse.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://toolverse.com/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.category.name,
        item: `https://toolverse.com/blog/category/${post.category.slug}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: `https://toolverse.com/blog/${post.slug}`
      }
    ]
  };

  return (
    <BlogPostWrapper 
      blogId={post.id}
      initialViewCount={post.viewCount}
      initialShareCount={post.shareCount}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      {/* Header */}
      <Header />
      
      <article className="min-h-screen bg-gray-50">
        {/* Hero Section - 优化后的设计 */}
        <header className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Breadcrumb - 优化样式 */}
            <nav className="flex items-center space-x-2 text-sm text-blue-100 mb-12">
              <Link href="/" className="hover:text-white transition-colors duration-200 font-medium">
                Home
              </Link>
              <span className="text-blue-300">•</span>
              <Link href="/blog" className="hover:text-white transition-colors duration-200 font-medium">
                Blog
              </Link>
              <span className="text-blue-300">•</span>
              <Link 
                href={`/blog/category/${post.category.slug}`}
                className="hover:text-white transition-colors duration-200 font-medium"
              >
                {post.category.name}
              </Link>
              <span className="text-blue-300">•</span>
              <span className="text-white font-semibold">{post.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <div className="lg:col-span-3 space-y-8">
                {/* Category & Featured Badge */}
                <div className="flex items-center gap-3 mb-6">
                  <span 
                    className="px-5 py-2.5 text-sm font-bold text-white rounded-full shadow-lg"
                    style={{ backgroundColor: post.category.color }}
                  >
                    {post.category.icon} {post.category.name}
                  </span>
                  {post.featured && (
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Title - 增加行高和间距 */}
                <h1 className="text-5xl lg:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
                  {post.title}
                </h1>

                {/* Excerpt - 优化字体和间距 */}
                <p className="text-xl lg:text-2xl text-blue-100 mb-10 leading-relaxed font-light max-w-4xl">
                  {post.excerpt}
                </p>
              </div>

              {/* Featured Image - 动态使用文章封面图片 */}
              <div className="lg:col-span-2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  <div className="relative aspect-square">
                    <SafeImage
                      src={post.coverImage || '/pictures/Fal AI.png'}
                      alt={`${post.title} - AI Tool Review`}
                      fill
                      className="object-contain rounded-2xl shadow-2xl bg-white/10 backdrop-blur-sm p-4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent rounded-2xl pointer-events-none"></div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <div className="lg:col-span-3">
                {/* Author & Meta Information - 重新设计布局 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{post.author.name}</p>
                        <p className="text-blue-200 text-sm font-medium">AI Tools Expert</p>
                      </div>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{post.readingTime} min read</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-300 font-bold">{post.viewCount.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags - 优化样式 */}
                <div className="flex flex-wrap gap-3 mt-8">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tools?search=${encodeURIComponent(tag)}`}
                      className="px-4 py-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium rounded-full hover:bg-white/25 transition-all duration-200 border border-white/20 hover:scale-105"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* 右侧特色区域 - 紧凑设计 */}
              <div className="lg:col-span-2">
                <div className="sticky top-8 space-y-4">
                  {/* 主要特色图片/卡片 - 紧凑版 */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">AI Tools Directory</h3>
                      <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                        Discover 500+ curated AI tools for developers, creators, and businesses
                      </p>
                      <Link 
                        href="/tools"
                        className="inline-flex items-center gap-2 bg-white text-blue-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        Explore Tools
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* 统计卡片 - 简化版本，包含导航 */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">{post.viewCount.toLocaleString()}</div>
                        <div className="text-xs text-blue-200">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">{post.shareCount}</div>
                        <div className="text-xs text-blue-200">Shares</div>
                      </div>
                    </div>
                    
                    {/* 内联导航 */}
                    <div className="pt-4 border-t border-white/20">
                      <h4 className="text-sm font-bold text-white mb-2">Quick Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <a href="#content" className="px-3 py-1 bg-white/10 text-blue-100 hover:text-white text-xs rounded-full hover:bg-white/20 transition-colors">
                          Read Article
                        </a>
                        <a href="#related-tools" className="px-3 py-1 bg-white/10 text-blue-100 hover:text-white text-xs rounded-full hover:bg-white/20 transition-colors">
                          Tools
                        </a>
                        <a href="#author" className="px-3 py-1 bg-white/10 text-blue-100 hover:text-white text-xs rounded-full hover:bg-white/20 transition-colors">
                          Author
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* 主要内容区域 - 优化设计 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <main className="lg:col-span-3">
              {/* 内容卡片 - 优化样式 */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Social Share Bar - 重新设计 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-blue-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Published {formatTime(post.publishedAt)}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Updated {formatTime(post.updatedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 font-medium">Share:</span>
                      <div className="flex items-center gap-2">
                        <ShareButton
                          platform="twitter"
                          blogId={post.id}
                          title={post.title}
                          className="p-2.5 bg-white rounded-full shadow-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-gray-200"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </ShareButton>
                        <ShareButton
                          platform="linkedin"
                          blogId={post.id}
                          title={post.title}
                          className="p-2.5 bg-white rounded-full shadow-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-gray-200"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </ShareButton>
                        <ShareButton
                          platform="copy"
                          blogId={post.id}
                          title={post.title}
                          className="p-2.5 bg-white rounded-full shadow-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-gray-200"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                        </ShareButton>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Article Content - 优化排版 */}
                <div id="content" className="px-8 py-12">
                  <div 
                    className="prose prose-xl prose-blue max-w-none 
                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                    prose-h1:text-4xl prose-h1:mb-8 prose-h1:leading-tight
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-blue-900 prose-h2:border-b prose-h2:border-blue-100 prose-h2:pb-3
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-blue-800
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                    prose-a:text-blue-600 prose-a:no-underline prose-a:font-medium hover:prose-a:text-blue-800 hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-ul:my-6 prose-li:my-2 prose-li:text-gray-700
                    prose-ol:my-6 prose-ol:text-gray-700
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                    prose-code:bg-blue-50 prose-code:text-blue-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-medium
                    prose-pre:bg-gray-900 prose-pre:text-white prose-pre:rounded-xl
                    prose-table:border-collapse prose-table:border prose-table:border-gray-200
                    prose-th:bg-blue-50 prose-th:text-blue-900 prose-th:font-bold prose-th:border prose-th:border-gray-200 prose-th:px-4 prose-th:py-3
                    prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-3
                    prose-img:rounded-xl prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                {/* Recommended Resource - 推荐资源 */}
                <div className="mx-8 mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        💡 Maximize Your AI Tool Experience
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        Looking to optimize your workflow with advanced AI capabilities? 
                        Discover premium tools and resources that can significantly boost your productivity.
                      </p>
                      <a 
                        href="https://www.profitableratecpm.com/hb5tbj1n?key=47f4f72ed19f496d5c6370925f98848a"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                      >
                        <span>Explore Advanced Solutions</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Tools Mentioned in This Article */}
                {post.relatedTools && post.relatedTools.length > 0 && (
                  <div id="related-tools" className="mx-8 mb-8 p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Tools Mentioned in This Article
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.relatedTools.map((toolId) => {
                        // const toolData = relatedToolsData.find(tool => tool?.id === toolId);
                        // const toolName = toolData?.name || toolId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        const toolName = toolId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        const toolLogo = getToolLogo(toolId);
                        
                        return (
                          <Link
                            key={toolId}
                            href={`/tools?search=${encodeURIComponent(toolId)}`}
                            className="group flex items-center gap-4 p-6 bg-white rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                          >
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow overflow-hidden">
                              <ToolLogo
                                src={toolLogo}
                                alt={`${toolName} logo`}
                                toolName={toolName}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg group-hover:text-purple-700 transition-colors">
                                {toolName}
                              </h4>
                              <p className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors flex items-center">
                                Explore this AI tool 
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Author Bio - 重新设计 */}
                <div id="author" className="mx-8 mb-8 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">About {post.author.name}</h4>
                      <p className="text-gray-700 mb-4 leading-relaxed text-lg">{post.author.bio}</p>
                      {post.author.social && (
                        <div className="flex gap-4">
                          {post.author.social.twitter && (
                            <a
                              href={`https://twitter.com/${post.author.social.twitter.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                              Follow on Twitter
                            </a>
                          )}
                          {post.author.social.linkedin && (
                            <a
                              href={`https://linkedin.com/in/${post.author.social.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              Connect on LinkedIn
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <BlogSidebar currentPost={post} />
            </aside>
          </div>

          {/* Additional Resources - 额外资源 */}
          <div className="mt-16 p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl border border-indigo-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🚀 Take Your AI Journey Further
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                Ready to dive deeper into advanced AI solutions? Explore cutting-edge tools and platforms 
                that successful professionals use to stay ahead of the curve.
              </p>
              <a 
                href="https://www.profitableratecpm.com/hb5tbj1n?key=47f4f72ed19f496d5c6370925f98848a"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Discover Premium Tools</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Related Posts - 全新设计 */}
          {relatedPosts.length > 0 && (
            <section className="mt-20 pt-16 border-t border-gray-200">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Recommended Reading</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover more insights about AI tools and technology trends
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                    <div className="relative aspect-video overflow-hidden">
                      <SafeImage
                        src={relatedPost.coverImage || '/blog/default-cover.svg'}
                        alt={relatedPost.title}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500 bg-white p-2"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span 
                          className="px-4 py-2 text-sm font-bold text-white rounded-full shadow-lg backdrop-blur-sm"
                          style={{ backgroundColor: relatedPost.category.color }}
                        >
                          {relatedPost.category.icon} {relatedPost.category.name}
                        </span>
                      </div>
                      
                      {/* Reading Time */}
                      <div className="absolute bottom-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-full">
                          {relatedPost.readingTime} min read
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-4 line-clamp-2 leading-tight">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                      
                      {/* Author and Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900 block">
                              {relatedPost.author.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(relatedPost.publishedAt)}
                            </span>
                          </div>
                        </div>
                        
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm group-hover:gap-2 transition-all"
                        >
                          Read more
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* CTA Section */}
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Want More AI Tool Insights?</h3>
                  <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    Join thousands of professionals who stay updated with the latest AI tools and technology trends
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      View All Articles
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                    <Link
                      href="/tools"
                      className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-800 transition-colors border-2 border-blue-400"
                    >
                      Explore AI Tools
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </article>
    </BlogPostWrapper>
  );
}
