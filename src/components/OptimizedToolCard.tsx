'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { Tool } from '../types';

interface OptimizedToolCardProps {
  tool: Tool;
  priority?: boolean;
  lazy?: boolean;
  showStats?: boolean;
  compact?: boolean;
}

function OptimizedToolCard({ 
  tool, 
  priority = false, 
  lazy = true, 
  showStats = true,
  compact = false 
}: OptimizedToolCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(tool.likes || 0);
  const [imageError, setImageError] = useState(false);

  // 处理点赞
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 乐观更新UI
    setIsLiked(!isLiked);
    setLikeCount((prev: number) => isLiked ? prev - 1 : prev + 1);
    
    try {
      // 这里可以调用API更新点赞状态
      // await updateToolLikes(tool.id, !isLiked);
    } catch (error) {
      // 出错时回滚UI状态
      setIsLiked(isLiked);
      setLikeCount(tool.likes || 0);
    }
  };

  // 获取定价显示文本
  const getPricingText = () => {
    if (tool.pricingModel === 'free') return 'Free';
    if (tool.pricingModel === 'freemium') return 'Freemium';
    if (tool.pricing) return tool.pricing;
    return 'Contact for pricing';
  };

  // 获取定价颜色
  const getPricingColor = () => {
    if (tool.pricingModel === 'free') return 'text-green-600 bg-green-100';
    if (tool.pricingModel === 'freemium') return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const cardContent = (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all duration-200 group overflow-hidden ${
      compact ? 'p-4' : 'p-6'
    }`}>
      {/* 工具Logo和基本信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} flex-shrink-0 rounded-lg overflow-hidden bg-gray-100`}>
            {tool.logo && !imageError ? (
              <Image
                src={tool.logo.startsWith('/') ? tool.logo : `/logos/${tool.logo}`}
                alt={`${tool.name} logo`}
                width={compact ? 40 : 48}
                height={compact ? 40 : 48}
                className="w-full h-full object-cover"
                priority={priority}
                loading={priority ? 'eager' : lazy ? 'lazy' : 'eager'}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-gray-400 ${
                compact ? 'text-sm' : 'text-lg'
              } font-bold`}>
                {tool.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate ${
              compact ? 'text-sm' : 'text-lg'
            }`}>
              {tool.name}
            </h3>
            {!compact && (
              <p className="text-sm text-gray-500 truncate">
                {tool.category}
              </p>
            )}
          </div>
        </div>

        {/* 点赞按钮 */}
        <button
          onClick={handleLike}
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          {isLiked ? (
            <HeartIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartOutlineIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* 工具描述 */}
      <p className={`text-gray-600 mb-4 ${compact ? 'text-sm line-clamp-2' : 'line-clamp-3'}`}>
        {tool.description}
      </p>

      {/* 标签和特性 */}
      {!compact && tool.features && tool.features.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {tool.features.slice(0, 3).map((feature, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {feature}
            </span>
          ))}
          {tool.features.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
              +{tool.features.length - 3}
            </span>
          )}
        </div>
      )}

      {/* 评分和统计 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {tool.rating && (
            <div className="flex items-center space-x-1">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">
                {tool.rating.toFixed(1)}
              </span>
            </div>
          )}
          
          {showStats && (
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <HeartIcon className="w-3 h-3" />
                <span>{likeCount}</span>
              </div>
              {tool.views && (
                <div className="flex items-center space-x-1">
                  <EyeIcon className="w-3 h-3" />
                  <span>{tool.views}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 定价 */}
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPricingColor()}`}>
          {getPricingText()}
        </span>
      </div>

      {/* 悬停效果指示器 */}
      {!compact && (
        <div className="absolute inset-x-4 bottom-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <div className="bg-primary-600 text-white text-center px-3 py-2 rounded-lg text-sm font-medium">
            Click to view details
          </div>
        </div>
      )}
    </div>
  );

  if (compact) {
    return (
      <Link href={`/tools/${tool.id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return (
    <Link href={`/tools/${tool.id}`} className="block relative">
      {cardContent}
    </Link>
  );
}

// 使用React.memo优化重新渲染
export default memo(OptimizedToolCard);

// 工具卡片骨架屏
export function ToolCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse ${
      compact ? 'p-4' : 'p-6'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} bg-gray-200 rounded-lg`} />
          <div className="flex-1">
            <div className={`bg-gray-200 rounded ${compact ? 'h-4 w-20' : 'h-5 w-24'} mb-2`} />
            {!compact && <div className="bg-gray-200 rounded h-3 w-16" />}
          </div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded-full" />
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="bg-gray-200 rounded h-4 w-full" />
        <div className="bg-gray-200 rounded h-4 w-3/4" />
        {!compact && <div className="bg-gray-200 rounded h-4 w-1/2" />}
      </div>
      
      {!compact && (
        <div className="flex gap-1 mb-4">
          <div className="bg-gray-200 rounded-full h-6 w-16" />
          <div className="bg-gray-200 rounded-full h-6 w-20" />
          <div className="bg-gray-200 rounded-full h-6 w-12" />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 rounded h-4 w-12" />
          <div className="bg-gray-200 rounded h-3 w-8" />
        </div>
        <div className="bg-gray-200 rounded-full h-6 w-16" />
      </div>
    </div>
  );
}
