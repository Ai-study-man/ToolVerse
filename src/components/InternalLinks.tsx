'use client';

import Link from 'next/link';

interface InternalLinksProps {
  currentPage: 'home' | 'tools' | 'categories' | 'blog' | 'compare';
  category?: string;
}

export default function InternalLinks({ currentPage, category }: InternalLinksProps) {
  const links = {
    home: [
      { href: '/tools', text: 'Browse All AI Tools', description: 'Discover 500+ AI tools' },
      { href: '/categories', text: 'Explore Categories', description: 'Find tools by use case' },
      { href: '/compare', text: 'Compare AI Tools', description: 'Side-by-side comparisons' },
      { href: '/blog', text: 'AI Tools Blog', description: 'Latest AI news & guides' },
    ],
    tools: [
      { href: '/', text: 'AI Tools Directory', description: 'Back to homepage' },
      { href: '/compare/chatgpt-vs-claude', text: 'ChatGPT vs Claude', description: 'Popular AI comparison' },
      { href: '/compare/midjourney-vs-dalle', text: 'Midjourney vs DALL-E', description: 'Image AI comparison' },
      { href: '/faq', text: 'AI Tools FAQ', description: 'Common questions answered' },
    ],
    categories: [
      { href: '/category/Writing%20%26%20Content', text: 'AI Chatbots', description: 'ChatGPT alternatives' },
      { href: '/category/Design%20%26%20Art', text: 'AI Image Generators', description: 'Create images with AI' },
      { href: '/category/Developer%20Tools', text: 'AI Coding Tools', description: 'Programming assistants' },
      { href: '/category/Writing%20%26%20Content', text: 'AI Writing Tools', description: 'Content creation' },
    ],
    blog: [
      { href: '/tools', text: 'Browse AI Tools', description: 'Find your perfect AI tool' },
      { href: '/compare', text: 'Tool Comparisons', description: 'Compare top AI tools' },
      { href: '/categories', text: 'Tool Categories', description: 'Browse by category' },
      { href: '/submit', text: 'Submit AI Tool', description: 'Add your tool' },
    ],
    compare: [
      { href: '/tools', text: 'All AI Tools', description: 'Browse 500+ tools' },
      { href: '/compare/chatgpt-vs-claude', text: 'ChatGPT vs Claude', description: 'AI chatbot comparison' },
      { href: '/compare/midjourney-vs-dalle', text: 'Midjourney vs DALL-E', description: 'Image AI comparison' },
      { href: '/blog', text: 'AI News & Guides', description: 'Latest insights' },
    ]
  };

  const currentLinks = links[currentPage] || links.home;

  return (
    <section className="py-12 bg-gradient-to-br from-secondary-50 via-white to-primary-50 border-t border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Explore More AI Tools & Resources
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-primary-300"
            >
              <div className="text-center">
                <div className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                  {link.text}
                </div>
                <div className="text-sm text-gray-500">
                  {link.description}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 热门搜索关键词 - 仅在首页显示 */}
        {currentPage === 'home' && (
          <div className="mt-8 text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Searches:</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'ChatGPT alternatives',
                'AI image generators',
                'free AI tools',
                'AI coding assistants',
                'AI writing tools',
                'Midjourney alternatives',
                'AI productivity tools',
                'AI video generators'
              ].map((term, index) => (
                <Link
                  key={index}
                  href={`/tools?search=${encodeURIComponent(term)}`}
                  className="px-3 py-1 text-xs bg-gray-200 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 相关工具推荐 - 在工具页面显示 */}
        {currentPage === 'tools' && category && (
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">
              Related Categories:
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Conversational AI',
                'Image Generation', 
                'Code Development',
                'Content Writing',
                'Productivity',
                'Video Generation'
              ].filter(cat => cat !== category).slice(0, 4).map((cat, index) => (
                <Link
                  key={index}
                  href={`/category/${encodeURIComponent(cat)}`}
                  className="px-3 py-1 text-xs bg-white border border-gray-300 hover:border-primary-300 text-gray-700 hover:text-primary-700 rounded-full transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
