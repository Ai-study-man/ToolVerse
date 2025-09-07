'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost, BlogCategory } from '@/types/blog';
import { getBlogCategories, getPopularPosts } from '@/lib/blogService';

interface BlogSidebarProps {
  currentPost?: any;
}

export default function BlogSidebar({ currentPost }: BlogSidebarProps) {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, popularPostsData] = await Promise.all([
          getBlogCategories(),
          getPopularPosts(3)
        ]);
        
        setCategories(categoriesData);
        setPopularPosts(popularPostsData);
        setTotalPostsCount(categoriesData.reduce((sum, cat) => sum + cat.postCount, 0));
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set timer to update popular posts data every 5 minutes (real-time updates)
    const interval = setInterval(async () => {
      try {
        const [updatedPopularPosts, updatedCategories] = await Promise.all([
          getPopularPosts(3),
          getBlogCategories()
        ]);
        setPopularPosts(updatedPopularPosts);
        setTotalPostsCount(updatedCategories.reduce((sum, cat) => sum + cat.postCount, 0));
      } catch (error) {
        console.error('Error updating sidebar data:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Format number display (e.g., 15234 -> 15.2k)
  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Handle search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  };

  return (
    <aside className="space-y-8">
      {/* Search Widget */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Search Articles</h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for articles..."
            className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
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
              {loading ? '...' : totalPostsCount}
            </span>
          </Link>
          
          {loading ? (
            // Loading skeleton for categories
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
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
                  {category.postCount || 0}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Popular Posts */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🔥</span>
          Weekly Trending
        </h3>
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton for popular posts
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg animate-pulse">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </>
          ) : popularPosts.length > 0 ? (
            popularPosts.map((post, index) => (
              <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
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
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>•</span>
                    <span className="text-green-600">{formatViewCount(post.viewCount)} views</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No trending articles yet
            </div>
          )}
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
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 opacity-60"
            disabled
          />
          <button className="w-full bg-white/60 text-blue-600 font-semibold py-2 px-4 rounded-lg cursor-not-allowed" disabled>
            Subscribe Free
          </button>
        </div>
        
        {/* Coming Soon Badge */}
        <div className="flex justify-center mt-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-blue-100">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">Coming Soon</span>
          </div>
        </div>
        
        <p className="text-xs text-blue-200 mt-2 text-center">
          Newsletter feature coming soon!
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
