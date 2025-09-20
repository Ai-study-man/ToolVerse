'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import GlobalLayout from '../../components/GlobalLayout';
import StructuredData from '../../components/StructuredData';

export default function FeaturedTopicsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const featuredTopics = [
    {
      id: 'best-free-ai-tools-2025',
      title: 'Best Free AI Tools 2025',
      description: 'Discover the top free AI tools that can boost your productivity without breaking the bank. From content creation to automation, find the perfect tools for your needs.',
      coverImage: '/images/ai-tools-cover.jpg',
      href: '/best-free-ai-tools-2025',
      gradient: 'from-blue-500 to-purple-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      stats: {
        tools: '50+',
        category: 'Productivity'
      }
    },
    {
      id: 'ai-tools-for-small-business',
      title: 'AI Tools for Small Business',
      description: 'Transform your small business with AI-powered solutions. Streamline operations, enhance customer service, and boost revenue with these carefully selected tools.',
      coverImage: '/images/business-ai-cover.jpg',
      href: '/ai-tools-for-small-business',
      gradient: 'from-green-500 to-teal-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      stats: {
        tools: '40+',
        category: 'Business'
      }
    },
    {
      id: 'chatgpt-alternatives',
      title: 'ChatGPT Alternatives',
      description: 'Explore the best ChatGPT alternatives in 2025. Compare features, pricing, and capabilities to find the perfect AI assistant for your specific needs.',
      coverImage: '/images/chatgpt-alternatives-cover.jpg',
      href: '/chatgpt-alternatives',
      gradient: 'from-purple-500 to-pink-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      stats: {
        tools: '10+',
        category: 'AI Chat'
      }
    }
  ];

  return (
    <GlobalLayout>
      {/* SEO结构化数据 */}
      <StructuredData 
        type="article" 
        data={{
          headline: "Featured AI Topics - ToolVerse",
          description: "Explore our curated collection of featured AI topics including free AI tools, business solutions, and ChatGPT alternatives.",
          datePublished: "2025-09-20",
          dateModified: "2025-09-20",
          author: "ToolVerse Team"
        }}
      />

      {/* Header 导航栏 */}
      <Header />

      {/* 动态背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x / 10}px`,
            top: `${mousePosition.y / 10}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      </div>

      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
          {/* 背景装饰元素 */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float" />
            <div className="absolute top-20 right-20 w-24 h-24 bg-purple-300/10 rounded-full blur-lg animate-float-delay" />
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-300/5 rounded-full blur-2xl animate-pulse" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-full p-6 border border-white/20 shadow-2xl">
                    <svg className="w-20 h-20 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-100 to-indigo-100 bg-clip-text text-transparent animate-gradient">
                Featured AI Topics
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed font-light">
                Discover our curated collection of the most popular AI topics, tools, and resources
              </p>
              
              {/* 统计数据 */}
              <div className="flex justify-center items-center gap-8 mt-12">
                <div className="text-center group">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">100+</div>
                  <div className="text-purple-200 text-sm uppercase tracking-wider">AI Tools</div>
                </div>
                <div className="w-px h-12 bg-purple-300/30" />
                <div className="text-center group">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">3</div>
                  <div className="text-purple-200 text-sm uppercase tracking-wider">Categories</div>
                </div>
                <div className="w-px h-12 bg-purple-300/30" />
                <div className="text-center group">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">2025</div>
                  <div className="text-purple-200 text-sm uppercase tracking-wider">Latest</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Topics Grid */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* 标题部分 */}
          <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Explore Our <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Featured Topics</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each topic is carefully curated with the best tools, resources, and insights in the industry
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredTopics.map((topic, index) => (
              <div
                key={topic.id}
                className={`group relative transition-all duration-700 delay-${index * 200} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
              >
                {/* 卡片光晕效果 */}
                <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-sm" 
                     style={{ background: `linear-gradient(135deg, ${topic.gradient.replace('from-', '').replace('to-', '').replace(' ', ', ')})` }} />
                
                <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                  {/* Card Header with Enhanced Gradient */}
                  <div className={`bg-gradient-to-br ${topic.gradient} p-8 text-white relative overflow-hidden`}>
                    {/* 背景装饰 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl transform -translate-x-4 translate-y-4" />
                    
                    {/* 大背景图标 */}
                    <div className="absolute top-4 right-4 opacity-10 transform rotate-12 scale-150 group-hover:scale-175 group-hover:rotate-6 transition-all duration-700">
                      {topic.icon}
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="bg-white/20 backdrop-blur-xl rounded-xl p-3 border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {React.cloneElement(topic.icon as React.ReactElement, { className: "w-8 h-8" })}
                        </div>
                        <div className="text-right">
                          <div className="text-white/90 text-sm font-medium uppercase tracking-wider">{topic.stats.category}</div>
                          <div className="text-white text-xl font-bold">{topic.stats.tools}</div>
                          <div className="text-white/80 text-xs">Tools Available</div>
                        </div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{topic.title}</h3>
                      <div className="h-1 w-16 bg-white/30 rounded-full group-hover:w-24 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Card Content with Enhanced Design */}
                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                      {topic.description}
                    </p>

                    {/* Enhanced Features Tags */}
                    <div className="mb-8">
                      <div className="flex flex-wrap gap-2">
                        {topic.id === 'best-free-ai-tools-2025' && (
                          <>
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full font-medium shadow-lg transform hover:scale-105 transition-transform">Free Tools</span>
                            <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-full font-medium shadow-lg transform hover:scale-105 transition-transform">Productivity</span>
                            <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-full font-medium shadow-lg transform hover:scale-105 transition-transform">2025 Latest</span>
                          </>
                        )}
                        {topic.id === 'ai-tools-for-small-business' && (
                          <>
                            <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-full font-medium shadow-lg transform hover:scale-105 transition-transform">Business</span>
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full font-medium shadow-lg transform hover:scale-105 transition-transform">ROI Focused</span>
                            <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm rounded-full font-medium shadow-lg transform hover:scale-105 transition-transform">SMB Ready</span>
                          </>
                        )}
                        {topic.id === 'chatgpt-alternatives' && (
                          <>
                            <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-full font-medium shadow-lg transform hover:scale-105 transition-transform">AI Chat</span>
                            <span className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm rounded-full font-medium shadow-lg transform hover:scale-105 transition-transform">Comparisons</span>
                            <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm rounded-full font-medium shadow-lg transform hover:scale-105 transition-transform">Alternatives</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Call to Action */}
                    <Link
                      href={topic.href}
                      className="group/button relative inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Explore Topic</span>
                      <svg className="relative z-10 w-5 h-5 ml-2 group-hover/button:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom CTA Section */}
        <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 text-white overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 via-transparent to-indigo-900/20" />
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300/10 rounded-full blur-2xl animate-float-delay" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-300/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className={`text-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-8">
                <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Looking for More <span className="bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">AI Tools?</span>
              </h2>
              <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Browse our complete collection of AI tools and discover the perfect solution for your needs
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/tools"
                  className="group relative inline-flex items-center bg-white text-purple-700 font-bold py-4 px-10 rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-2xl hover:shadow-white/25 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg className="relative z-10 w-6 h-6 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="relative z-10 text-lg">Browse All Tools</span>
                  <svg className="relative z-10 w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <Link
                  href="/blog"
                  className="group inline-flex items-center bg-transparent border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span>Read Our Blog</span>
                </Link>
              </div>
              
              {/* 底部装饰统计 */}
              <div className="flex justify-center items-center gap-12 mt-16 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">500+</div>
                  <div className="text-purple-200 text-sm">Tools Reviewed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">50+</div>
                  <div className="text-purple-200 text-sm">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">10K+</div>
                  <div className="text-purple-200 text-sm">Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
}