'use client';

import React, { memo } from 'react';
import { Category } from '@/types/tool';

interface CategoryCardProps {
  category: Category;
  icon: string;
  toolCount: number;
  onClick: () => void;
}

// 定义每个分类的特定颜色主题
const getCategoryTheme = (categoryName: string) => {
  const themes: Record<string, { gradient: string; iconBg: string; accent: string }> = {
    'Writing & Content': {
      gradient: 'from-orange-400/20 via-red-400/15 to-pink-400/20',
      iconBg: 'bg-gradient-to-br from-orange-400 to-red-500',
      accent: 'text-orange-300'
    },
    'Image Generation & Design': {
      gradient: 'from-pink-400/20 via-purple-400/15 to-indigo-400/20',
      iconBg: 'bg-gradient-to-br from-pink-400 to-purple-500',
      accent: 'text-pink-300'
    },
    'Video & Audio': {
      gradient: 'from-blue-400/20 via-indigo-400/15 to-purple-400/20',
      iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
      accent: 'text-blue-300'
    },
    'Chatbots & Assistants': {
      gradient: 'from-emerald-400/20 via-teal-400/15 to-cyan-400/20',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      accent: 'text-emerald-300'
    },
    'Productivity': {
      gradient: 'from-yellow-400/20 via-orange-400/15 to-red-400/20',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      accent: 'text-yellow-300'
    },
    'Developer Tools': {
      gradient: 'from-indigo-400/20 via-blue-400/15 to-cyan-400/20',
      iconBg: 'bg-gradient-to-br from-indigo-400 to-blue-500',
      accent: 'text-indigo-300'
    },
    'Education & Learning': {
      gradient: 'from-green-400/20 via-emerald-400/15 to-teal-400/20',
      iconBg: 'bg-gradient-to-br from-green-400 to-emerald-500',
      accent: 'text-green-300'
    },
    'Healthcare & Legal': {
      gradient: 'from-teal-400/20 via-cyan-400/15 to-blue-400/20',
      iconBg: 'bg-gradient-to-br from-teal-400 to-cyan-500',
      accent: 'text-teal-300'
    },
    'Research & Analysis': {
      gradient: 'from-purple-400/20 via-violet-400/15 to-indigo-400/20',
      iconBg: 'bg-gradient-to-br from-purple-400 to-violet-500',
      accent: 'text-purple-300'
    },
    'Marketing & SEO': {
      gradient: 'from-rose-400/20 via-pink-400/15 to-purple-400/20',
      iconBg: 'bg-gradient-to-br from-rose-400 to-pink-500',
      accent: 'text-rose-300'
    },
    'Other': {
      gradient: 'from-gray-400/20 via-slate-400/15 to-zinc-400/20',
      iconBg: 'bg-gradient-to-br from-gray-400 to-slate-500',
      accent: 'text-gray-300'
    }
  };
  
  return themes[categoryName] || themes['Other'];
};

const CategoryCard = memo(({ category, icon, toolCount, onClick }: CategoryCardProps) => {
  const theme = getCategoryTheme(category.name);
  
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* 主卡片容器 - 玻璃态效果 */}
      <div className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${theme.gradient}
        backdrop-blur-xl border border-white/20 
        hover:border-white/40 transition-all duration-500
        hover:transform hover:-translate-y-2 hover:scale-[1.02]
        shadow-lg hover:shadow-2xl hover:shadow-black/20
      `}>
        
        {/* 背景装饰光晕 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        {/* 图标容器 */}
        <div className="relative z-10 mb-4">
          <div className={`
            inline-flex items-center justify-center w-16 h-16 rounded-2xl
            ${theme.iconBg} shadow-lg
            group-hover:scale-110 group-hover:rotate-3 
            transition-all duration-500 ease-out
          `}>
            <span className="text-2xl text-white filter drop-shadow-lg">
              {icon}
            </span>
          </div>
          
          {/* 图标装饰光环 */}
          <div className={`
            absolute inset-0 w-16 h-16 rounded-2xl
            ${theme.iconBg} opacity-20 blur-xl scale-150
            group-hover:scale-[2] transition-all duration-700
          `}></div>
        </div>
        
        {/* 内容区域 */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white/95 transition-colors duration-300">
            {category.name}
          </h3>
          
          <p className="text-white/80 text-sm leading-relaxed mb-4 group-hover:text-white/90 transition-colors duration-300">
            {category.description}
          </p>
          
          {/* 工具数量和箭头 */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${theme.accent} group-hover:text-white transition-colors duration-300`}>
              {toolCount} tools
            </span>
            
            <div className="flex items-center gap-2 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
              <span className="text-xs font-medium">Explore</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* 底部装饰光效 */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* 悬浮时的内部光影 */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      </div>
      
      {/* 外部光晕效果 */}
      <div className={`
        absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 
        bg-gradient-to-br ${theme.gradient.replace(/\/20/g, '/40').replace(/\/15/g, '/30')}
        transition-opacity duration-700 -z-10 scale-105
      `}></div>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
