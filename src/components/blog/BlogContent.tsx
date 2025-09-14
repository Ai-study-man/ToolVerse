'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogGrid from './BlogGrid';
import { BlogPost, BlogCategory } from '@/types/blog';
import { searchBlogPosts } from '@/lib/blogService';

interface BlogContentProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogContent({ initialPosts, categories }: BlogContentProps) {
  // 确保初始文章按发布日期从新到旧排序
  const sortedInitialPosts = [...initialPosts].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  const [posts, setPosts] = useState<BlogPost[]>(sortedInitialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const filterPosts = useCallback(async (categorySlug: string, search?: string) => {
    setLoading(true);
    
    let filteredPosts = sortedInitialPosts;
    
    // Apply search filter first if search query exists
    if (search && search.trim()) {
      try {
        filteredPosts = await searchBlogPosts(search.trim());
      } catch (error) {
        console.error('Search error:', error);
        filteredPosts = sortedInitialPosts.filter(post => 
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }
    }
    
    // Then apply category filter
    if (categorySlug !== 'all') {
      filteredPosts = filteredPosts.filter(post => 
        post.category.slug === categorySlug
      );
    }
    
    // 确保过滤后的文章也按日期排序
    const sortedFilteredPosts = [...filteredPosts].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    setPosts(sortedFilteredPosts);
    setLoading(false);
  }, [sortedInitialPosts]);

  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    
    if (category !== selectedCategory || search !== searchQuery) {
      setSelectedCategory(category);
      setSearchQuery(search);
      filterPosts(category, search);
    }
  }, [searchParams, selectedCategory, searchQuery, filterPosts]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    filterPosts(categorySlug, searchQuery);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (categorySlug === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', categorySlug);
    }
    
    // Keep search query if it exists
    if (searchQuery) {
      url.searchParams.set('search', searchQuery);
    }
    
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-accent-600 text-white shadow-lg'
              : 'bg-white/20 backdrop-blur-sm text-white/90 hover:bg-white/30 border border-white/20'
          }`}
        >
          ⭐ All Articles
          <span className="ml-1 text-xs opacity-75">
            ({sortedInitialPosts.length})
          </span>
        </button>
        
        {categories.map((category) => {
          const categoryPostCount = sortedInitialPosts.filter(post => 
            post.category.slug === category.slug
          ).length;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === category.slug
                  ? 'text-white shadow-lg'
                  : 'bg-white/20 backdrop-blur-sm text-white/90 hover:bg-white/30 border border-white/20'
              }`}
              style={{
                backgroundColor: selectedCategory === category.slug ? category.color : undefined
              }}
            >
              <span>{category.icon}</span>
              {category.name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedCategory === category.slug 
                  ? 'bg-white/30' 
                  : 'bg-white/30'
              }`}>
                {categoryPostCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Results Info & Posts Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">
          {searchQuery && (
            <div className="mb-2">
              <span className="text-white font-medium">
                Search results for &quot;{searchQuery}&quot;
              </span>
              {selectedCategory !== 'all' && (
                <span className="text-white/70">
                  {' '}in {categories.find(c => c.slug === selectedCategory)?.name}
                </span>
              )}
            </div>
          )}
          {loading ? (
            'Loading...'
          ) : (
            <>
              Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'}
              {selectedCategory !== 'all' && (
                <span className="ml-1">
                  in {categories.find(c => c.slug === selectedCategory)?.name}
                </span>
              )}
            </>
          )}
        </div>

        {(selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              filterPosts('all', '');
              const url = new URL(window.location.href);
              url.searchParams.delete('category');
              url.searchParams.delete('search');
              window.history.pushState({}, '', url.toString());
            }}
            className="text-sm text-accent-300 hover:text-accent-200 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl shadow-md overflow-hidden animate-pulse border border-white/20">
              <div className="aspect-video bg-white/10"></div>
              <div className="p-6">
                <div className="h-4 bg-white/20 rounded w-1/3 mb-3"></div>
                <div className="h-6 bg-white/20 rounded w-full mb-3"></div>
                <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {!loading && posts.length > 0 && (
        <BlogGrid posts={posts} />
      )}

      {/* Empty State for search/category */}
      {!loading && posts.length === 0 && (searchQuery || selectedCategory !== 'all') && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 text-4xl">
            {searchQuery ? '🔍' : (categories.find(c => c.slug === selectedCategory)?.icon || '📝')}
          </div>
          <h3 className="text-xl font-bold text-white mb-4">
            {searchQuery ? 'No search results found' : 'No articles in this category yet'}
          </h3>
          <p className="text-white/70 mb-8">
            {searchQuery 
              ? `No articles match your search for "${searchQuery}". Try different keywords or browse all articles.`
              : 'We\'re working on creating amazing content for this category. Check back soon for new articles!'
            }
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              filterPosts('all', '');
              const url = new URL(window.location.href);
              url.searchParams.delete('category');
              url.searchParams.delete('search');
              window.history.pushState({}, '', url.toString());
            }}
            className="inline-flex items-center px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
          >
            View All Articles
          </button>
        </div>
      )}
    </div>
  );
}