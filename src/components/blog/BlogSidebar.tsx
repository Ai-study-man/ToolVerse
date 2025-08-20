'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BLOG_CATEGORIES } from '@/types/blog';
import { getPopularPosts, getRecentPosts } from '@/lib/blogService';

interface BlogSidebarProps {
  currentPost?: any;
}

export default function BlogSidebar({ currentPost }: BlogSidebarProps) {
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  // In a real app, you'd use useEffect to fetch these
  // For now, we'll use empty arrays to avoid server-side issues

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <aside className="space-y-8">
      {/* Search Widget */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Search Articles</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for articles..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📁</span>
          Categories
        </h3>
        <div className="space-y-2">
          {/* All Articles Link */}
          <Link
            href="/blog"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white transition-colors duration-200 group bg-blue-50 border border-blue-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">⭐</span>
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-medium text-blue-700 group-hover:text-blue-800">
                All Articles
              </span>
            </div>
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              All
            </span>
          </Link>
          
          {BLOG_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{category.icon}</span>
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium text-gray-700 group-hover:text-blue-600">
                  {category.name}
                </span>
              </div>
              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                {category.postCount || 12}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Posts */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🔥</span>
          Popular This Week
        </h3>
        <div className="space-y-4">
          {[
            {
              title: "ChatGPT vs Claude 3: Complete Comparison",
              slug: "chatgpt-vs-claude-3-comparison-2024",
              views: "15.2k views",
              date: new Date("2024-01-15")
            },
            {
              title: "Best AI Coding Assistants 2024",
              slug: "best-ai-coding-assistants-2024",
              views: "12.5k views", 
              date: new Date("2024-01-25")
            },
            {
              title: "Midjourney Logo Design Tutorial",
              slug: "midjourney-logo-design-tutorial-2024",
              views: "8.9k views",
              date: new Date("2024-01-20")
            }
          ].map((post, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-blue-600">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <span className="text-green-600">{post.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Cloud */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🏷️</span>
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'ChatGPT', 'AI Tools', 'Midjourney', 'GitHub Copilot', 'Claude',
            'AI Art', 'Coding', 'Productivity', 'Tutorial', 'Review',
            'Comparison', 'Business AI', 'Machine Learning'
          ].map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2 flex items-center">
          <span className="mr-2">📧</span>
          Stay Updated
        </h3>
        <p className="text-blue-100 mb-4 text-sm">
          Get the latest AI tools insights and tutorials delivered to your inbox weekly.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            Subscribe Free
          </button>
        </div>
        <p className="text-xs text-blue-200 mt-2">
          No spam. Unsubscribe at any time.
        </p>
      </div>

      {/* Related Tools */}
      {currentPost?.relatedTools && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔗</span>
            Related Tools
          </h3>
          <div className="space-y-3">
            {currentPost.relatedTools.slice(0, 3).map((toolId: string) => (
              <Link
                key={toolId}
                href={`/tools/${toolId}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">AI</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 capitalize">
                    {toolId.replace('-', ' ')}
                  </h4>
                  <p className="text-sm text-gray-500">AI Tool</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
