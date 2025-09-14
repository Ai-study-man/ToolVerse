'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function ToolPageEnhancedDemo() {
  // 模拟工具数据
  const mockTool = {
    id: 'demo-tool',
    name: 'Napkin',
    description: 'Napkin turns your text into visuals so sharing your ideas is quick and effective.',
    category: 'Other',
    pricing: 'freemium',
    features: [
      'AI-powered text to visual conversion',
      'Quick and intuitive interface',
      'Multiple export formats',
      'Collaborative editing',
      'Template library',
      'Real-time preview'
    ],
    tags: ['AI', 'Visualization', 'Text-to-Image', 'Productivity', 'Design'],
    website: 'https://napkin.ai',
    created_at: '2025-09-14'
  };

  const mockRelatedTools = [
    {
      id: 'tool1',
      name: 'TTSFree',
      description: 'TTSfree.com is a free online text-to-speech tool that...',
      pricing: 'freemium'
    },
    {
      id: 'tool2', 
      name: 'Namelix',
      description: 'Business Name Generator - Free AI-Powered Naming Tool...',
      pricing: 'freemium'
    },
    {
      id: 'tool3',
      name: 'PDF to Video',
      description: 'Turn PDF or Any Contents into Explainer Video Online Free',
      pricing: 'freemium'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
      {/* 统一的 Header 组件 */}
      <Header />
      
      {/* 优化的面包屑导航 - 与Header对齐 */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* 左侧 - Back to Tools，与 ToolVerse logo 对齐 */}
            <div className="flex items-center">
              <Link 
                href="/tools"
                className="flex items-center text-white/90 hover:text-white transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Tools</span>
              </Link>
            </div>
            
            {/* 右侧 - Tool Details，与 Submit Tool 对齐 */}
            <div className="flex items-center">
              <span className="text-white/80 font-medium">Tool Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left Column - Tool Details (70%) */}
          <div className="lg:col-span-7">
            {/* Tool Details Card */}
            <div className="bg-gradient-to-br from-purple-600/30 via-purple-700/20 to-indigo-600/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-8">
                <div className="flex items-start gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">N</span>
                      </div>
                    </div>
                  </div>

                  {/* Tool Info */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-4xl font-bold text-white mb-3">
                      {mockTool.name}
                    </h1>
                    
                    {/* Category and Pricing Badges */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        <span className="text-lg">⚡</span>
                        {mockTool.category}
                      </span>
                      
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border bg-emerald-500/20 border-emerald-300/30 text-emerald-100">
                        💰 {mockTool.pricing}
                      </span>
                    </div>

                    <p className="text-white/90 text-lg leading-relaxed">
                      {mockTool.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - 紫色渐变背景 */}
              <div className="p-8 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-indigo-500/20">
                <div className="space-y-8">
                  {/* Features */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mockTool.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                          <span className="text-purple-100">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Related Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockTool.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-white/20 text-purple-100 px-4 py-2 rounded-full text-sm font-medium border border-white/30 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tool Information */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Tool Information</h3>
                    <div className="bg-gradient-to-br from-purple-400/30 via-purple-500/20 to-indigo-400/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Official Website */}
                        <div>
                          <h4 className="text-sm font-semibold text-purple-200 mb-2">OFFICIAL WEBSITE</h4>
                          <a
                            href={mockTool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                          >
                            Visit Website
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>

                        {/* Added Date */}
                        <div>
                          <h4 className="text-sm font-semibold text-purple-200 mb-2">ADDED TO DIRECTORY</h4>
                          <p className="text-white font-medium">
                            September 14, 2025
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Related Tools (30%) */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-purple-600/30 via-purple-700/20 to-indigo-600/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden sticky top-8">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  🔗 Related Tools
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  More tools in {mockTool.category}
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-indigo-500/20">
                <div className="space-y-4">
                  {mockRelatedTools.map((relatedTool, index) => (
                    <Link
                      key={index}
                      href={`/tool/${relatedTool.id}`}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                          <span className="text-white font-bold text-lg">
                            {relatedTool.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white group-hover:text-purple-200 transition-colors truncate">
                          {relatedTool.name}
                        </h3>
                        <p className="text-purple-200 text-sm overflow-hidden leading-relaxed" style={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {relatedTool.description}
                        </p>
                        <span className="inline-flex items-center mt-1 text-xs font-medium text-purple-300">
                          💰 {relatedTool.pricing}
                        </span>
                      </div>
                    </Link>
                  ))}
                  
                  {/* View More Link */}
                  <div className="pt-4 border-t border-white/20">
                    <Link
                      href={`/category/${encodeURIComponent(mockTool.category)}`}
                      className="block text-center text-purple-200 hover:text-white font-medium text-sm py-2 transition-colors"
                    >
                      View All Tools in {mockTool.category} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}