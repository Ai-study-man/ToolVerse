'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogGrid from './BlogGrid';
import { BlogPost, BlogCategory } from '@/types/blog';

interface BlogContentProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogContent({ initialPosts, categories }: BlogContentProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
      filterPosts(category);
    }
  }, [searchParams, selectedCategory]);

  const filterPosts = (categorySlug: string) => {
    setLoading(true);
    
    if (categorySlug === 'all') {
      setPosts(initialPosts);
    } else {
      const filtered = initialPosts.filter(post => 
        post.category.slug === categorySlug
      );
      setPosts(filtered);
    }
    
    setLoading(false);
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    filterPosts(categorySlug);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (categorySlug === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', categorySlug);
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
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⭐ All Articles
          <span className="ml-1 text-xs opacity-75">
            ({initialPosts.length})
          </span>
        </button>
        
        {categories.map((category) => {
          const categoryPostCount = initialPosts.filter(post => 
            post.category.slug === category.slug
          ).length;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === category.slug
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  : 'bg-gray-200'
              }`}>
                {categoryPostCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Posts Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
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
        
        {selectedCategory !== 'all' && (
          <button
            onClick={() => handleCategoryChange('all')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {!loading && posts.length > 0 && (
        <BlogGrid posts={posts} />
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && selectedCategory !== 'all' && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 text-4xl">
            {categories.find(c => c.slug === selectedCategory)?.icon || '📝'}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            No articles in this category yet
          </h3>
          <p className="text-gray-600 mb-8">
            We're working on creating amazing content for this category. 
            Check back soon for new articles!
          </p>
          <button
            onClick={() => handleCategoryChange('all')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Articles
          </button>
        </div>
      )}
    </div>
  );
}
