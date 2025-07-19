import React, { useState } from 'react';
import { useUserBehavior } from '../hooks/useUserBehavior';

interface ToolCardWithTrackingProps {
  tool: {
    id: string;
    name: string;
    description: string;
    logo: string;
    website: string;
    rating: number;
  };
  userId?: string;
}

/**
 * 带有行为追踪的工具卡片组件示例
 * 展示如何在组件中集成用户行为日志记录
 */
export const ToolCardWithTracking: React.FC<ToolCardWithTrackingProps> = ({ 
  tool, 
  userId 
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const {
    trackFavorite,
    trackUnfavorite,
    trackLike,
    trackUnlike,
    trackRating,
    trackViewTool,
    trackVisitWebsite,
    trackShare,
  } = useUserBehavior(userId);

  // 处理收藏
  const handleFavoriteClick = async () => {
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);

    if (newFavoriteState) {
      await trackFavorite(tool.id);
    } else {
      await trackUnfavorite(tool.id);
    }
  };

  // 处理点赞
  const handleLikeClick = async () => {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);

    if (newLikeState) {
      await trackLike(tool.id);
    } else {
      await trackUnlike(tool.id);
    }
  };

  // 处理评分
  const handleRatingClick = async (rating: number) => {
    setUserRating(rating);
    await trackRating(tool.id, rating);
  };

  // 处理查看工具详情
  const handleViewTool = async () => {
    await trackViewTool(tool.id);
    // 导航到工具详情页
    window.location.href = `/tools/${tool.id}`;
  };

  // 处理访问官网
  const handleVisitWebsite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await trackVisitWebsite(tool.id);
    window.open(tool.website, '_blank', 'noopener,noreferrer');
  };

  // 处理分享
  const handleShare = async (platform: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await trackShare(tool.id, platform);
    
    const shareUrl = `${window.location.origin}/tools/${tool.id}`;
    const shareText = `Check out ${tool.name}: ${tool.description}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleViewTool}
    >
      {/* 工具基本信息 */}
      <div className="flex items-start space-x-4 mb-4">
        <img 
          src={tool.logo} 
          alt={`${tool.name} logo`}
          className="w-12 h-12 rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {tool.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>

      {/* 评分显示 */}
      <div className="flex items-center space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={(e) => {
              e.stopPropagation();
              handleRatingClick(star);
            }}
            className={`w-4 h-4 ${
              star <= (userRating || tool.rating) 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
        <span className="text-sm text-gray-500 ml-2">
          {userRating > 0 ? `Your rating: ${userRating}` : `${tool.rating}/5`}
        </span>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* 收藏按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteClick();
            }}
            className={`p-2 rounded-lg transition-colors ${
              isFavorited 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Favorite"
          >
            <svg className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* 点赞按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikeClick();
            }}
            className={`p-2 rounded-lg transition-colors ${
              isLiked 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Like"
          >
            <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </button>

          {/* 分享按钮 */}
          <div className="relative group">
            <button
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Share"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            
            {/* 分享下拉菜单 */}
            <div className="absolute bottom-full left-0 mb-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={(e) => handleShare('twitter', e)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
              >
                Twitter
              </button>
              <button
                onClick={(e) => handleShare('linkedin', e)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                LinkedIn
              </button>
              <button
                onClick={(e) => handleShare('copy', e)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* 访问官网按钮 */}
        <button
          onClick={handleVisitWebsite}
          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
        >
          Visit Website
        </button>
      </div>
    </div>
  );
};

export default ToolCardWithTracking;
