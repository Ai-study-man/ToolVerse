'use client';

import Link from 'next/link';
import { BlogCategory } from '@/types/blog';

interface BlogHeroProps {
  categories: BlogCategory[];
}

export default function BlogHero({ categories }: BlogHeroProps) {
  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Breadcrumb */}
          <nav className="flex justify-center mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-white/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium">Blog</span>
              </li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-accent-300 leading-relaxed pb-2">
              <span className="block sm:inline whitespace-nowrap">AI Tools</span>
              <span className="block sm:inline sm:ml-4 whitespace-nowrap">Blog</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed">
            Expert reviews, tutorials, and insights on the latest AI tools. 
            Stay ahead with ChatGPT, Midjourney, GitHub Copilot, and emerging AI technologies.
          </p>
          
          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Link
              href="/blog"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full 
                       hover:bg-white/30 transition-all duration-300 border border-white/30
                       font-medium"
            >
              All Articles
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full 
                         hover:bg-white/30 transition-all duration-300 border border-white/30
                         flex items-center gap-2 font-medium"
                title={category.description}
              >
                <span className="text-lg">{category.icon}</span>
                {category.name}
                {category.postCount > 0 && (
                  <span className="bg-white/30 text-xs px-2 py-1 rounded-full">
                    {category.postCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-4 py-3 pl-12 bg-white/20 backdrop-blur-sm border border-white/30 
                         rounded-full text-white placeholder-white/70 focus:outline-none 
                         focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300"
              />
              <svg 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 -left-8 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-8 right-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
      </div>
    </section>
  );
}
