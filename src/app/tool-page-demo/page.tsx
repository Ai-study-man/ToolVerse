/**
 * 工具详情页面视觉优化演示
 * 展示新设计的工具详情页面元素
 */

'use client';

import React from 'react';

const ToolPageVisualDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
      {/* 顶部导航 */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center text-white/90 hover:text-white transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Demo
            </a>
            <div className="text-sm text-white/70">
              Visual Enhancement Demo
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
            <span className="animate-pulse mr-3">✨</span>
            Tool Page Visual Enhancements
            <span className="animate-pulse ml-3">✨</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Enhanced Tool Details
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
            Experience the redesigned tool information and comments sections with 
            glassmorphism effects and seamless purple gradient integration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* 左列 - 主要演示内容 */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Tool Information 演示 */}
            <div className="bg-white rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  🔧 Enhanced Tool Information Section
                </h2>
                <p className="text-purple-100">
                  Removed border separator and added purple gradient background
                </p>
              </div>
              
              <div className="p-8">
                <div className="space-y-6">
                  {/* 示例特性 */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                        <span className="text-gray-700">Removed visual separation line</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                        <span className="text-gray-700">Added purple gradient background</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                        <span className="text-gray-700">Enhanced color consistency</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                        <span className="text-gray-700">Improved visual hierarchy</span>
                      </li>
                    </ul>
                  </div>

                  {/* 工具信息区域 - 新设计 */}
                  <div className="pt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tool Information</h3>
                    <div className="bg-gradient-to-br from-purple-50 via-purple-100/50 to-indigo-50 rounded-2xl p-6 border border-purple-100 shadow-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-purple-700 mb-2">OFFICIAL WEBSITE</h4>
                          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                            Visit Website
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-purple-700 mb-2">ADDED TO DIRECTORY</h4>
                          <p className="text-purple-900 font-medium">September 14, 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments 演示 */}
            <div className="relative group">
              {/* 外部光晕效果 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-purple-500/15 to-indigo-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-105"></div>
              
              {/* 主容器 - 玻璃态效果 */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-500">
                
                {/* 顶部装饰线 */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                
                {/* Header */}
                <div className="px-8 py-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="text-3xl">💬</span>
                      Enhanced Comments Section
                    </h2>
                    <p className="text-white/80 text-sm mt-1">Glassmorphism design with purple gradient integration</p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8 relative">
                  <div className="text-center py-12">
                    <div className="relative inline-block mb-6">
                      <div className="text-8xl opacity-30 text-white animate-pulse">💬</div>
                      <div className="absolute inset-0 text-8xl opacity-20 text-purple-300 animate-ping"></div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Visual Enhancement Features
                    </h3>
                    
                    {/* 特性列表 */}
                    <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-2xl mb-2">💎</div>
                        <div className="font-semibold text-white text-sm">Glassmorphism</div>
                        <div className="text-white/70 text-xs">Semi-transparent glass effect</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-2xl mb-2">🌈</div>
                        <div className="font-semibold text-white text-sm">Gradient Integration</div>
                        <div className="text-white/70 text-xs">Seamless purple background blend</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-2xl mb-2">✨</div>
                        <div className="font-semibold text-white text-sm">Hover Effects</div>
                        <div className="text-white/70 text-xs">Interactive glow and animation</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-2xl mb-2">🎨</div>
                        <div className="font-semibold text-white text-sm">Visual Hierarchy</div>
                        <div className="text-white/70 text-xs">Clear content organization</div>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-3">
                      <div className="relative overflow-hidden bg-white/10 backdrop-blur-sm text-white/70 px-8 py-4 rounded-2xl font-medium border border-white/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20"></div>
                        <div className="relative flex items-center gap-2">
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Enhanced Design
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-center gap-2 text-white/60">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/30"></div>
                      <span className="text-sm font-medium px-4">Modern Visual Experience</span>
                      <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/30"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              </div>
            </div>
          </div>

          {/* 右列 - 说明文档 */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-white mb-4">🎨 Design Changes</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-white mb-2">1. Removed Separator Line</h4>
                  <p className="text-white/80">Eliminated the border-top line in Tool Information section for cleaner appearance.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">2. Purple Gradient Background</h4>
                  <p className="text-white/80">Added subtle purple gradient to Tool Information container for visual consistency.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">3. Glassmorphism Comments</h4>
                  <p className="text-white/80">Redesigned Comments section with modern glass effect and purple integration.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">4. Enhanced Interactions</h4>
                  <p className="text-white/80">Added hover effects, animations, and improved visual feedback.</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/20">
                <a 
                  href="/"
                  className="inline-flex items-center text-purple-300 hover:text-white transition-colors text-sm font-medium"
                >
                  ← Back to Homepage
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPageVisualDemo;