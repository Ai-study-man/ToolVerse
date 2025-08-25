import { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/Header';
import BlogHero from '@/components/blog/BlogHero';
import FeaturedPost from '@/components/blog/FeaturedPost';
import BlogContent from '@/components/blog/BlogContent';
import BlogSidebar from '@/components/blog/BlogSidebar';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import { getAllBlogPosts, getFeaturedBlogPosts, getBlogCategories } from '@/lib/blogService';

export const metadata: Metadata = {
  title: 'AI Tools Blog - Latest Reviews, Tutorials & Industry News | ToolVerse',
  description: 'Stay updated with the latest AI tools reviews, tutorials, and industry insights. Expert guides on ChatGPT, Midjourney, GitHub Copilot, and emerging AI technologies.',
  keywords: 'AI blog, AI tools reviews, AI tutorials, artificial intelligence news, ChatGPT guides, Midjourney tutorials, AI industry updates, machine learning blog, AI coding assistants, AI productivity tools',
  openGraph: {
    title: 'AI Tools Blog - Expert Reviews & Tutorials | ToolVerse',
    description: 'Expert AI tools reviews, tutorials, and industry insights. Learn how to master ChatGPT, Midjourney, and other cutting-edge AI technologies.',
    url: 'https://www.toolsverse.tools/blog',
    type: 'website',
    images: [
      {
        url: '/blog/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'ToolVerse AI Tools Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Blog - ToolVerse',
    description: 'Expert AI tools reviews, tutorials, and industry insights',
    images: ['/blog/og-blog.jpg'],
  },
  alternates: {
    canonical: 'https://www.toolsverse.tools/blog',
    types: {
      'application/rss+xml': 'https://www.toolsverse.tools/blog/rss.xml',
    }
  }
};

export default async function BlogPage() {
  const allPosts = await getAllBlogPosts();
  const featuredPosts = await getFeaturedBlogPosts();
  const categories = await getBlogCategories();
  
  // 确保所有文章按日期排序（从新到旧）
  const sortedAllPosts = [...allPosts].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const recentPosts = sortedAllPosts.slice(0, 9);

  // 确保featured文章最多显示3个，按日期排序
  const limitedFeaturedPosts = featuredPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  // Generate structured data for the blog
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'ToolVerse AI Tools Blog',
    description: 'Expert reviews, tutorials, and insights on AI tools and artificial intelligence technologies',
    url: 'https://www.toolsverse.tools/blog',
    publisher: {
      '@type': 'Organization',
      name: 'ToolVerse',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.toolsverse.tools/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.toolsverse.tools/blog'
    },
    blogPost: limitedFeaturedPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://www.toolsverse.tools/blog/${post.slug}`,
      datePublished: post.publishedAt.toISOString(),
      dateModified: post.updatedAt.toISOString(),
      author: {
        '@type': 'Person',
        name: post.author.name,
        description: post.author.bio
      },
      image: post.coverImage ? {
        '@type': 'ImageObject',
        url: post.coverImage,
        width: 1200,
        height: 630
      } : undefined,
      keywords: post.keywords.join(', '),
      wordCount: post.content.split(' ').length,
      timeRequired: `PT${post.readingTime}M`,
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
    }))
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.toolsverse.tools'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.toolsverse.tools/blog'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      {/* Header */}
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <BlogHero categories={categories} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Posts Section */}
          {limitedFeaturedPosts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Today&apos;s Featured Articles</h2>
                <div className="text-sm text-gray-500">
                  {limitedFeaturedPosts.length} featured {limitedFeaturedPosts.length === 1 ? 'article' : 'articles'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {limitedFeaturedPosts.map((post) => (
                  <FeaturedPost key={post.id} post={post} layout="compact" />
                ))}
              </div>
            </section>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Blog Posts */}
            <div className="lg:col-span-3">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading articles...</span>
                </div>
              }>
                <BlogContent initialPosts={recentPosts} categories={categories} />
              </Suspense>
              
              {/* Load More Button */}
              {sortedAllPosts.length > 9 && (
                <div className="text-center mt-12">
                  <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Load More Articles
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>

          {/* Newsletter Signup */}
          <NewsletterSignup />
        </div>
      </main>
    </>
  );
}
