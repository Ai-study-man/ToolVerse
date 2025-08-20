'use client';

import Link from 'next/link';
import Image from 'next/image';
import SafeImage from '@/components/SafeImage';
import { BlogPost } from '@/types/blog';

interface FeaturedPostProps {
  post: BlogPost;
  layout?: 'hero' | 'compact';
}

export default function FeaturedPost({ post, layout = 'hero' }: FeaturedPostProps) {
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

  if (layout === 'compact') {
    return (
      <article className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative aspect-[4/3]">
          <SafeImage
            src={post.coverImage || '/blog/default-cover.jpg'}
            alt={post.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg"
          />
          <div className="absolute top-4 left-4">
            <span 
              className="px-3 py-1 text-sm font-bold text-white rounded-full shadow-lg"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
              Featured
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{post.readingTime} min read</span>
            <span>•</span>
            <span>{post.viewCount.toLocaleString()} views</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3 line-clamp-2">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{post.author.name}</p>
                <p className="text-xs text-gray-500">AI Tools Expert</p>
              </div>
            </div>
            
            <Link 
              href={`/blog/${post.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300"
            >
              Read More
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden lg:flex">
      {/* Large Image */}
      <div className="lg:w-3/5 relative aspect-[16/10] lg:aspect-auto">
        <SafeImage
          src={post.coverImage || '/blog/default-cover.jpg'}
          alt={post.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300 bg-gray-50"
        />
        <div className="absolute top-6 left-6">
          <span 
            className="px-4 py-2 text-sm font-bold text-white rounded-full shadow-lg"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.icon} {post.category.name}
          </span>
        </div>
        <div className="absolute top-6 right-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            ⭐ Featured
          </div>
        </div>
        
        {/* Social Share Overlay */}
        <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:text-blue-600 transition-colors duration-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:text-blue-600 transition-colors duration-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="lg:w-2/5 p-8 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.readingTime} min read</span>
          <span>•</span>
          <span className="text-green-600 font-medium">{post.viewCount.toLocaleString()} views</span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-4 line-clamp-3">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        <p className="text-gray-600 text-lg mb-6 line-clamp-4 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center ring-2 ring-gray-100">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author.name}</p>
              <p className="text-sm text-gray-500">{post.author.bio?.substring(0, 40)}...</p>
            </div>
          </div>

          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Read Article
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
