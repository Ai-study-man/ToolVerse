'use client';

import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import BlogCard from './BlogCard';

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPost: BlogPost;
}

export default function RelatedPosts({ posts, currentPost }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Related Articles</h2>
        <Link 
          href={`/blog/category/${currentPost.category.slug}`}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          View all in {currentPost.category.name} →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(0, 3).map((post) => (
          <BlogCard key={post.id} post={post} layout="card" />
        ))}
      </div>
      
      {posts.length > 3 && (
        <div className="text-center mt-8">
          <Link
            href={`/blog/category/${currentPost.category.slug}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            View More {currentPost.category.name} Articles
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}
