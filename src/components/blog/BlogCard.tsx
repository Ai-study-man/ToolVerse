'use client';

import Link from 'next/link';
import Image from 'next/image';
import SafeImage from '@/components/SafeImage';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  layout?: 'large' | 'compact' | 'card';
}

export default function BlogCard({ post, layout = 'compact' }: BlogCardProps) {
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

  if (layout === 'card') {
    return (
      <article className="group bg-white/20 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-white/20">
        <div className="relative aspect-video">
          <SafeImage
            src={post.coverImage || '/blog/default-cover.svg'}
            alt={post.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-white/10 to-white/5 p-4"
          />
          <div className="absolute top-4 left-4">
            <span 
              className="px-3 py-1 text-sm font-bold text-white rounded-full"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
          </div>
          {post.featured && (
            <div className="absolute top-4 right-4">
              <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Featured
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-3 text-sm text-white/70">
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{post.readingTime} min read</span>
          </div>
          
          <h3 className="text-xl font-bold text-white group-hover:text-accent-300 transition-colors duration-300 mb-3 line-clamp-2 flex-none">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          
          <p className="text-white/80 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white/90">
                {post.author.name}
              </span>
            </div>
            
            <Link 
              href={`/blog/${post.slug}`}
              className="text-accent-300 hover:text-accent-200 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300"
            >
              Read More →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (layout === 'large') {
    return (
      <article className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden lg:flex">
        {/* Large Image */}
        <div className="lg:w-1/2 relative aspect-[16/10] lg:aspect-auto">
          <SafeImage
            src={post.coverImage || '/blog/default-cover.svg'}
            alt={post.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
          />
          <div className="absolute top-4 left-4">
            <span 
              className="px-3 py-1 text-sm font-bold text-white rounded-full"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.icon} {post.category.name}
            </span>
          </div>
          {post.featured && (
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                ⭐ Featured
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{post.readingTime} min read</span>
            <span>•</span>
            <span className="text-green-600">{post.viewCount.toLocaleString()} views</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-4 line-clamp-2">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>

          <p className="text-gray-600 text-lg mb-6 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-500">AI Tools Expert</p>
              </div>
            </div>

            <Link 
              href={`/blog/${post.slug}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Read Article
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Compact layout
  return (
    <article className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex">
      {/* Compact Image */}
      <div className="w-1/3 relative aspect-square">
        <SafeImage
          src={post.coverImage || '/blog/default-cover.svg'}
          alt={post.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-2"
        />
        {post.featured && (
          <div className="absolute top-2 right-2">
            <div className="bg-yellow-500 text-white p-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="w-2/3 p-6">
        <div className="flex items-center gap-2 mb-2">
          <span 
            className="px-2 py-1 text-xs font-semibold text-white rounded-full"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.name}
          </span>
          <span className="text-sm text-gray-500">{post.readingTime} min read</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2 line-clamp-2">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm text-gray-700">{post.author.name}</span>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Read Article
            <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.viewCount.toLocaleString()} views</span>
        </div>
      </div>
    </article>
  );
}
