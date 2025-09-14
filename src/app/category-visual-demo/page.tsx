/**
 * 分类卡片视觉效果演示页面
 * 展示新设计的分类卡片与紫色渐变背景的完美搭配
 */

'use client';

import React from 'react';
import { getCategoriesWithIcons } from '../../utils/categoryIcons';
import CategoryCard from '../../components/CategoryCard';

const CategoryVisualDemo: React.FC = () => {
  const categories = getCategoriesWithIcons();
  
  // 模拟工具数量
  const mockToolCounts = [67, 57, 66, 50, 66, 79, 20, 6, 20, 9, 42];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-accent-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-32 w-80 h-80 bg-secondary-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* 主要内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
            <span className="animate-bounce mr-3">✨</span>
            Visual Design Showcase
            <span className="animate-bounce ml-3">✨</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Enhanced Category Cards
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
            Experience the new visually stunning category cards designed to perfectly complement 
            the purple gradient background with glassmorphism effects, unique color themes, and enhanced user interactions.
          </p>
          
          {/* 设计特性 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-semibold text-white text-sm">Unique Themes</div>
              <div className="text-white/70 text-xs">Each category has its own color palette</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl mb-2">💎</div>
              <div className="font-semibold text-white text-sm">Glassmorphism</div>
              <div className="text-white/70 text-xs">Modern glass-like transparency effects</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold text-white text-sm">Smooth Animations</div>
              <div className="text-white/70 text-xs">Fluid hover effects and transitions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl mb-2">🌈</div>
              <div className="font-semibold text-white text-sm">Visual Hierarchy</div>
              <div className="text-white/70 text-xs">Enhanced readability and focus</div>
            </div>
          </div>
        </div>

        {/* 分类卡片展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-10">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              category={{
                id: (index + 1).toString(),
                name: category.name,
                description: category.name === 'Writing & Content' 
                  ? 'AI tools for content creation, writing assistance, and copywriting'
                  : category.name === 'Image Generation & Design'
                  ? 'AI-powered design tools, image generation, and creative assistance'
                  : category.name === 'Video & Audio'
                  ? 'AI tools for video editing, creation, and multimedia production'
                  : category.name === 'Chatbots & Assistants'
                  ? 'AI chatbots, virtual assistants, and conversational AI'
                  : category.name === 'Productivity'
                  ? 'AI tools to enhance workflow, automation, and efficiency'
                  : category.name === 'Developer Tools'
                  ? 'AI coding assistants, debugging tools, and development productivity'
                  : category.name === 'Education & Learning'
                  ? 'AI-powered learning platforms, tutoring, and educational resources'
                  : category.name === 'Healthcare & Legal'
                  ? 'AI applications for healthcare, medical analysis, legal tools, and compliance'
                  : category.name === 'Research & Analysis'
                  ? 'AI-powered research tools, data analysis, and business intelligence'
                  : category.name === 'Marketing & SEO'
                  ? 'AI-driven marketing tools, analytics, and campaign optimization'
                  : 'General-purpose AI utilities and miscellaneous tools',
                slug: category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
                toolCount: mockToolCounts[index] || 0
              }}
              icon={category.icon}
              toolCount={mockToolCounts[index] || 0}
              onClick={() => console.log(`Clicked ${category.name}`)}
            />
          ))}
        </div>

        {/* 设计说明 */}
        <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Design Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">🎨 Visual Enhancements</h3>
              <ul className="space-y-2 text-white/80">
                <li>• <strong>Unique Color Themes:</strong> Each category has its own gradient and accent colors</li>
                <li>• <strong>Glassmorphism Effect:</strong> Semi-transparent backgrounds with backdrop blur</li>
                <li>• <strong>Gradient Icons:</strong> Beautifully styled icon containers with gradients</li>
                <li>• <strong>Layered Lighting:</strong> Multiple light effects for depth and dimension</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">⚡ Interaction Design</h3>
              <ul className="space-y-2 text-white/80">
                <li>• <strong>Smooth Transitions:</strong> 500ms duration for polished animations</li>
                <li>• <strong>Transform Effects:</strong> Hover lift, scale, and rotation animations</li>
                <li>• <strong>Progressive Disclosure:</strong> Additional elements appear on hover</li>
                <li>• <strong>Visual Feedback:</strong> Clear hover states and click interactions</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="font-semibold text-white mb-2">🌟 Color Psychology</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Each category uses carefully selected colors that match its purpose: warm oranges and reds for creative content, 
              cool blues and purples for technical tools, greens for productivity and learning, and sophisticated gradients 
              that complement the overall purple theme while maintaining excellent contrast and readability.
            </p>
          </div>
        </div>
        
        {/* 返回链接 */}
        <div className="text-center mt-12">
          <a 
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-accent-600 to-accent-700 text-white px-8 py-3 rounded-lg hover:from-accent-700 hover:to-accent-800 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default CategoryVisualDemo;